const express = require('express');
const router = express.Router();

const computadorController = require('../controllers/computadorController');

router.get('/buscarPCs/:idHospital', function(req, res){
    computadorController.buscarPorId(req, res)
});

router.get('/logs/:dtOcorrencia/:grau/:fkHospital', function(req, res){
    computadorController.findLogs(req, res);
})

router.get('/historico/:fkHospital', function(req, res){
    computadorController.historic(req, res);
})
router.post('/adicionarPC', function(req, res){
    computadorController.adicionarPC(req, res)
});
router.delete('/deletar', function(req, res){
    computadorController.deletarPC(req, res)
})
module.exports = router;