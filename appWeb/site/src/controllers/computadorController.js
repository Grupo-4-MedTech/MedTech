const computadoresModel = require('../models/computadoresModel');


function buscarPorId(req, res) {
    computadoresModel.buscarPorId(req.params.idHospital)
    .then((result) => {
        if(result.length > 0){
            res.status(200).json(result);
        }
        else{
            res.status(100).send('Nenhuma máquina encontrada');
        }
    })
    .catch((error)=> {
        console.log(error);
        res.status(500).send('Erro inesperado! Entre em contato com o nosso suporte.');
    });
}

function findLogs(req, res) {
    computadoresModel.findLogs(
        Object.entries(req.params).map((x) => {if (x[1] != 'null') { return x; }}).filter(x => x != undefined)
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
            res.status(400).send('Nenhúm registro encontrado.');
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send('Houve um erro inesperado! Por favor, entre em contato com o nosso suporte.');
    })
}
module.exports = {
    buscarPorId,
    findLogs,
    historic
}