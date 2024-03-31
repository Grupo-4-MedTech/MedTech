const express = require("express");
const router = express.Router();

const hospitalControler = require("../controllers/hospitalController");

router.post('/cadastrar', function(req, res){
    hospitalControler.cadastrar(req, res)
});

router.post('/autenticar', function(req, res){
    hospitalControler.autenticar(req, res)
});

module.exports = router;