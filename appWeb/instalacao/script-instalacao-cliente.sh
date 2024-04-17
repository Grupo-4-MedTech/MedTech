!#/bin/bash

# Criando usuário linux máquina cliente

sudo useradd cliente-medtech

if [ $? = 0 ]
	then echo "Usuário criado.."
		passwd cliente-medtech
		#senha do cliente
		medtech123
	else echo "Erro: usuário já existe"
fi


