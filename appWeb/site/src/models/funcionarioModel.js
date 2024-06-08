
const database = require("../database/config");

function autenticar(senha, email) {
    const query = `SELECT * FROM funcionario 
    WHERE senha = '${senha}' 
    AND email = '${email}';`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function update(funcionario) {
    const query = `UPDATE funcionario SET token = '${funcionario.token}' 
    WHERE idFuncionario = ${funcionario.idFuncionario};`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function chkLogin(token) {
    const query = `SELECT * FROM funcionario WHERE token = '${token}';`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function buscar(idHospital){
    const query = `SELECT * FROM funcionario WHERE fkHospital = '${idHospital}';`;
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function adicionarUsuario(nome, email, cargo, fkHospital){
    const query = `INSERT INTO funcionario (nome, email, cargo, fkHospital) VALUES ('${nome}', '${email}', '${cargo}', ${fkHospital});`
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}
function deletar(idFuncionario){
    const query = `DELETE FROM funcionario WHERE idFuncionario = ${idFuncionario}`
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function editarFuncionario(updateNome, updateEmail, updateCargo, idFuncionario) {
    var instrucaoSql = `
        UPDATE funcionario SET
        nome = '${updateNome}',
        email = '${updateEmail}',
        cargo = '${updateCargo}'
        WHERE idFuncionario = ${idFuncionario};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    update,
    chkLogin,
    buscar,
    adicionarUsuario,
    deletar,
    editarFuncionario
}