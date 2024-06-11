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
                        .then(() => {
                            res.status(201).json(result);
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).send(utils.UNEXPECTED_ERROR);
                        })
                }
            })
            .catch((error) => {
                res.status(500).send(utils.UNEXPECTED_ERROR);
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
            res.status(500).send(utils.UNEXPECTED_ERROR);
        });
}

function buscarUsuarios(req, res) {
    funcionarioModel.buscar(req.params.idHospital)
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            }
            else {
                res.status(100).send(utils.NOT_FOUND);
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(utils.UNEXPECTED_ERROR);
        });
}

function adicionarUsuario(req, res) {

    const nome = req.body.nome;
    const email = req.body.email;
    const cargo = req.body.cargo;
    const fkHospital = req.body.fkHospital;

    if (!/^[a-zA-Z\s]{3,100}$/.test(nome) ||
        !/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email)
    ) {
        res.status(400).send(utils.BAD_REQUEST);
    } else {
        funcionarioModel.adicionarUsuario(nome, email, cargo, fkHospital)
            .then(
                function (result) {
                    console.log(result);
                    res.status(200).send(utils.SUCCESSFULLY_CREATED);
                }
            ).catch(
                function (error) {
                    console.log(error);
                    res.status(500).send(utils.UNEXPECTED_ERROR);
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

function editarFuncionario(req, res) {
    const idFuncionario = req.params.idFuncionario;
    const updateNome = req.body.updateNome;
    const updateEmail = req.body.updateEmail;
    const updateCargo = req.body.updateCargo;


    funcionarioModel.editarFuncionario(updateNome, updateEmail, updateCargo, idFuncionario)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao editar o usuário");
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function findMailConfig(req, res) {
    funcionarioModel.findById(req.params.idFuncionario)
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            }
            else {
                res.status(100).send(utils.NOT_FOUND);
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(utils.UNEXPECTED_ERROR);
        });
}


function updateMailConfig(req, res) {
    funcionarioModel.updateMailConfig(req.params.idFuncionario, req.body.host, req.body.port, req.body.email, req.body.pass)
        .then(() => {
            res.status(200).send(utils.SUCCESSFULLY_CHANGED);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(utils.UNEXPECTED_ERROR);
        });
}

module.exports = {
    autenticar,
    chkLogin,
    buscarUsuarios,
    adicionarUsuario,
    deletarFuncionario,
    editarFuncionario,
    findMailConfig,
    updateMailConfig
}