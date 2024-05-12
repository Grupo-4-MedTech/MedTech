const database = require('../database/config');

function login(email, senha) {
    const query = `SELECT * FROM contaMedtech WHERE email = '${email}' AND senha = '${senha}';`;
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

module.exports = {
    login
}