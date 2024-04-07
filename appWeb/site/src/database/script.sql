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
cnpj CHAR(13) NOT NULL,
senha VARCHAR(255) NOT NULL,
email VARCHAR(100) NOT NULL,
-- verificado VARCHAR(5) NOT NULL, CONSTRAINT CHECK (verificado IN('true', 'false')),
verificado TINYINT,
fkEndereco INT,
CONSTRAINT fkEnderecoHosp FOREIGN KEY (fkEndereco) REFERENCES endereco(idEndereco)
) AUTO_INCREMENT = 1;

CREATE TABLE funcionario(
idConta INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100),
cpf CHAR(11),
telefone CHAR(11),
cargo VARCHAR(45), CONSTRAINT chkCargo CHECK (cargo in ('MEDICO_GERENTE','TECNICO_TI','GESTOR_TI')),
email VARCHAR(100),
senha VARCHAR(255),
fkHospital INT, CONSTRAINT fkHospitalFunc FOREIGN KEY (fkHospital) REFERENCES hospital(idHospital)
) AUTO_INCREMENT = 1000;

INSERT INTO endereco (cep, rua, numero, complemento, uf) VALUES
('08450160', 'rua antônio thadeo', 373, 'apt04 bl604', 'SP');

INSERT INTO hospital (nomeFantasia, razaoSocial, cnpj, senha, email, verificado, fkEndereco) VALUES
('Clinica Folhas de Outono', 'Gazzoli Silva', '00000000000000', 'gazzoli123','clinicafoutono@outlook.com', true, 1);

INSERT INTO funcionario (nome, cpf, telefone, cargo, email, senha, fkHospital) VALUES
('Fernando Brandão', '12345678910', '11 983987068', 'GESTOR_TI', 'fbrandao@sptech.school', 'sptech88', 1); 

CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'usuario';
GRANT insert, update, delete, select ON medtech.* to 'usuario'@'localhost';
FLUSH PRIVILEGES;


