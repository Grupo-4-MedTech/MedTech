
const database = require("../database/config");

function autenticar(senha, email) {
    const query = `SELECT * FROM funcionario 
    WHERE senha = '${senha}' 
    AND email = '${email}';`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function findById(id) {
    const query = `
    SELECT c.* FROM funcionario f JOIN configEmail c ON c.fkFuncionario = f.idFuncionario WHERE f.idFuncionario = ${id};`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function findFuncByAcesso(idDepartamento) {
    const query = `
    SELECT f.* FROM funcionario f JOIN acesso a ON a.fkFuncionario = f.idFuncionario
    WHERE a.fkDepartamento = ${idDepartamento}
    AND a.responsavel = 1; 
    `;

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

function adicionarUsuario(nome, email, cargo, fkHospital, senha, telefone, cpf){
    const query = `INSERT INTO funcionario (nome, email, cargo, fkHospital, senha, telefone, cpf) VALUES ('${nome}', '${email}', '${cargo}', ${fkHospital}, '${senha}', '${telefone}', '${cpf}');`;
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}
function deletar(idFuncionario){
    const query = `EXEC delete_funcionario ${idFuncionario};`
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function editarFuncionario(updateNome, updateEmail, updateCargo, idFuncionario, telefone, cpf) {
    var instrucaoSql = `
        UPDATE funcionario SET
        nome = '${updateNome}',
        email = '${updateEmail}',
        cargo = '${updateCargo}',
        telefone = '${telefone}',
        cpf = '${cpf}'
        WHERE idFuncionario = ${idFuncionario};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function updateMailConfig(id, host, port, email, pass){
    const query = `
    UPDATE configEmail
    SET 
    host = '${host}',
    port = '${port}',
    email = '${email}',
    pass = '${pass}'
    WHERE fkFuncionario = ${id};
    `;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function assignAccess(email, deps) {
    let query = `SELECT * FROM funcionario WHERE email = '${email}';`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query)
        .then((res) => {
            res = res[0];

            query = `DELETE FROM acesso WHERE fkFuncionario = ${res.idFuncionario};`;
            console.log("Executando a instrução SQL: \n" + query);
            return database.executar(query).then(() => {
                let query2 = `INSERT INTO acesso (fkDepartamento, fkHospital, fkFuncionario, responsavel) VALUES`;

                for (let i = 0; i < deps.length; i++) {
                    query2 += `
                    (${deps[i]}, ${res.fkHospital}, ${res.idFuncionario}, 0)`
                    if (i < deps.length - 1) {
                        query2 += ','
                    }
                }

                query2 += ';';
                console.log("Executando a instrução SQL: \n" + query2);
                return database.executar(query2)
            })
        })
}


module.exports = {
    autenticar,
    update,
    chkLogin,
    buscar,
    adicionarUsuario,
    deletar,
    editarFuncionario,
    findById,
    findFuncByAcesso,
    updateMailConfig,
    assignAccess
}