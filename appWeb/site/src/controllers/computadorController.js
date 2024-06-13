const computadoresModel = require('../models/computadoresModel');
const utils = require('../../public/script/utils');
const funcionarioModel = require('../models/funcionarioModel');
const emailController = require('./emailController');
const moment = require('moment-timezone');

function buscarPorId(req, res) {
    computadoresModel.buscarPorId(req.params.idHospital)
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

function findLogs(req, res) {
    computadoresModel.findLogs(
        Object.entries(req.params).map((x) => { if (x[1] != 'null') { return x; } }).filter(x => x != undefined)
    )
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(400).send('Nenhum registro encontrado.');
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(utils.UNEXPECTED_ERROR);
        })
}

function historic(req, res) {
    computadoresModel.historic(req.params.fkHospital)
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(400).send('Nenhum registro encontrado.');
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(utils.UNEXPECTED_ERROR);
        });
}

function adicionarPC(req, res) {

    const nome = req.body.nome;
    const codPatrimonio = req.body.codPatrimonio;
    const departamento = req.body.departamento;
    const senha = req.body.senha;
    const fkHospital = req.body.fkHospital;

    if (!/^[a-zA-Z0-9!@#$%^&*()_\s]{3,100}$/.test(nome) ||
        !/^[a-zA-Z0-9\s]{7,50}$/.test(codPatrimonio) ||
        !/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha)
    ) {
        res.status(400).send(utils.BAD_REQUEST);
    } else {
        computadoresModel.adicionarPC(nome, codPatrimonio, departamento, senha, fkHospital)
        
            .then(
                function () {
                    res.status(200).send(utils.SUCCESSFULLY_CHANGED)
                }
            ).catch(
                function () {
                    res.status(500).send(utils.UNEXPECTED_ERROR);
                }
            );
    }

}

function deletarPC(req, res) {

    const idComputador = req.params.idComputador;

    computadoresModel.deletar(idComputador)
        .then(
            function () {
                res.status(200).send(utils.SUCCESSFULLY_DELETED);
            }
        )
        .catch(
            function () {
                res.status(500).send(utils.UNEXPECTED_ERROR);
            }
        );
}

function historicLeituras(req, res) {
    computadoresModel.historicLeituras(req.params.status, req.params.fkHospital)
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(400).send(utils.NOT_FOUND);
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(utils.UNEXPECTED_ERROR);
        })
}


function historicFerramentas(req, res) {
    computadoresModel.historicFerramentas(
        Object.entries(req.params).map((x) => { if (x[1] != 'null') { return x; } }).filter(x => x != undefined)
    )
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(400).send(utils.NOT_FOUND);
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(utils.UNEXPECTED_ERROR);
        })
}

function editarPC(req, res) {
    const idComputador = req.params.idComputador;
    const updateNome = req.body.updateNome;
    const updateCodPatrimonio = req.body.updateCodPatrimonio;
    const updateDepartamento = req.body.updateDepartamento;
    const updateSenha = req.body.updateSenha;

    computadoresModel.editarPC(updateNome, updateCodPatrimonio, updateSenha, updateDepartamento, idComputador)
        .then(
            function () {
                res.status(200).send(utils.SUCCESSFULLY_CHANGED);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                res.send(utils.UNEXPECTED_ERROR);
                res.status(500)
            }
        );
}

function historicAtividade(req, res) {
    computadoresModel.findComputerByDeps(req.params.idDepartamento)
    .then((result) => {
        if (result.length > 0) {
            let promises = result.map(row => {
                return computadoresModel.historicAtividade(row.idComputador)
                .then((result_) => {
                    row.leituras = result_;
                    return row;
                });
            });

            Promise.all(promises)
            .then((updatedResult) => {
                promises = updatedResult.map(row => {
                    return computadoresModel.lastFourFerramentas(row.idComputador)
                    .then((result_) => {
                        row.ultimasFerramentas = result_.map((x) => {
                            x.dtLeitura = moment(x.dtLeitura).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm');
                            return x;
                        });
                        return row;
                    });
                })

                Promise.all(promises)
                .then((updatedResult) => {
                    res.status(200).json(updatedResult);
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send(utils.UNEXPECTED_ERROR);
                });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send(utils.UNEXPECTED_ERROR);
            });
        } else {
            res.status(400).send(utils.NOT_FOUND);
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send(utils.UNEXPECTED_ERROR);
    });
}

function findMetrica(req, res) {
    computadoresModel.findMetrica(req.params.idComputador)
    .then((result) => {
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(400).send(utils.NOT_FOUND);
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send(utils.UNEXPECTED_ERROR);
    });
}

function updateMetrica(req, res) {
    if (
        req.body.alertaRam >= req.body.alertaCritRam ||
        req.body.alertaCpu >= req.body.alertaCritCpu ||
        req.body.alertaDisco >= req.body.alertaCritDisco
    ) {
        res.status(500).send(utils.INVALID_ALERT_DATA);
        return;
    }

    computadoresModel.updateMetrica(req.body, req.params.idComputador)
    .then(() => {
        res.status(200).send(utils.SUCCESSFULLY_CHANGED);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send(utils.UNEXPECTED_ERROR);
    });
}

function repairMail(req, res) {
    const obj = {
        date: req.body.date
    };
    computadoresModel.findComputerById(req.body.idComputador)
    .then((result) => {
        obj.computador = result[0];
        funcionarioModel.findById(req.body.idFuncionario)
        .then((result) => {
            obj.funcionario = result[0];
            console.log(obj);
            funcionarioModel.findFuncByAcesso(obj.computador.fkDepartamento)
            .then((responsaveis) => {
                let promises = responsaveis.map(row => {
                    return emailController.repairMail(obj, row)
                    .then((result) => {
                        return result;
                    });
                });
    
                Promise.all(promises)
                .then((finalResult) => {
                    console.log(finalResult);
                    res.status(200).send(utils.SUCCESSFULLY_SENT);
                })
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send(utils.UNEXPECTED_ERROR);
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(utils.UNEXPECTED_ERROR);
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send(utils.UNEXPECTED_ERROR);
    });
}

module.exports = {
    buscarPorId,
    findLogs,
    historic,
    adicionarPC,
    deletarPC,
    historicFerramentas,
    historicLeituras,
    historicAtividade,
    editarPC,
    findMetrica,
    updateMetrica,
    repairMail
}