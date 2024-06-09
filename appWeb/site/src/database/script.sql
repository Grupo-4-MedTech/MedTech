CREATE DATABASE medtech;
USE medtech; 

CREATE TABLE endereco(
	idEndereco INT PRIMARY KEY AUTO_INCREMENT,
	cep CHAR(8),
	rua VARCHAR(100) NOT NULL,
	numero INT NOT NULL,
	complemento VARCHAR(255),
	uf CHAR(2) NOT NULL
) AUTO_INCREMENT = 1;

CREATE TABLE hospital(
	idHospital INT PRIMARY KEY AUTO_INCREMENT,
	nomeFantasia VARCHAR(100),
	razaoSocial VARCHAR(100) NOT NULL,
	cnpj CHAR(14) UNIQUE NOT NULL,
	senha VARCHAR(255) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
    dtCriacao DATETIME DEFAULT current_timestamp,
	verificado TINYINT,
	fkEndereco INT NOT NULL,
	CONSTRAINT fkEnderecoHosp FOREIGN KEY (fkEndereco) REFERENCES endereco(idEndereco)
) AUTO_INCREMENT = 1;

CREATE TABLE funcionario(
	idFuncionario INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(100),
	cpf CHAR(11) UNIQUE,
	telefone CHAR(11),
	cargo VARCHAR(45), CONSTRAINT chkCargo CHECK (cargo in ('MEDICO_GERENTE','TECNICO_TI','GESTOR_TI')),
    token CHAR(255) UNIQUE,
	email VARCHAR(100) UNIQUE,
	senha VARCHAR(255),
	fkHospital INT, CONSTRAINT fkHospitalFunc FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
) AUTO_INCREMENT = 1000;

CREATE TABLE departamento(
    idDepartamento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    fkHospital INT NOT NULL,
    CONSTRAINT fkDepartamentoHosp FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
) AUTO_INCREMENT = 1 ;

CREATE TABLE acesso(
    fkFuncionario INT,
    fkDepartamento INT,
    fkHospital INT,
    responsavel TINYINT,
    primary key (fkFuncionario, fkDepartamento, fkHospital),
    CONSTRAINT fkFuncionarioAcesso FOREIGN KEY (fkFuncionario) REFERENCES funcionario(idFuncionario),
    CONSTRAINT fkDepartamentoAcesso FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalAcesso FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);
