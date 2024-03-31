const database = require("../database/config");

function cadastrar(razaoSocial, nomeFantasia, cnpj, email, senha, idEndereco){
    const query = `INSERT INTO hospital (razaoSocial, nomeFantasia, cnpj, email, senha, fkEndereco, verificado) VALUES 
    ('${razaoSocial}', '${nomeFantasia}', '${cnpj}', '${email}', '${senha}', ${idEndereco}, 'false');`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function autenticar(senha, email){
    const query = `SELECT nome, email, tipo, privilegio FROM conta 
    WHERE senha = '${senha}' 
    AND email = '${email}';`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

module.exports= {
    cadastrar,
    autenticar
}