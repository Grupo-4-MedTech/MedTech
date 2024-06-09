#!/bin/bash

# Atualizar
echo "\n\nATUALIZANDO O SISTEMA\n\n"
yes | sudo apt update
yes | sudo apt upgrade

# Docker
echo "\n\nVERIFICANDO INSTALAÇÃO DO DOCKER...\n\n"
docker --version

if [ $? = 0 ]
then
        echo "\n\nDOCKER JÁ ESTÁ INSTALADO\n\n"
else
        echo "\n\nDOCKER NÃO ENCONTRADO! INSTALANDO...\n\n"
        sudo apt-get update
        sudo apt-get install -y ca-certificates curl
        sudo install -m 0755 -d /etc/apt/keyrings
        sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
        sudo chmod a+r /etc/apt/keyrings/docker.asc

        echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update -y

        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        sudo systemctl start docker
        sudo systemctl enable Docker
        sudo usermod -aG docker ubuntu
fi

echo "\n\nVERIFICANDO INSTALAÇÃO DO DOCKER COMPOSE!\n\n"
docker-compose --version
if [ $? = 0 ]
then
        echo "\n\nDOCKER COMPOSE JÁ ESTÁ INSTALADO\n\n"
else
        echo "\n\nDOCKER COMPOSE NÃO ENCONTRADO! INSTALANDO...\n\n"
        sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose
fi

echo "\n Para continuar digite [y] \n"
read breackpoint

# GitHub
echo "\n\nBUSCANDO DIRETÓRIO DA APLICAÇÃO...\n\n"
sudo ls MedTech

if [ $? = 0 ]
        then
                echo "\n\nDIRETÓRIO ENCONTRADO.\n\n"
        else
                echo "\n\nDIRETÓRIO NÃO ENCONTRADO. INSTALANDO APLICAÇÃO...\n\n"
                sudo curl -L -H 'Accept: application/vnd.github.v3.raw' -o docker-compose.yml https://api.github.com/repos/Grupo-4-MedTech/MedTech/contents/appCliente/docker-compose.yml?ref=main
fi

cd MedTech
sudo docker-compose up -d