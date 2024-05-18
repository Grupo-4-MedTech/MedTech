const computadoresModel = require('../models/computadoresModel');


function buscarComputadores(req, res){
    computadoresModel.buscarPCs(req.params.idHospital)
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

module.exports = {
    buscarComputadores
}