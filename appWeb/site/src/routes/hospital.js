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
})

router.delete('/deletar/:idHospital', function(req, res){
    hospitalController.deleteHospital(req, res);
});

router.put('/update/:idHospital', function(req, res){
    hospitalController.updateHospital(req, res);
})

module.exports = router;