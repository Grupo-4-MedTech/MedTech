const funcionarioModel = require('../models/funcionarioModel');
const utils = require("../../public/script/utils");

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
                result = result[0];
                const token = utils.tokenGenerator();
                result.token = token;
                funcionarioModel.update(result)
                .then((result2) => {
                    if (result2.affectedRows > 0) {
                        res.status(201).json(result);
                    } else {
                        res.status(500).send('Erro inesperado! entre em contato com o nosso suporte.');
                    }
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).send('Erro inesperado! entre em contato com o nosso suporte.');
                })
            }
        })
        .catch((error) => {

            res.status(500).send('Erro inesperado.');
            console.log(error);
        })
    }
}

function chkLogin(req, res) {
    console.log('CHECA')
    funcionarioModel.chkLogin(req.params.token)
    .then((result) => {
        if (result.length > 0) {
            res.status(200).send('logado');
        } else {
            res.status(400).send('não loggado');
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send('erro inesperado');
    });
}

module.exports = {
    autenticar,
    chkLogin
}