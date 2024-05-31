const computadoresModel = require('../models/computadoresModel');


function buscarPorId(req, res) {
    computadoresModel.buscarPorId(req.params.idHospital)
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            }
            else {
                res.status(100).send('Nenhuma máquina encontrada');
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Erro inesperado! Entre em contato com o nosso suporte.');
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
                res.status(400).send('Nenhúm registro encontrado.');
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Houve um erro inesperado! Por favor, entre em contato com o nosso suporte.');
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
            res.status(500).send('Houve um erro inesperado! Por favor, entre em contato com o nosso suporte.');
        })
}

function adicionarPC(req, res) {

    const nome = req.body.nome;
    const codPatrimonio = req.body.codPatrimonio;
    const departamento = req.body.departamento;
    const senha = req.body.senha;
    const fkHospital = req.body.fkHospital;

    if (!/^[a-zA-Z\s]{3,25}$/.test(nome) ||
        !/^[a-zA-Z0-9\s]{7,50}$/.test(codPatrimonio) ||
        !/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha)
    ) {
        res.status(400).send('Dados incorretos');
    } else {
        computadoresModel.adicionarPC(nome, codPatrimonio, departamento, senha, fkHospital)
        res.status(200).send('Máquina cadastrada com sucesso!')
            .then(
                function (result) {
                    res.json(result);
                }
            ).catch(
                function (erro) {
                    res.status(500).send('Não foi possível adicionar a máquina.');
                }
            );
    }

}

function deletarPC(req, res) {

    const idComputador = req.params.idComputador;

    computadoresModel.deletar(idComputador)
        .then(
            function (resultado) {
                res.status(200).json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar a máquina");
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function ultimasLeituras(req, res) {
    computadoresModel.ultimasLeituras(req.params.status, req.params.fkHospital)
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(400).send('Nenhum registro encontrado.');
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Houve um erro inesperado! Por favor, entre em contato com o nosso suporte.');
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
                res.status(400).send('Nenhum registro encontrado.');
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Houve um erro inesperado! Por favor, entre em contato com o nosso suporte.');
        })
}

function editarPC() {
    const idComputador = req.params.idComputador;

    computadoresModel.editarPC(novaDescricao, idComputador)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao editar o computador");
                res.status(500).json(erro.sqlMessage);
            }
        );

}

module.exports = {
    buscarPorId,
    findLogs,
    historic,
    adicionarPC,
    deletarPC,
    historicFerramentas,
    ultimasLeituras,
    editarPC
}