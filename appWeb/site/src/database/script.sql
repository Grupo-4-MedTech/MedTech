drop database medtech;
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
    nome VARCHAR (50),
    modeloProcessador VARCHAR(255),
    codPatrimonio VARCHAR(50) UNIQUE,
    senha VARCHAR(255),
    gbRAM FLOAT,
    gbDisco FLOAT,
    fkDepartamento INT NOT NULL,
    fkHospital  INT NOT NULL,
    CONSTRAINT fkDepartamentoComputador FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalComputador FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE leituraRamCpu(
    idLeituraRamCpu INT PRIMARY KEY AUTO_INCREMENT,
    ram DOUBLE,
    cpu DOUBLE,
    dataLeitura DATETIME,
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
    dataLeitura DATETIME,
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
	dtLeitura DATETIME,
	caminho VARCHAR(255),
	fkComputador INT NOT NULL,
	fkDepartamento INT NOT NULL,
	fkHospital INT NOT NULL,
	CONSTRAINT fkComputadorLeituraFer FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
	CONSTRAINT fkDepartamentoLeituraFer FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
	CONSTRAINT fkHospitalLeituraFer FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
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

select * from contaMedtech;

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

select * from funcionario;

INSERT INTO departamento (nome, fkHospital) VALUES ('Triagem', 1);

INSERT INTO computador (nome, modeloProcessador, codPatrimonio, senha, gbRam, gbDisco, fkDepartamento, fkHospital) VALUES 
('PC_triagem01', 'Intel Core I3', 'C057689', 'medtech88', 8, 250, 1, 1);

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
CREATE TRIGGER deleteHospital
AFTER DELETE ON hospital
FOR EACH ROW
BEGIN 
	DELETE FROM endereco WHERE idEndereco = OLD.fkEndereco;
END$$
DELIMITER ;

CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'usuario';
GRANT insert, update, delete, select ON medtech.* to 'usuario'@'localhost';
GRANT EXECUTE ON PROCEDURE delete_hospital TO 'usuario'@'localhost';
FLUSH PRIVILEGES;

