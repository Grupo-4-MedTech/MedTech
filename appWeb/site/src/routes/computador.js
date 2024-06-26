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
router.post('/adicionarPC/', function(req, res){
    computadorController.adicionarPC(req, res)
});

router.delete('/deletar/:idComputador', function(req, res){
    computadorController.deletarPC(req, res)
})

router.get('/buscar-ultimas-leituras/:fkHospital/:status', function(req, res) {
    computadorController.historicLeituras(req,res);
})

router.get('/historico-ferramentas/:fkHospital/:dtLeitura', function(req, res) {
    computadorController.historicFerramentas(req, res);
});

router.put('/editarPC/:idComputador', function (req, res) {
    computadorController.editarPC(req, res);
});

router.get('/historico-atividade/:idDepartamento', function(req, res) {
    computadorController.historicAtividade(req, res);
});

router.get('/:idComputador/metrica', function(req, res) {
    computadorController.findMetrica(req, res);
});

router.put('/:idComputador/metrica', function(req, res) {
    computadorController.updateMetrica(req, res);
});

router.post('/email-manutencao', function(req, res){
    computadorController.repairMail(req, res);
})

module.exports = router;