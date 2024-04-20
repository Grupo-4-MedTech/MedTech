#!/bin/bash

# Criando usuário linux máquina cliente

# Adiciona usuário, definindo a senha automaticamente como "medtech123"
echo "\n\nCRIANDO USUÁRIO...\n\n"
echo "medtech123" | sudo useradd cliente-medtech

if [ $? = 0 ]
	then
		echo "\n\nUSUÁRIO CRIADO COM SUCESSO\n\n."
	else
		echo "\n\nERRO: USUÁRIO JÁ EXISTE\n\n"
fi

# Atualizar
echo "\n\nATUALIZANDO O SISTEMA\n\n"
yes | sudo apt update
yes | sudo apt upgrade

# NMON
echo "\n\nINSTALANDO NMON\n\n"
yes | sudo apt install nmon

# JDK
which java | grep –q /usr/bin/java

if [ $? = 0 ]
	then
		echo "\n\nJAVA JÁ ESTÁ INSTALADO\n\n"
	else
		echo "\n\nJAVA NÃO ENCONTRADO! INSTALANDO...\n\n"
		yes | sudo apt install openjdk-17-jre-headless
fi

# GitHub
echo "\n\nBUSCANDO DIRETÓRIO DA APLICAÇÃO...\n\n"
cd MedTech

if [ $? = 0 ]
	then
		echo "\n\nDIRETÓRIO ENCONTRADO.\n\n"
	else
		echo "\n\nDIRETÓRIO NÃO ENCONTRADO. INSTALANDO APLICAÇÃO...\n\n"
		git clone https://github.com/Grupo-4-MedTech/MedTech
		cd MedTech
fi

# MYSQL
echo "\n\nCONFIGURANDO BANCO DE DADOS\n\n"

yes | sudo apt install mysql-server
yes | sudo systemctl start mysql
yes | sudo systemctl enable mysql

SQL_SCRIPT="appWeb/site/src/database/script.sql"

sudo mysql < "$SQL_SCRIPT"

# exec Jar
echo "\n\nINICIANDO APLICACÃO\n\n"
cd LP/appCliente/out/artifacts/jar
java -jar appCliente.jar