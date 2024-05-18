const express = require('express');
const router = express.Router();

const computadorController = require('../controllers/computadorController');

router.get('/buscarPCs/:idHospital', function(req, res){
    computadorController.buscarComputadores(req, res)
});


module.exports = router;