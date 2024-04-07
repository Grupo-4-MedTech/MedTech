function autenticar(senha, email){
    const query = `SELECT nome, email, cpf, telefone, cargo, fkHospital FROM funcionario 
    WHERE senha = '${senha}' 
    AND email = '${email}';`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

const database = require("../database/config");

module.exports = {
    autenticar
}