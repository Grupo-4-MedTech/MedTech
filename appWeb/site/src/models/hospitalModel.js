const database = require("../database/config");

function cadastrar(razaoSocial, nomeFantasia, cnpj, email, senha, idEndereco){
    const query = `INSERT INTO hospital (razaoSocial, nomeFantasia, cnpj, email, senha, fkEndereco, verificado) VALUES 
    ('${razaoSocial}', '${nomeFantasia}', '${cnpj}', '${email}', '${senha}', ${idEndereco}, false);`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function buscarPorId(id){
    const query = `SELECT * FROM hospital WHERE idHospital = ${id};`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function deleteHospital(hospital){
    const query = `DELETE FROM hospital WHERE idHospital = ${hospital.idHospital};`;
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

module.exports= {
    cadastrar,
    buscarPorId,
    deleteHospital
}