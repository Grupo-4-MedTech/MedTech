CREATE DATABASE medtech;
USE medtech;
GO

CREATE TABLE endereco(
    idEndereco INT PRIMARY KEY IDENTITY(1,1),
    cep CHAR(8),
    rua VARCHAR(100) NOT NULL,
    numero INT NOT NULL,
    complemento VARCHAR(255),
    uf CHAR(2) NOT NULL
);

CREATE TABLE hospital(
    idHospital INT PRIMARY KEY IDENTITY(1,1),
    nomeFantasia VARCHAR(100),
    razaoSocial VARCHAR(100) NOT NULL,
    cnpj CHAR(14) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    dtCriacao DATETIME DEFAULT GETDATE(),
    verificado BIT,
    fkEndereco INT NOT NULL,
    FOREIGN KEY (fkEndereco) REFERENCES endereco(idEndereco)
);

CREATE TABLE filtroFerramenta (
    idFiltroFerramenta INT PRIMARY KEY IDENTITY(1,1),
    nome VARCHAR(100) NOT NULL,
    fkHospital INT NOT NULL,
    FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE funcionario(
    idFuncionario INT PRIMARY KEY IDENTITY(1000,1),
    nome VARCHAR(100),
    cpf CHAR(11) UNIQUE,
    telefone CHAR(11),
    cargo VARCHAR(45),
    CHECK (cargo IN ('MEDICO_GERENTE','TECNICO_TI','GESTOR_TI')),
    token CHAR(255),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    fkHospital INT,
    FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE configEmail (
    idConfigEmail INT PRIMARY KEY IDENTITY(1000,1),
    host VARCHAR(100),
    port INT,
    email VARCHAR(100),
    pass VARCHAR(255),
    fkFuncionario INT,
    FOREIGN KEY (fkFuncionario) REFERENCES funcionario (idFuncionario) ON DELETE CASCADE
);

CREATE TABLE departamento(
    idDepartamento INT PRIMARY KEY IDENTITY(1,1),
    nome VARCHAR(45),
    fkHospital INT NOT NULL,
    FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE acesso(
    fkFuncionario INT,
    fkDepartamento INT,
    fkHospital INT,
    responsavel BIT,
    PRIMARY KEY (fkFuncionario, fkDepartamento, fkHospital),
    FOREIGN KEY (fkFuncionario) REFERENCES funcionario(idFuncionario),
    FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE computador(
   idComputador INT PRIMARY KEY IDENTITY(1,1),
   nome VARCHAR(50),
   status VARCHAR(50) DEFAULT 'estável',
   atividade BIT DEFAULT 0,
   dtStatusUpdate DATETIME DEFAULT GETDATE(),
   modeloProcessador VARCHAR(255),
   codPatrimonio VARCHAR(7) UNIQUE,
   senha VARCHAR(255),
   gbRAM FLOAT,
   gbDisco FLOAT,
   fkDepartamento INT NOT NULL,
   fkHospital INT NOT NULL,
   CHECK (status IN('crítico', 'alerta', 'estável')),
   FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
   FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE logAtividade(
    idLogAtividade INT PRIMARY KEY IDENTITY(1,1),
    atividade BIT NOT NULL,
    dtOcorrencia DATETIME DEFAULT GETDATE(),
    fkComputador INT NOT NULL,
    fkDepartamento INT NOT NULL,
    fkHospital INT NOT NULL,
    FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE logComputador (
    idLogComputador INT PRIMARY KEY IDENTITY(1,1),
    grau VARCHAR(7),
    causa VARCHAR(50),
    dtOcorrencia DATETIME DEFAULT GETDATE(),
    fkComputador INT NOT NULL,
    fkDepartamento INT NOT NULL,
    fkHospital INT NOT NULL,
    CHECK (grau IN('crítico', 'alerta', 'estável')),
    CHECK (causa IN('ram', 'cpu', 'disco')),
    FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE leituraRamCpu(
    idLeituraRamCpu INT PRIMARY KEY IDENTITY(1,1),
    ram FLOAT,
    cpu FLOAT,
    dataLeitura DATETIME DEFAULT GETDATE(),
    fkComputador INT NOT NULL,
    fkDepartamento INT NOT NULL,
    fkHospital INT NOT NULL,
    FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE leituraDisco(
    idLeituraDisco INT PRIMARY KEY IDENTITY(1,1),
    disco FLOAT,
    dataLeitura DATETIME DEFAULT GETDATE(),
    fkComputador INT NOT NULL,
    fkDepartamento INT NOT NULL,
    fkHospital INT NOT NULL,
    FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE leituraFerramenta(
    idLeituraFerramenta INT PRIMARY KEY IDENTITY(1,1),
    nomeApp VARCHAR(255),
    dtLeitura DATETIME DEFAULT GETDATE(),
    caminho VARCHAR(255),
    fkComputador INT NOT NULL,
    fkDepartamento INT NOT NULL,
    fkHospital INT NOT NULL,
    FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE metrica (
    idMetrica INT PRIMARY KEY IDENTITY(1,1),
    alertaCpu FLOAT,
    alertaCritCpu FLOAT,
    alertaRam FLOAT,
    alertaCritRam FLOAT,
    alertaDisco FLOAT,
    alertaCritDisco FLOAT,
    fkComputador INT,
    fkDepartamento INT,
    fkHospital INT,
    FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital),
    FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento)
);

CREATE TABLE contaMedtech(
    idContaMedtech INT PRIMARY KEY IDENTITY(1,1),
    nome VARCHAR(100),
    cpf CHAR(11) UNIQUE,
    token CHAR(255),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255)
);

-- View
CREATE VIEW hospitalWithEndereco AS
SELECT * FROM hospital JOIN endereco ON fkEndereco = idEndereco;


CREATE PROCEDURE delete_hospital
@id INT
AS
BEGIN
    DELETE FROM leituraDisco WHERE fkHospital = @id;
    DELETE FROM leituraRamCpu WHERE fkHospital = @id;
    DELETE FROM leituraFerramenta WHERE fkHospital = @id;
    DELETE FROM metrica WHERE fkHospital = @id;
    DELETE FROM logComputador WHERE fkHospital = @id;
    DELETE FROM logAtividade WHERE fkHospital = @id;
    DELETE FROM computador WHERE fkHospital = @id;
    DELETE FROM acesso WHERE fkHospital = @id;
    DELETE FROM funcionario WHERE fkHospital = @id;
    DELETE FROM departamento WHERE fkHospital = @id;
    DELETE FROM filtroFerramenta WHERE fkHospital = @id;
    DELETE FROM hospital WHERE idHospital = @id;
END;
GO

CREATE PROCEDURE delete_computador
@id INT
AS
BEGIN
    DELETE FROM metrica WHERE fkComputador = @id;
    DELETE FROM logComputador WHERE fkComputador = @id;
    DELETE FROM logAtividade WHERE fkComputador = @id;
    DELETE FROM leituraDisco WHERE fkComputador = @id;
    DELETE FROM leituraRamCpu WHERE fkComputador = @id;
    DELETE FROM leituraFerramenta WHERE fkComputador = @id;
    DELETE FROM computador WHERE idComputador = @id;
END;
GO

CREATE PROCEDURE delete_funcionario
@id INT
AS
BEGIN
    DELETE FROM acesso WHERE fkFuncionario = @id;
    DELETE FROM funcionario WHERE idFuncionario = @id;
END;
GO

CREATE TRIGGER insertEmailConfigAfterFunc
    ON funcionario
    AFTER
    INSERT
    AS
BEGIN
    DECLARE @fkFunc INT;
    SELECT @fkFunc = idFuncionario FROM inserted;
    INSERT INTO configEmail (host, port, email, pass, fkFuncionario) VALUES
    ('', 0, '', '', @fkFunc);
END;
GO

CREATE PROCEDURE InserirHospital
    @cep VARCHAR(8),
    @rua VARCHAR(100),
    @numero INT,
    @complemento VARCHAR(100),
    @uf CHAR(2),
    @razaoSocial VARCHAR(100),
    @nomeFantasia VARCHAR(100),
    @cnpj VARCHAR(14),
    @email VARCHAR(100),
    @senha VARCHAR(100)
AS
BEGIN
    DECLARE @idEndereco INT
    DECLARE @idHospital INT

    INSERT INTO endereco (cep, rua, numero, complemento, uf)
    VALUES (@cep, @rua, @numero, @complemento, @uf);

    SET @idEndereco = SCOPE_IDENTITY();

    INSERT INTO hospital (razaoSocial, nomeFantasia, cnpj, email, senha, fkEndereco, verificado)
    VALUES (@razaoSocial, @nomeFantasia, @cnpj, @email, @senha, @idEndereco, 0);

    SET @idHospital = SCOPE_IDENTITY();

    SELECT * FROM hospitalWithEndereco WHERE idHospital = @idHospital;
END;
GO

CREATE TRIGGER insertMetrica
    ON computador
    AFTER INSERT
    AS
BEGIN
    INSERT INTO metrica (alertaCpu, alertaCritCpu, alertaRam, alertaCritRam, alertaDisco, alertaCritDisco, fkComputador, fkDepartamento, fkHospital)
    VALUES (0.7, 1, 0.75, 1, 0.8, 1, (SELECT idComputador FROM inserted), (SELECT fkDepartamento FROM inserted), (SELECT fkHospital FROM inserted));
END;
GO


CREATE TRIGGER insertLogCompAfterRamCpu
    ON leituraRamCpu
    AFTER INSERT
    AS
BEGIN
    DECLARE @ram FLOAT, @cpu FLOAT, @fkComputador INT, @fkDepartamento INT, @fkHospital INT;
    SELECT @ram = ram, @cpu = cpu, @fkComputador = fkComputador, @fkDepartamento = fkDepartamento, @fkHospital = fkHospital FROM inserted;

    IF @ram / 100 >= (SELECT alertaCritRam FROM metrica WHERE fkComputador = @fkComputador)
        BEGIN
            INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES ('crítico', 'ram', @fkComputador, @fkDepartamento, @fkHospital);
        END
    ELSE IF @ram / 100 >= (SELECT alertaRam FROM metrica WHERE fkComputador = @fkComputador)
        BEGIN
            INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES ('alerta', 'ram', @fkComputador, @fkDepartamento, @fkHospital);
        END
    ELSE
        BEGIN
            INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES ('estável', 'ram', @fkComputador, @fkDepartamento, @fkHospital);
        END;

    IF @cpu / 100 >= (SELECT alertaCritCpu FROM metrica WHERE fkComputador = @fkComputador)
        BEGIN
            INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES ('crítico', 'cpu', @fkComputador, @fkDepartamento, @fkHospital);
        END
    ELSE IF @cpu / 100 >= (SELECT alertaCpu FROM metrica WHERE fkComputador = @fkComputador)
        BEGIN
            INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES ('alerta', 'cpu', @fkComputador, @fkDepartamento, @fkHospital);
        END
    ELSE
        BEGIN
            INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES ('estável', 'cpu', @fkComputador, @fkDepartamento, @fkHospital);
        END;
END;
GO


CREATE TRIGGER insertLogCompAfterLeituraDisco
    ON leituraDisco
    AFTER INSERT
    AS
BEGIN
    DECLARE @disco FLOAT, @fkComputador INT, @fkDepartamento INT, @fkHospital INT;
    SELECT @disco = disco, @fkComputador = fkComputador, @fkDepartamento = fkDepartamento, @fkHospital = fkHospital FROM inserted;

    IF @disco / 100 >= (SELECT alertaCritDisco FROM metrica WHERE fkComputador = @fkComputador)
        BEGIN
            INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES ('crítico', 'disco', @fkComputador, @fkDepartamento, @fkHospital);
        END
    ELSE IF @disco / 100 >= (SELECT alertaDisco FROM metrica WHERE fkComputador = @fkComputador)
        BEGIN
            INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES ('alerta', 'disco', @fkComputador, @fkDepartamento, @fkHospital);
        END
    ELSE
        BEGIN
            INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES ('estável', 'disco', @fkComputador, @fkDepartamento, @fkHospital);
        END;
END;
GO


CREATE TRIGGER verifyComputadorStatus
    ON logComputador
    AFTER INSERT
    AS
BEGIN
    DECLARE @fkComputador INT, @dtOcorrencia DATETIME;
    SELECT @fkComputador = fkComputador, @dtOcorrencia = dtOcorrencia FROM inserted;

    IF NOT (
        (SELECT TOP 1 grau FROM logComputador WHERE fkComputador = @fkComputador AND causa = 'cpu' ORDER BY dtOcorrencia DESC) = (SELECT status FROM computador WHERE idComputador = @fkComputador)
            AND (SELECT TOP 1 grau FROM logComputador WHERE fkComputador = @fkComputador AND causa = 'ram' ORDER BY dtOcorrencia DESC) = (SELECT status FROM computador WHERE idComputador = @fkComputador)
            AND (SELECT TOP 1 grau FROM logComputador WHERE fkComputador = @fkComputador AND causa = 'disco' ORDER BY dtOcorrencia DESC) = (SELECT status FROM computador WHERE idComputador = @fkComputador)
        )
        BEGIN
            IF (SELECT TOP 1 grau FROM logComputador WHERE fkComputador = @fkComputador AND causa = 'cpu' ORDER BY dtOcorrencia DESC) = 'crítico'
                OR (SELECT TOP 1 grau FROM logComputador WHERE fkComputador = @fkComputador AND causa = 'ram' ORDER BY dtOcorrencia DESC) = 'crítico'
                OR (SELECT TOP 1 grau FROM logComputador WHERE fkComputador = @fkComputador AND causa = 'disco' ORDER BY dtOcorrencia DESC) = 'crítico'
                BEGIN
                    UPDATE computador
                    SET status = 'crítico', dtStatusUpdate = @dtOcorrencia
                    WHERE idComputador = @fkComputador;
                END
            ELSE IF (SELECT TOP 1 grau FROM logComputador WHERE fkComputador = @fkComputador AND causa = 'cpu' ORDER BY dtOcorrencia DESC) = 'alerta'
                OR (SELECT TOP 1 grau FROM logComputador WHERE fkComputador = @fkComputador AND causa = 'ram' ORDER BY dtOcorrencia DESC) = 'alerta'
                OR (SELECT TOP 1 grau FROM logComputador WHERE fkComputador = @fkComputador AND causa = 'disco' ORDER BY dtOcorrencia DESC) = 'alerta'
                BEGIN
                    UPDATE computador
                    SET status = 'alerta', dtStatusUpdate = @dtOcorrencia
                    WHERE idComputador = @fkComputador;
                END
            ELSE
                BEGIN
                    UPDATE computador
                    SET status = 'estável', dtStatusUpdate = @dtOcorrencia
                    WHERE idComputador = @fkComputador;
                END
        END
END;
GO

CREATE TRIGGER insertLogAtvAfterCompUpdate
    ON computador
    AFTER UPDATE
    AS
BEGIN
    IF UPDATE(atividade)
        BEGIN
            DECLARE @newAtividade INT, @oldAtividade INT, @idComputador INT, @fkDepartamento INT, @fkHospital INT;

            SELECT @newAtividade = i.atividade,
                   @oldAtividade = d.atividade,
                   @idComputador = i.idComputador,
                   @fkDepartamento = i.fkDepartamento,
                   @fkHospital = i.fkHospital
            FROM inserted i
                     JOIN deleted d ON i.idComputador = d.idComputador;

            IF @oldAtividade <> @newAtividade
                BEGIN
                    INSERT INTO logAtividade (atividade, dtOcorrencia, fkComputador, fkDepartamento, fkHospital)
                    VALUES (@newAtividade, GETDATE(), @idComputador, @fkDepartamento, @fkHospital);
                END
        END
END;
GO


CREATE TRIGGER deleteHospital
    ON hospital
    AFTER DELETE
    AS
BEGIN
    DELETE FROM endereco WHERE idEndereco = (SELECT fkEndereco FROM deleted);
END;
GO

CREATE PROCEDURE dbo.SetComputadorAtividade
AS
BEGIN
    UPDATE c
    SET c.atividade = 0
    FROM computador c
             LEFT JOIN (
        SELECT fkComputador, MAX(dataLeitura) AS ultimaLeitura
        FROM leituraRamCpu
        GROUP BY fkComputador
    ) l ON c.idComputador = l.fkComputador
    WHERE l.ultimaLeitura IS NULL OR l.ultimaLeitura <= DATEADD(HOUR, -1, CURRENT_TIMESTAMP);

    UPDATE c
    SET c.atividade = 1
    FROM computador c
             LEFT JOIN (
        SELECT fkComputador, MAX(dataLeitura) AS ultimaLeitura
        FROM leituraRamCpu
        GROUP BY fkComputador
    ) l ON c.idComputador = l.fkComputador
    WHERE l.ultimaLeitura > DATEADD(HOUR, -1, CURRENT_TIMESTAMP);
END;
GO

-- Drop the job if it already exists
IF EXISTS (SELECT 1 FROM msdb.dbo.sysjobs WHERE name = N'SetComputadorAtividadeJob')
    BEGIN
        EXEC msdb.dbo.sp_delete_job @job_name = N'SetComputadorAtividadeJob';
    END;
GO

-- Create the job
EXEC msdb.dbo.sp_add_job
     @job_name = N'SetComputadorAtividadeJob',
     @enabled = 1,
     @description = N'Update atividade status for computador every 10 minutes';

-- Add a step to the job
EXEC msdb.dbo.sp_add_jobstep
     @job_name = N'SetComputadorAtividadeJob',
     @step_name = N'Execute SetComputadorAtividade',
     @subsystem = N'TSQL',
     @command = N'EXEC medtech.dbo.SetComputadorAtividade;', -- Replace with your database name
     @database_name = N'medtech', -- Replace with your database name
     @on_success_action = 1,
     @on_fail_action = 2;
GO

-- Schedule the job to run every 10 minutes
EXEC msdb.dbo.sp_add_schedule
     @schedule_name = N'Every 10 Minutes',
     @freq_type = 4,  -- Daily
     @freq_interval = 1,  -- Every day
     @freq_subday_type = 4,  -- Minutes
     @freq_subday_interval = 10,  -- Every 10 minutes
     @active_start_time = 0;
GO

-- Attach the schedule to the job
EXEC msdb.dbo.sp_attach_schedule
     @job_name = N'SetComputadorAtividadeJob',
     @schedule_name = N'Every 10 Minutes';
GO

-- Add the job to the SQL Server Agent
EXEC msdb.dbo.sp_add_jobserver
     @job_name = N'SetComputadorAtividadeJob';
GO


/* */


-- Inserções
INSERT INTO contaMedtech (nome, cpf, email, senha) VALUES
('Caique Lucio', '59696032907', 'caiquedeandradelucio@gmail.com', 'medtech88');

INSERT INTO endereco (cep, rua, numero, complemento, uf) VALUES
('08450160', 'rua antônio thadeo', 373, 'apt04 bl604', 'SP'),
('08450160', 'rua antônio thadeo', 372, 'apt04 bl604', 'SP');

INSERT INTO hospital (nomeFantasia, razaoSocial, cnpj, senha, email, verificado, fkEndereco) VALUES
('Clinica Folhas de Outono', 'Gazzoli Silva', '00000000000000', 'gazzoli123','clinicafoutono@outlook.com', 1, 1),
('Clinica Repolho verde', 'Juliana & Familia', '00000000000001', 'JUJU8978','clinicaRepolho@gmail.com', 1, 2);

UPDATE hospital SET dtCriacao = '2024-04-07' WHERE idHospital = 1;

INSERT INTO funcionario (nome, cpf, telefone, cargo, email, senha, fkHospital) VALUES
('Fernando Brandão', '12345678910', '11983987068', 'GESTOR_TI', 'fbrandao@sptech.school', 'sptech88', 1),
('Verônica Shagas', '59696032908', '11960753138', 'MEDICO_GERENTE', 'veronicaSH@gmail.com', 'sptech88', 1);

INSERT INTO configEmail (host, port, email, pass, fkFuncionario) VALUES
('smtp-mail.outlook.com', 587, 'medtech.it.solutions@outlook.com', 'foco1020', 1000);

INSERT INTO departamento (nome, fkHospital) VALUES
('Triagem', 1),
('Guichê', 1),
('Farmácia', 1),
('Consultório', 1);

INSERT INTO acesso (fkFuncionario, fkDepartamento, fkHospital, responsavel) VALUES
(1001, 1, 1, 1),
(1001, 2, 1, 1),
(1001, 3, 1, 1),
(1001, 4, 1, 1);

INSERT INTO computador (nome, modeloProcessador, codPatrimonio, senha, gbRam, gbDisco, fkDepartamento, fkHospital) VALUES
('PC_triagem01', 'Intel Core I3', 'C056689', 'medtech88', 8, 250, 1, 1);

INSERT INTO leituraRamCpu (ram, cpu, fkComputador, fkDepartamento, fkHospital) VALUES
(100, 100, 1, 1, 1);

INSERT INTO leituraDisco (disco, fkComputador, fkDepartamento, fkHospital) VALUES
(100, 1, 1, 1);

INSERT INTO logComputador (grau, causa, dtOcorrencia, fkComputador, fkDepartamento, fkHospital) VALUES
('crítico', 'cpu', '2024-06-18 21:47:13', 1, 1, 1),
('crítico', 'cpu', '2024-06-18 21:47:14', 1, 1, 1),
('crítico', 'cpu', '2024-06-18 21:47:15', 1, 1, 1),
('crítico', 'cpu', '2024-04-18 21:47:16', 1, 1, 1),
('crítico', 'cpu', '2024-04-18 21:47:17', 1, 1, 1),
('crítico', 'cpu', '2024-04-18 21:47:18', 1, 1, 1),
('crítico', 'cpu', '2024-10-18 21:47:19', 1, 1, 1),
('crítico', 'cpu', '2024-10-18 21:47:20', 1, 1, 1),
('crítico', 'cpu', '2024-10-18 21:47:21', 1, 1, 1);

INSERT INTO logComputador (grau, causa, dtOcorrencia, fkComputador, fkDepartamento, fkHospital) VALUES
('crítico', 'ram', '2024-06-18 21:49:13', 1, 1, 1),
('crítico', 'ram', '2024-06-18 21:49:14', 1, 1, 1),
('crítico', 'ram', '2024-06-18 21:49:15', 1, 1, 1),
('crítico', 'ram', '2024-04-18 21:49:16', 1, 1, 1),
('crítico', 'ram', '2024-04-18 21:49:17', 1, 1, 1),
('crítico', 'ram', '2024-04-18 21:49:18', 1, 1, 1),
('crítico', 'ram', '2024-10-18 21:49:19', 1, 1, 1),
('crítico', 'ram', '2024-10-18 21:49:20', 1, 1, 1),
('crítico', 'ram', '2024-10-18 21:49:21', 1, 1, 1);

INSERT INTO logComputador (grau, causa, dtOcorrencia, fkComputador, fkDepartamento, fkHospital) VALUES
('crítico', 'disco', '2024-06-18 21:49:13', 1, 1, 1),
('crítico', 'disco', '2024-06-18 21:49:14', 1, 1, 1),
('crítico', 'disco', '2024-06-18 21:49:15', 1, 1, 1),
('crítico', 'disco', '2024-04-18 21:49:16', 1, 1, 1),
('crítico', 'disco', '2024-04-18 21:49:17', 1, 1, 1),
('crítico', 'disco', '2024-04-18 21:49:18', 1, 1, 1),
('crítico', 'disco', '2024-10-18 21:49:19', 1, 1, 1),
('crítico', 'disco', '2024-10-18 21:49:20', 1, 1, 1),
('crítico', 'disco', '2024-10-18 21:49:21', 1, 1, 1);
