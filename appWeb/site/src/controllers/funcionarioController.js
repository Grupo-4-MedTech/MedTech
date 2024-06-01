const funcionarioModel = require('../models/funcionarioModel');
const utils = require("../../public/script/utils");

function autenticar(req, res) {

    const senha = req.body.senha;
    const email = req.body.email;

    if (
        !/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha) ||
        !/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email)
    ) {
        res.status(401);
    } else {

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

function buscarUsuarios(req, res) {
    funcionarioModel.buscar(req.params.idHospital)
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            }
            else {
                res.status(100).send('Nenhum funcionário encontrado');
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Erro inesperado! Entre em contato com o nosso suporte.');
        });
}

function adicionarUsuario(req, res) {

    const nome = req.body.nome;
    const email = req.body.email;
    const cargo = req.body.cargo;
    const fkHospital = req.body.fkHospital;

    if (!/^[a-zA-Z\s]{3,25}$/.test(nome) ||
        !/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email)
    ) {
        res.status(400).send('Dados incorretos');
    } else {
        funcionarioModel.adicionarUsuario(nome, email, cargo, fkHospital)
            .then(
                function (result) {
                    res.status(200).send("Usuário cadastrado");
                }
            ).catch(
                function (erro) {
                    res.status(500).send('Não foi possível adicionar o usuário.');
                }
            );
    }

}

function deletarFuncionario(req, res) {

    const idFuncionario = req.params.idFuncionario;

    funcionarioModel.deletar(idFuncionario)
        .then(
            function (resultado) {
                res.status(200).json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar o funcionário");
                res.status(500).json(erro.sqlMessage);
            }
        );
}


module.exports = {
    autenticar,
    chkLogin,
    buscarUsuarios,
    adicionarUsuario,
    deletarFuncionario
}