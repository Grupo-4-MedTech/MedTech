const hospitalModel = require("../models/hospitalModel");
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
        !/^[1-9][0-9]{1,}$/.test(numero) ||
        !/^[a-zA-Z]{2}$/.test(uf) ||
        !/^[a-zA-Z0-9\s]{0,255}$/.test(complemento) ||
        !/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email) ||
        !/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha)
    ) {
        res.status(401).send('Dados Inválidos!');
    } else {

        hospitalModel.cadastrar(razaoSocial, nomeFantasia, cnpj, email, senha, cep, rua, numero, complemento, uf)
            .then((result) => {
                emailController.emailCadastro(result[0])
                    .then(() => {
                        console.log('email enviado');
                        res.status(201).json(result);
                    })
                    .catch((error) => {
                        console.log(error);
                        hospitalModel.deleteHospital(result[0].idHospital);
                        res.status(401).send('Não foi possível finalizar o cadastro!');
                    })
            })
            .catch((error) => {
                console.error("Erro:", error);
                res.status(500).send('Erro inesperado! Por favor, tente novamente mais tarde.');
            });
    }
}

function find(req, res) {
    const data = Object.entries(req.params);

    hospitalModel.find(
        data.map((x) => { if (x[1] != 'null') { return x; } }).filter(x => x != undefined)
    ).then((result) => {
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
        res.send('Registro apagado com sucesso!');
    }).catch((error) => {
        console.log(error);
        res.status(500).send('Houve um erro inesperado. Entre em contato com nosso suporte.');
    })
}

function updateHospital(req, res) {
    hospitalModel.updateHospital(req.params.idHospital, req.body)
        .then(() => {
            res.send('Registro alterado com sucesso!');
        }).catch((error) => {
            console.log(error);
            res.status(500).send('Houve um erro inesperado. Entre em contato com nosso suporte.');
        })
}

function listar(req, res) {
    hospitalModel.listar(req.params.idHospital)
        .then((resultado) => {
            res.status(200).json(resultado);
        });
}

function findDepsByFunc(req, res) {
    hospitalModel.findDepsByFunc(req.params.idFuncionario)
        .then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(400).send('Nenhum registro encontrado.');
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Houve um erro inesperado! Por favor, entre em contato com o nosso suporte.');
        })
}

function updateMetricas(req,res) {
    if (
        req.body.alertaRam >= req.body.alertaCritRam ||
        req.body.alertaCpu >= req.body.alertaCritCpu ||
        req.body.alertaDisco >= req.body.alertaCritDisco
    ) {
        res.status(500).send('As porcentagens de alerta devem ser menores do que as de estado crítico!');
        return;
    }

    hospitalModel.updateMetricas(req.body, req.params.fkHospital)
    .then(() => {
        res.status(200).send('Registro alterado com sucesso!');
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send('Houve um erro inesperado! Por favor, entre em contato com o nosso suporte.');
    });
}

module.exports = {
    cadastrar,
    find,
    deleteHospital,
    updateHospital,
    listar,
    findDepsByFunc,
    updateMetricas
}