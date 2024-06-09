const adminModel = require('../models/adminModel');
const utils = require('../../public/script/utils');

function login(req, res){
    const senha = req.body.senha;
    const email = req.body.email;

    if(
        !/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha) ||
        !/^[a-zA-Z0-9._]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z.]{3,}$/.test(email)
    ){
        res.status(401).send(utils.BAD_REQUEST);
    } else {
        adminModel.login(email, senha)
        .then((result) => {
            if (result.length > 0) {
                const token = utils.tokenGenerator();
                result[0].token = token;
                adminModel.update(result[0])
                .then(() => {
                    res.status(200).json(result[0]);
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).send(utils.UNEXPECTED_ERROR);
                })
            } else {
                res.status(400).send(utils.NOT_FOUND)
            }
        }).catch(error => {
            console.log(error);
            res.status(500).send(utils.UNEXPECTED_ERROR);
        })
    }
}

function chkLogin(req, res){
    adminModel.chkLogin(req.params.token)
    .then((result) => {
        if (result.length > 0) {
            res.status(200).send('logado');
        } else {
            res.status(400).send('não logado');
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send(utils.UNEXPECTED_ERROR);
    });
}

module.exports ={
    login,
    chkLogin
}