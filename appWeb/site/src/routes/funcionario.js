const express = require('express');
const router = express.Router();

const funcionarioControler = require('../controllers/funcionarioController');

router.post('/autenticar', function(req, res){
    funcionarioControler.autenticar(req, res)
});

module.exports = router