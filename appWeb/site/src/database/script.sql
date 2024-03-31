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
verificado VARCHAR(5) NOT NULL, CONSTRAINT CHECK (verificado IN('true', 'false')),
fkEndereco INT,
CONSTRAINT fkEnderecoHosp FOREIGN KEY (fkEndereco) REFERENCES endereco(idEndereco)
) AUTO_INCREMENT = 1;

CREATE TABLE conta(
idConta INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100), 
email VARCHAR(100),
senha VARCHAR(255),
tipo VARCHAR(45), CONSTRAINT chkTipoConta CHECK (tipo IN('suporte', 'supervisor')),
privilegio VARCHAR(45), CONSTRAINT chkPrivConta CHECK (privilegio IN('administrador', 'comum'))
) AUTO_INCREMENT = 1000;

select * from endereco;
select * from hospital;

select * from conta;

insert into conta (nome, email, senha, tipo, privilegio) values
('Fernando Brandão', 'fbrandao@sptech.school', 'sptech88', 'suporte', 'administrador'); 
SELECT idEndereco FROM endereco WHERE cep = '12345678' AND rua = 'aaaaaa' AND numero = 10 AND complemento = 'aaa' AND uf = 'ap';

