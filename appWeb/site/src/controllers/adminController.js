const adminModel = require('../models/adminModel');
const utils = require('../../public/script/utils');

function login(req, res){
    const senha = req.body.senha;
    const email = req.body.email;

    if(
        !/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha) ||
        !/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email)
    ){
        res.status(401).send('Dados inválidos');
    } else {
        adminModel.login(email, senha)
        .then((result) => {
            if (result.length > 0) {
                const token = utils.tokenGenerator();
                result[0].token = token;
                adminModel.update(result[0])
                .then((result2) => {
                    if (result2.affectedRows > 0) {
                        res.status(200).json(result[0]);
                    } else {
                        res.status(500).send('Erro inesperado! entre em contato com o nosso suporte.');
                    }
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).send('Erro inesperado! entre em contato com o nosso suporte.');
                })
            } else {
                res.status(400).send('Nenhum registro encontrado com estes dados.')
            }
        }).catch(error => {
            console.log(error);
            res.status(500).send('Erro inesperado! entre em contato com o nosso suporte.');
        })
    }
}

function chkLogin(req, res){
    adminModel.chkLogin(req.params.token)
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

module.exports ={
    login,
    chkLogin
}