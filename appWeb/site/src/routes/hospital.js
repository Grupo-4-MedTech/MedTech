const express = require("express");
const router = express.Router();

const hospitalController = require("../controllers/hospitalController");

router.post('/cadastrar', function(req, res){
    hospitalController.cadastrar(req, res);
});

router.post('/autenticar', function(req, res){
    hospitalController.autenticar(req, res);
});

router.get('/buscar/:nomeFantasia/:dtCriacao/:uf/:verificado', function(req, res){
    hospitalController.find(req, res);
});

router.delete('/deletar/:idHospital', function(req, res){
    hospitalController.deleteHospital(req, res);
});

router.put('/update/:idHospital', function(req, res){
    hospitalController.updateHospital(req, res);
});
router.get('/listar/:idHospital', function(req, res){
    hospitalController.listar(req, res);
});

router.get('/departamentos/:idFuncionario', function(req, res) {
    hospitalController.findDepsByFunc(req, res);
});

router.put('/:fkHospital/metricas', function(req, res) {
    hospitalController.updateMetricas(req, res)
});

router.get('/:idHospital/filtrosFerramentas', function(req, res) {
    hospitalController.findFiltrosFerramentas(req, res);
});

router.delete('/filtroFerramenta/:idFiltroFerramenta', function(req, res) {
    hospitalController.deleteFiltroFerramenta(req, res);
});

router.post('/filtroFerramenta', function(req, res) {
    hospitalController.createFiltroFerramenta(req, res);
})
module.exports = router;