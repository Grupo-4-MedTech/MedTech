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

router.post('/adicionarUsuario/', function(req, res){
    funcionarioController.adicionarUsuario(req, res)
});
router.put('/editarFuncionario/:idFuncionario', function(req, res){
    funcionarioController.editarFuncionario(req, res)
});

router.delete('/deletar/:idFuncionario', function(req, res){
    funcionarioController.deletarFuncionario(req, res);
});

router.get('/:idFuncionario/configuracoes-email', function(req, res) {
    funcionarioController.findMailConfig(req, res);
});

router.put('/:idFuncionario/configuracoes-email', function(req, res) {
    funcionarioController.updateMailConfig(req, res);
});
module.exports = router