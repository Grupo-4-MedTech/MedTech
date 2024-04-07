const funcionarioModel = require('../models/funcionarioModel');

function autenticar(req, res){
    
    const senha = req.body.senha;
    const email = req.body.email;

    if(
        !/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha) ||
        !/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email)
    ){
        res.status(401);
    } else{

    funcionarioModel.autenticar(senha, email)
        .then((result) => {
            if (result.length != 1) {
                res.status(400).send('Email ou senha incorretos.');
            } else {
                res.status(201).json(result[0]);
            }
        })
        .catch((error) => {

            res.status(500).send('Erro inesperado.');
            console.log(error);
        })
    }
}

module.exports = {
    autenticar
}