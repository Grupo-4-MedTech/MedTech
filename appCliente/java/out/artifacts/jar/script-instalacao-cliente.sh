#!/bin/bash

# Atualizar
echo "\n\nATUALIZANDO O SISTEMA\n\n"
yes | sudo apt update
yes | sudo apt upgrade

# NMON
echo "\n\nINSTALANDO NMON\n\n"
yes | sudo apt install nmon
sudo nmon -f -s 5 -c 10

# JDK
java --version

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
                cd ..
        else
                echo "\n\nDIRETÓRIO NÃO ENCONTRADO. INSTALANDO APLICAÇÃO...\n\n"
                git clone https://github.com/Grupo-4-MedTech/MedTech
fi

sudo chmod 111 MedTech
sudo chmod 111 script.sh
cd MedTech
git pull


# MYSQL
echo "\n\nCONFIGURANDO BANCO DE DADOS\n\n"

yes | sudo apt install mysql-server
yes | sudo systemctl start mysql
yes | sudo systemctl enable mysql

SQL_SCRIPT="appWeb/site/src/database/script.sql"

sudo mysql < "$SQL_SCRIPT"

# exec Jar
echo "\n\nINICIANDO APLICACÃO\n\n"
cd appCliente/java/out/artifacts/jar
java -jar appCliente.jar'