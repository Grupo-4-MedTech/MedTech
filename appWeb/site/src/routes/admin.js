const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.post('/login', function(req, res) {
    adminController.login(req, res);    
})

router.get('/islogged/:token', function(req, res){
    adminController.chkLogin(req, res);
})

module.exports = router;