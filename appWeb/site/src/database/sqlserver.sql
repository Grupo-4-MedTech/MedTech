USE master;
GO

CREATE DATABASE medtech;
GO

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
    dtCriacao DATE DEFAULT GETDATE(),
	verificado TINYINT,
	fkEndereco INT NOT NULL,
	CONSTRAINT fkEnderecoHosp FOREIGN KEY (fkEndereco) REFERENCES endereco(idEndereco)
);

CREATE TABLE funcionario(
	idFuncionario INT PRIMARY KEY IDENTITY(1000,1),
	nome VARCHAR(100),
	cpf CHAR(11) UNIQUE,
	telefone CHAR(11),
	cargo VARCHAR(45), CHECK (cargo in ('MEDICO_GERENTE','TECNICO_TI','GESTOR_TI')),
    token CHAR(255) UNIQUE,
	email VARCHAR(100) UNIQUE,
	senha VARCHAR(255),
	fkHospital INT, CONSTRAINT fkHospitalFunc FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE departamento(
    idDepartamento INT PRIMARY KEY IDENTITY(1,1),
    nome VARCHAR(45),
    fkHospital INT NOT NULL,
    CONSTRAINT fkDepartamentoHosp FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE acesso(
    fkFuncionario INT,
    fkDepartamento INT,
    fkHospital INT,
    responsavel TINYINT,
    CONSTRAINT fkFuncionarioAcesso FOREIGN KEY (fkFuncionario) REFERENCES funcionario(idFuncionario),
    CONSTRAINT fkDepartamentoAcesso FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalAcesso FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE computador(
    idComputador INT PRIMARY KEY IDENTITY(1,1),
    nome VARCHAR(50),
    status VARCHAR(50) DEFAULT 'estável',
    dtStatusUpdate DATETIME DEFAULT GETDATE(),
    modeloProcessador VARCHAR(255),
    codPatrimonio VARCHAR(7) UNIQUE,
    senha VARCHAR(255),
    gbRAM FLOAT,
    gbDisco FLOAT,
    fkDepartamento INT NOT NULL,
    fkHospital  INT NOT NULL,
	CHECK (status IN('crítico', 'alerta', 'offline', 'estável')),
    CONSTRAINT fkDepartamentoComputador FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalComputador FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
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
    CONSTRAINT fkComputadorLog FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    CONSTRAINT fkDepartamentoLog FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalLog FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE leituraRamCpu(
    idLeituraRamCpu INT PRIMARY KEY IDENTITY(1,1),
    ram FLOAT,
    cpu FLOAT,
    dataLeitura DATETIME,
    fkComputador INT NOT NULL,
    fkDepartamento INT NOT NULL,
    fkHospital INT NOT NULL,
    CONSTRAINT fkComputadorLeitura FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    CONSTRAINT fkDepartamentoLeitura FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalLeitura FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE leituraDisco(
	idLeituraDisco INT PRIMARY KEY IDENTITY(1,1),
    disco FLOAT,
    dataLeitura DATETIME,
	fkComputador INT NOT NULL,
    fkDepartamento INT NOT NULL,
    fkHospital INT NOT NULL,
    CONSTRAINT fkComputadorLeituraDisc FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    CONSTRAINT fkDepartamentoLeituraDisc FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento),
    CONSTRAINT fkHospitalLeituraDisc FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
);

CREATE TABLE leituraFerramenta(
	idLeituraFerramenta INT PRIMARY KEY IDENTITY(1,1), 
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
    CONSTRAINT fkCompMetric FOREIGN KEY (fkComputador) REFERENCES computador(idComputador),
    CONSTRAINT fkHospMetric FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital),
    CONSTRAINT fkDepMetric FOREIGN KEY (fkDepartamento) REFERENCES departamento(idDepartamento)
);

CREATE TABLE contaMedtech(
	idContaMedtech INT PRIMARY KEY IDENTITY(1,1),
    nome VARCHAR(100),
    cpf CHAR(11) UNIQUE,
    token CHAR(255) UNIQUE,
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255)
);
/*
CREATE VIEW hospitalWithEndereco AS
SELECT * FROM hospital JOIN endereco ON fkEndereco = idEndereco; */