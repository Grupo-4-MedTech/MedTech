const express = require("express");
const emailController = require("../controllers/emailController");
const router = express.Router();

router.get("/cadastro", (req, res) => {
  emailController.emailCadastro(req, res);
})

module.exports = router;