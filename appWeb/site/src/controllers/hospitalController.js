const hospitalModel = require("../models/hospitalModel");
const enderecoModel = require("../models/enderecoModel");
const emailController = require("./emailController");

function cadastrar(req, res) {

    const razaoSocial = req.body.razaoSocial;
    const nomeFantasia = req.body.nomeFantasia;
    const cnpj = req.body.cnpj;
    const cep = req.body.cep;
    const rua = req.body.rua;
    const numero = req.body.numero;
    const complemento = req.body.complemento;
    const uf = req.body.uf;
    const email = req.body.email;
    const senha = req.body.senha;

    if (
        !/^[A-Za-z\s]{6,25}$/.test(razaoSocial) ||
        !/^[a-zA-Z\s]{6,25}$/.test(nomeFantasia) ||
        !/^[0-9]{14}$/.test(cnpj) ||
        !/^[0-9]{8}$/.test(cep) ||
        !/^[a-zA-Z\s]{10,25}$/.test(rua) ||
        !/^[1-9][0-9]{2,}$/.test(numero) ||
        !/^[a-zA-Z]{2}$/.test(uf) ||
        !/^[a-zA-Z0-9\s]{0,255}$/.test(complemento) ||
        !/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email) ||
        !/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha)
    ) {
        res.status(401).send('Dados Inválidos!');
    } else {

        enderecoModel.cadastrar(cep, rua, numero, complemento, uf)
            .then((result) => {
                const idEndereco = result.insertId;
                hospitalModel.cadastrar(razaoSocial, nomeFantasia, cnpj, email, senha, idEndereco)
                    .then((result) => {
                        hospitalModel.buscarPorId(result.insertId).then((hospital) => {
                            emailController.emailCadastro(hospital[0])
                                .then(() => {
                                    console.log('email enviado');
                                    res.status(201).json(result);
                                })
                                .catch((error) => {
                                    console.log(error);
                                    hospitalModel.deleteHospital(hospital[0].idHospital);
                                    res.status(401).send('Não foi possível finalizar o cadastro!');
                                })
                        })
                    }).catch((error) => {
                        console.error("Erro:", error);
                    });
            })
            .catch((error) => {
                console.error("Erro:", error);
            });
    }
}

function find(req, res) {
    const data = Object.entries(req.params);

    hospitalModel.find(data).then((result) => {
        if (result.length > 0) {
            res.status(201).json(result);
        } else {
            res.status(200).send('Nenhum registro encontrados com estas especificações.');
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send('Houve um erro inesperado. Entre em contato com nosso suporte.');
    })
}

function deleteHospital(req, res) {
    hospitalModel.deleteHospital(req.params.idHospital).then((result) => {
        res.status(200);
        if (!result.affectedRows > 0) {
            res.send('Nenhum registro foi apagado.');
        } else {
            res.send('Resgistro apagado com sucesso!');
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send('Houve um erro inesperado. Entre em contato com nosso suporte.');
    })
}

function updateHospital(req, res) {
    hospitalModel.updateHospital(req.params.idHospital, req.body)
    .then((result) => {
        if (!result.affectedRows > 0) {
            res.send('Nenhum registro alterado.');
        } else {
            res.send('Registro alterado com sucesso!');
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send('Houve um erro inesperado. Entre em contato com nosso suporte.');
    })
}

module.exports = {
    cadastrar,
    find,
    deleteHospital,
    updateHospital
}