const adminModel = require('../models/adminModel');

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
                res.status(200).json(result);
            } else {
                res.status(400).send('Nenhum registro encontrado com estes dados.')
            }
        }).catch(error => {
            console.log(error);
            res.status(500).send('Erro inesperado! entre em contato com o nosso suporte.');
        })
    }
}

module.exports ={
    login
}