const express = require('express');
const router = express.Router();

const funcionarioController = require('../controllers/funcionarioController');

router.post('/autenticar', function(req, res){
    funcionarioController.autenticar(req, res)
});

router.get('/islogged/:token', function(req,res){
    funcionarioController.chkLogin(req, res)
});
router.get('/buscar/:idHospital', function(req, res){
    funcionarioController.buscarUsuarios(req, res)
})

module.exports = router