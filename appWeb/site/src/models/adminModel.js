const database = require('../database/config');

function login(email, senha) {
    const query = `SELECT * FROM contaMedtech WHERE email = '${email}' AND senha = '${senha}';`;
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function update(conta) {
    // SE NECESSÁRIO ADPATAR UPDATE PARA QUE FUNCIONE DA MESMA FORMA DO MÉTODO find() DO HOSPITAL MODEL
    const query = `UPDATE contaMedtech SET token = '${conta.token}' WHERE idContaMedtech = ${conta.idContaMedtech};`;
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function chkLogin(token) {
    const query = `SELECT * FROM contaMedtech WHERE token = '${token}';`
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

module.exports = {
    login,
    update,
    chkLogin
}