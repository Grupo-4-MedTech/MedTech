const hospitalModel = require("../models/hospitalModel");
const enderecoModel = require("../models/enderecoModel");

function cadastrar(req, res) {

    const razaoSocial  = req.body.razaoSocial;
    const nomeFantasia = req.body.nomeFantasia;
    const cnpj         = req.body.cnpj;
    const cep          = req.body.cep;
    const rua          = req.body.rua;
    const numero       = req.body.numero;
    const complemento  = req.body.complemento;
    const uf           = req.body.uf;
    const email        = req.body.email;
    const senha        = req.body.senha;

    enderecoModel.cadastrar(cep, rua, numero, complemento, uf)
    .then((result) => {

        console.log("Recebido: ", result);

        const idEndereco = result.insertId;

        hospitalModel.cadastrar(razaoSocial, nomeFantasia, cnpj, email, senha, idEndereco)
        .then((result)=>{
            res.status(201).json(result);
        }).catch((error) => {
            console.error("Erro:", error);
        });
    })
    .catch((error) => {
        console.error("Erro", error);
    });  
}

function autenticar(req, res){

    const senha = req.body.senha;
    const email = req.body.email;

    hospitalModel.autenticar(senha, email)
    .then((result)=>{
        if(result.length != 1){
            res.status(400).send('Email ou senha incorretos.');
        }else {
            res.status(201).json(result[0]);
        }
    })
    .catch((error)=>{

        res.status(500).send('Erro inesperado.');
        console.log(error);
    })
}

module.exports = {
    cadastrar,
    autenticar
}