CREATE TABLE computador(
    idComputador INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50),
    status VARCHAR(50) DEFAULT 'estável',
    atividade TINYINT DEFAULT 0,
    dtStatusUpdate DATETIME DEFAULT CURRENT_TIMESTAMP,
    modeloProcessador VARCHAR(255),
    codPatrimonio VARCHAR(7) UNIQUE,
    senha VARCHAR(255),
    gbRAM FLOAT,
    gbDisco FLOAT,
    fkDepartamento INT NOT NULL,
    fkHospital  INT NOT NULL,
	CONSTRAINT chkStatus CHECK (status IN('crítico', 'alerta', 'estável')),
    CONSTRAINT fkDepartamentoComputador FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalComputador FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE logAtividade(
	idLogAtividade INT PRIMARY KEY AUTO_INCREMENT,
    atividade TINYINT NOT NULL,
    dtOcorrencia DATETIME DEFAULT CURRENT_TIMESTAMP,
	fkComputador INT NOT NULL,
    fkDepartamento INT NOT NULL,
    fkHospital INT NOT NULL,
    CONSTRAINT fkComputadorLA FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    CONSTRAINT fkDepartamentaLA FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalLA FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE logComputador (
	idLogComputador INT PRIMARY KEY AUTO_INCREMENT,
    grau VARCHAR(8),
    causa VARCHAR(50),
    dtOcorrencia DATETIME DEFAULT CURRENT_TIMESTAMP,
	fkComputador INT NOT NULL,
    fkDepartamento INT NOT NULL,
    fkHospital INT NOT NULL,
    CONSTRAINT chkGrau CHECK (grau IN('crítico', 'alerta', 'estável')),
    CONSTRAINT chkCausa CHECK (causa IN('ram', 'cpu', 'disco')),
    CONSTRAINT fkComputadorLog FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    CONSTRAINT fkDepartamentoLog FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalLog FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE leituraRamCpu(
    idLeituraRamCpu INT PRIMARY KEY AUTO_INCREMENT,
    ram DOUBLE,
    cpu DOUBLE,
    dataLeitura DATETIME DEFAULT current_timestamp,
    fkComputador INT NOT NULL,
    fkDepartamento INT NOT NULL,
    fkHospital INT NOT NULL,
    CONSTRAINT fkComputadorLeitura FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    CONSTRAINT fkDepartamentoLeitura FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalLeitura FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE leituraDisco(
	idLeituraDisco INT PRIMARY KEY AUTO_INCREMENT,
    disco DOUBLE,
    dataLeitura DATETIME DEFAULT current_timestamp,
	fkComputador INT NOT NULL,
    fkDepartamento INT NOT NULL,
    fkHospital INT NOT NULL,
    CONSTRAINT fkComputadorLeituraDisc FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    CONSTRAINT fkDepartamentoLeituraDisc FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalLeituraDisc FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE leituraFerramenta(
	idLeituraFerramenta INT PRIMARY KEY AUTO_INCREMENT,
	nomeApp VARCHAR(255),
	dtLeitura DATETIME DEFAULT current_timestamp,
	caminho VARCHAR(255),
	fkComputador INT NOT NULL,
	fkDepartamento INT NOT NULL,
	fkHospital INT NOT NULL,
	CONSTRAINT fkComputadorLeituraFer FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
	CONSTRAINT fkDepartamentoLeituraFer FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
	CONSTRAINT fkHospitalLeituraFer FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE metrica (
	idMetrica INT PRIMARY KEY AUTO_INCREMENT,
    alertaCpu DOUBLE,
    alertaCritCpu DOUBLE,
    alertaRam DOUBLE,
    alertaCritRam DOUBLE,
    alertaDisco DOUBLE,
    alertaCritDisco DOUBLE,
    fkComputador INT,
    fkDepartamento INT,
    fkHospital INT,
    CONSTRAINT fkCompMetric FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    CONSTRAINT fkHospMetric FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital),
    CONSTRAINT fkDepMetric FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento)
);

CREATE TABLE contaMedtech(
	idContaMedtech INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    cpf CHAR(11) UNIQUE,
    token CHAR(255) UNIQUE,
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255)
);

INSERT INTO contaMedtech (nome, cpf, email, senha) VALUES
('Caique Lucio', '59696032907', 'caiquedeandradelucio@gmail.com', 'medtech88');

INSERT INTO endereco (cep, rua, numero, complemento, uf) VALUES
('08450160', 'rua antônio thadeo', 373, 'apt04 bl604', 'SP');
INSERT INTO endereco (cep, rua, numero, complemento, uf) VALUES
('08450160', 'rua antônio thadeo', 372, 'apt04 bl604', 'SP');

INSERT INTO hospital (nomeFantasia, razaoSocial, cnpj, senha, email, verificado, fkEndereco) VALUES
('Clinica Folhas de Outono', 'Gazzoli Silva', '00000000000000', 'gazzoli123','clinicafoutono@outlook.com', true, 1);
INSERT INTO hospital (nomeFantasia, razaoSocial, cnpj, senha, email, verificado, fkEndereco) VALUES
('Clinica Repolho verde', 'Juliana & Familia', '00000000000001', 'JUJU8978','clinicaRepolho@gmail.com', true, 2);

update hospital set dtCriacao = '2024-04-07' where idHospital = 1;

INSERT INTO funcionario (nome, cpf, telefone, cargo, email, senha, fkHospital) VALUES
('Fernando Brandão', '12345678910', '11983987068', 'GESTOR_TI', 'fbrandao@sptech.school', 'sptech88', 1),
('Verônica Shagas', '59696032908', '11960753138', 'MEDICO_GERENTE', 'veronicaSH@gmail.com', 'sptech88', 1);

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
('PC_triagem01', 'Intel Core I3', 'C057689', 'medtech88', 8, 250, 1, 1);

INSERT INTO metrica (alertaCpu, alertaCritCpu, alertaRam, alertaCritRam, alertaDisco, alertaCritDisco, fkComputador, fkDepartamento, fkHospital) VALUES
(0.70, 1.00, 0.75, 1.00, 0.80, 1.00, 1, 1, 1);

CREATE VIEW hospitalWithEndereco AS
SELECT * FROM hospital JOIN endereco ON fkEndereco = idEndereco;

DELIMITER $$
CREATE PROCEDURE delete_hospital(IN id INT)
BEGIN
	DELETE FROM leituraDisco WHERE fkHospital = id;
	DELETE FROM leituraRamCpu WHERE fkHospital = id;
    DELETE FROM leituraFerramenta WHERE fkHospital = id;
	DELETE FROM computador WHERE fkHospital = id;
    DELETE FROM acesso WHERE fkHospital = id;
    DELETE FROM funcionario WHERE fkHospital = id;
    DELETE FROM departamento WHERE fkHospital = id;
    DELETE FROM hospital WHERE idHospital = id;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER insertMetrica
AFTER INSERT ON computador
FOR EACH ROW
BEGIN
	INSERT INTO metrica (alertaCpu, alertaCritCpu, alertaRam, alertaCritRam, alertaDisco, alertaCritDisco, fkComputador, fkDepartamento, fkHospital) VALUES
    (0.7, 1, 0.75, 1, 0.8, 1, NEW.idComputador, NEW.fkDepartamento, NEW.fkHospital);
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER insertLogCompAfterRamCpu
AFTER INSERT ON leituraRamCpu
FOR EACH ROW
BEGIN
	IF NEW.ram / 100 >= (SELECT alertaCritRam FROM metrica WHERE fkComputador = NEW.fkComputador) THEN
		INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES
        ('crítico', 'ram', NEW.fkComputador, NEW.fkDepartamento, NEW.fkHospital);
	ELSEIF NEW.ram / 100 >= (SELECT alertaRam FROM metrica WHERE fkComputador = NEW.fkComputador) THEN
		INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES
        ('alerta', 'ram', NEW.fkComputador, NEW.fkDepartamento, NEW.fkHospital);
	ELSE
		INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES
        ('estável', 'ram', NEW.fkComputador, NEW.fkDepartamento, NEW.fkHospital);
    END IF;

    IF NEW.cpu / 100 >= (SELECT alertaCritCpu FROM metrica WHERE fkComputador = NEW.fkComputador) THEN
		INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES
        ('crítico', 'cpu', NEW.fkComputador, NEW.fkDepartamento, NEW.fkHospital);
	ELSEIF NEW.cpu / 100 >= (SELECT alertaCpu FROM metrica WHERE fkComputador = NEW.fkComputador) THEN
		INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES
        ('alerta', 'cpu', NEW.fkComputador, NEW.fkDepartamento, NEW.fkHospital);
	ELSE
		INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES
        ('estável', 'cpu', NEW.fkComputador, NEW.fkDepartamento, NEW.fkHospital);
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER insertLogCompAfterLeituraDisco
AFTER INSERT ON leituraDisco
FOR EACH ROW
BEGIN
	IF NEW.disco / 100 >= (SELECT alertaCritDisco FROM metrica WHERE fkComputador = NEW.fkComputador) THEN
		INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES
        ('crítico', 'disco', NEW.fkComputador, NEW.fkDepartamento, NEW.fkHospital);
	ELSEIF NEW.disco / 100 >= (SELECT alertaDisco FROM metrica WHERE fkComputador = NEW.fkComputador) THEN
		INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES
        ('alerta', 'disco', NEW.fkComputador, NEW.fkDepartamento, NEW.fkHospital);
	ELSE
		INSERT INTO logComputador (grau, causa, fkComputador, fkDepartamento, fkHospital) VALUES
        ('estável', 'disco', NEW.fkComputador, NEW.fkDepartamento, NEW.fkHospital);
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER verifyComputadorStatus
AFTER INSERT ON logComputador
FOR EACH ROW
BEGIN
	IF NOT (
	(SELECT grau FROM logComputador WHERE fkComputador = NEW.fkComputador AND causa = 'cpu'
	AND dtOcorrencia = (SELECT MAX(dtOcorrencia) FROM logComputador WHERE causa = 'cpu' AND fkComputador = NEW.fkComputador)) = (SELECT status FROM computador WHERE idComputador = NEW.fkComputador)
	AND (SELECT grau FROM logComputador WHERE fkComputador = NEW.fkComputador AND causa = 'ram'
	AND dtOcorrencia = (SELECT MAX(dtOcorrencia) FROM logComputador WHERE causa = 'ram' AND fkComputador = NEW.fkComputador)) = (SELECT status FROM computador WHERE idComputador = NEW.fkComputador)
	AND (SELECT grau FROM logComputador WHERE fkComputador = NEW.fkComputador AND causa = 'disco'
	AND dtOcorrencia = (SELECT MAX(dtOcorrencia) FROM logComputador WHERE causa = 'disco' AND fkComputador = NEW.fkComputador)) = (SELECT status FROM computador WHERE idComputador = NEW.fkComputador)
	) THEN
		IF (SELECT grau FROM logComputador WHERE fkComputador = NEW.fkComputador AND causa = 'cpu'
		AND dtOcorrencia = (SELECT MAX(dtOcorrencia) FROM logComputador WHERE causa = 'cpu' AND fkComputador = NEW.fkComputador)) = 'crítico'
		OR (SELECT grau FROM logComputador WHERE fkComputador = NEW.fkComputador AND causa = 'ram'
		AND dtOcorrencia = (SELECT MAX(dtOcorrencia) FROM logComputador WHERE causa = 'ram' AND fkComputador = NEW.fkComputador)) = 'crítico'
		OR (SELECT grau FROM logComputador WHERE fkComputador = NEW.fkComputador AND causa = 'disco'
		AND dtOcorrencia = (SELECT MAX(dtOcorrencia) FROM logComputador WHERE causa = 'disco' AND fkComputador = NEW.fkComputador)) = 'crítico'
		THEN
			UPDATE computador SET status = 'crítico' WHERE idComputador = NEW.fkComputador;
            UPDATE computador SET dtStatusUpdate = NEW.dtOcorrencia WHERE idComputador = NEW.fkComputador;
		ELSEIF (SELECT grau FROM logComputador WHERE fkComputador = NEW.fkComputador AND causa = 'cpu'
		AND dtOcorrencia = (SELECT MAX(dtOcorrencia) FROM logComputador WHERE causa = 'cpu' AND fkComputador = NEW.fkComputador)) = 'alerta'
		OR	(SELECT grau FROM logComputador WHERE fkComputador = NEW.fkComputador AND causa = 'ram'
		AND dtOcorrencia = (SELECT MAX(dtOcorrencia) FROM logComputador WHERE causa = 'ram' AND fkComputador = NEW.fkComputador)) = 'alerta'
		OR (SELECT grau FROM logComputador WHERE fkComputador = NEW.fkComputador AND causa = 'disco'
		AND dtOcorrencia = (SELECT MAX(dtOcorrencia) FROM logComputador WHERE causa = 'disco' AND fkComputador = NEW.fkComputador)) = 'alerta'
		THEN
			UPDATE computador SET status = 'alerta' WHERE idComputador = NEW.fkComputador;
			UPDATE computador SET dtStatusUpdate = NEW.dtOcorrencia WHERE idComputador = NEW.fkComputador;
		ELSE
			UPDATE computador SET status = 'estável' WHERE idComputador = NEW.fkComputador;
            UPDATE computador SET dtStatusUpdate = NEW.dtOcorrencia WHERE idComputador = NEW.fkComputador;
		END IF;
	END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER deleteHospital
AFTER DELETE ON hospital
FOR EACH ROW
BEGIN
	DELETE FROM endereco WHERE idEndereco = OLD.fkEndereco;
END$$
DELIMITER ;

SHOW VARIABLES LIKE 'event_scheduler';
SET GLOBAL event_scheduler = ON;

DELIMITER $$
CREATE EVENT setOffline
ON SCHEDULE EVERY 10 MINUTE
DO
BEGIN
	UPDATE computador c
    LEFT JOIN (
      SELECT fkComputador, MAX(dataLeitura) as ultimaLeitura
      FROM leituraRamCpu
      GROUP BY fkComputador
    ) l ON c.idComputador = l.fkComputador
    SET c.atividade = 0
    WHERE (l.ultimaLeitura IS NULL OR l.ultimaLeitura <= DATE_SUB(current_timestamp(), INTERVAL 1 HOUR));

	UPDATE computador c
    LEFT JOIN (
      SELECT fkComputador, MAX(dataLeitura) as ultimaLeitura
      FROM leituraRamCpu
      GROUP BY fkComputador
    ) l ON c.idComputador = l.fkComputador
    SET c.atividade = 1
    WHERE (l.ultimaLeitura > DATE_SUB(current_timestamp(), INTERVAL 1 HOUR));
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER insertLogAtvAfterCompUpdate
AFTER UPDATE ON computador
FOR EACH ROW
BEGIN
	IF OLD.atividade <> NEW.atividade THEN
		INSERT INTO logAtividade (atividade, dtOcorrencia, fkComputador, fkDepartamento, fkHospital) VALUES
        (NEW.atividade, NOW(), NEW.idComputador, NEW.fkDepartamento, NEW.fkHospital);
    END IF;
END $$
DELIMITER ;

INSERT INTO leituraRamCpu (ram, cpu, fkComputador, fkDepartamento, fkHospital, dataLeitura) VALUES
(0, 0, 1, 1, 1, current_timestamp());
INSERT INTO leituraDisco (disco, fkComputador, fkDepartamento, fkHospital) VALUES
(70, 1, 1, 1);

INSERT INTO medtech.logComputador (grau, causa, dtOcorrencia, fkComputador, fkDepartamento, fkHospital) VALUES
('crítico', 'cpu', '2024-06-18 21:47:13', 1, 1, 1),
('crítico', 'cpu', '2024-06-18 21:47:14', 1, 1, 1),
('crítico', 'cpu', '2024-06-18 21:47:15', 1, 1, 1),
('crítico', 'cpu', '2024-04-18 21:47:16', 1, 1, 1),
('crítico', 'cpu', '2024-04-18 21:47:17', 1, 1, 1),
('crítico', 'cpu', '2024-04-18 21:47:18', 1, 1, 1),
('crítico', 'cpu', '2024-10-18 21:47:19', 1, 1, 1),
('crítico', 'cpu', '2024-10-18 21:47:20', 1, 1, 1),
('crítico', 'cpu', '2024-10-18 21:47:21', 1, 1, 1);

INSERT INTO medtech.logComputador (grau, causa, dtOcorrencia, fkComputador, fkDepartamento, fkHospital) VALUES
('crítico', 'ram', '2024-06-18 21:49:13', 1, 1, 1),
('crítico', 'ram', '2024-06-18 21:49:14', 1, 1, 1),
('crítico', 'ram', '2024-06-18 21:49:15', 1, 1, 1),
('crítico', 'ram', '2024-04-18 21:49:16', 1, 1, 1),
('crítico', 'ram', '2024-04-18 21:49:17', 1, 1, 1),
('crítico', 'ram', '2024-04-18 21:49:18', 1, 1, 1),
('crítico', 'ram', '2024-10-18 21:49:19', 1, 1, 1),
('crítico', 'ram', '2024-10-18 21:49:20', 1, 1, 1),
('crítico', 'ram', '2024-10-18 21:49:21', 1, 1, 1);

INSERT INTO medtech.logComputador (grau, causa, dtOcorrencia, fkComputador, fkDepartamento, fkHospital) VALUES 
('crítico', 'disco', '2024-06-18 21:49:13', 1, 1, 1),
('crítico', 'disco', '2024-06-18 21:49:14', 1, 1, 1),
('crítico', 'disco', '2024-06-18 21:49:15', 1, 1, 1),
('crítico', 'disco', '2024-04-18 21:49:16', 1, 1, 1),
('crítico', 'disco', '2024-04-18 21:49:17', 1, 1, 1),
('crítico', 'disco', '2024-04-18 21:49:18', 1, 1, 1),
('crítico', 'disco', '2024-10-18 21:49:19', 1, 1, 1),
('crítico', 'disco', '2024-10-18 21:49:20', 1, 1, 1),
('crítico', 'disco', '2024-10-18 21:49:21', 1, 1, 1);

insert into computador (nome, status, dtStatusUpdate, codPatrimonio, senha, fkDepartamento, fkHospital) VALUES
('PC_TRIAGEM03', 'alerta', DATE_SUB(NOW(), INTERVAL 7 DAY), '67890OL', 'ilovepizza', 1, 1),
('PC_TRIAGEM04', 'alerta', NOW(), '67890ON', 'ilovepizza', 1, 1),
('PC_TRIAGEM05', 'crítico', DATE_SUB(NOW(), INTERVAL 7 DAY), '6090O89', 'ilovepizza', 1, 1),
('PC_TRIAGEM06', 'crítico', NOW(), '67890OO', 'ilovepizza', 1, 1),
('PC_TRIAGEM07', 'alerta', DATE_SUB(NOW(), INTERVAL 7 DAY), '67890OK', 'ilovepizza', 1, 1),
('PC_TRIAGEM08', 'alerta', NOW(), '67890OP', 'ilovepizza', 1, 1),
('PC_TRIAGEM09', 'crítico', DATE_SUB(NOW(), INTERVAL 7 DAY), '67890OF', 'ilovepizza', 1, 1),
('PC_TRIAGEM010', 'alerta', NOW(), '67890OQ', 'ilovepizza', 1, 1),
('PC_TRIAGEM011', 'crítico', DATE_SUB(NOW(), INTERVAL 7 DAY), '67890OZ', 'ilovepizza', 1, 1);

CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'usuario';
GRANT insert, update, delete, select ON medtech.* to 'usuario'@'localhost';
GRANT EXECUTE ON PROCEDURE delete_hospital TO 'usuario'@'localhost';
FLUSH PRIVILEGES;