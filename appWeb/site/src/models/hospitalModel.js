const database = require("../database/config");

function cadastrar(razaoSocial, nomeFantasia, cnpj, email, senha, cep, rua, numero, complemento, uf) {
    const query = `
    EXEC InserirHospital
    '${cep}',
    '${rua}',
    ${numero},
    '${complemento}',
    '${uf}',
    '${razaoSocial}',
    '${nomeFantasia}',
    '${cnpj}',
    '${email}',
    '${senha}';
    `;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function buscarPorId(id) {
    const query = `SELECT * FROM hospital WHERE idHospital = ${id};`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function deleteHospital(idHospital) {
    const query = `EXEC delete_hospital ${idHospital};`

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function find(data) {
    let query = 'SELECT * FROM hospitalWithEndereco';
    let i = 0;

    for (let [field, value] of data) {
        if (i === 0) {
            query += ' WHERE ';
        } else {
            query += ' AND ';
        }

        if (field === 'dtCriacao') {
            query += value;
        } else {
            query += `${field} = `;

            if (/^[0-9]$/.test(value) && ['cnpj', 'senha', 'complemento', 'cep'].indexOf(field) < 0) {
                value = Number(value);
            }
    
            if (typeof value === 'string') {
                query += `'${value}'`;
            } else {
                query += `${value}`;
            }
        }

        i++;
    }

    query += ';';
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function updateHospital(id, data) {
    const query = `UPDATE hospital SET verificado = ${Number(data.verificado)} WHERE idHospital = ${id}`;
    console.log("Executando a instrução SQL: \n" + query);

    return database.executar(query);
}
function listar(idHospital) {
    const query = `SELECT * FROM departamento WHERE fkHospital = ${idHospital};`;
    // FAZER SELECT TRAZENDO APENAS OS DEPARTAMENTOS DO HOSPITAL QUE QUEM ESTÁ CADASTRANDO PERTENCE

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function findDepsByFunc(id) {
    const query = `SELECT d.* FROM departamento d JOIN acesso a ON d.idDepartamento = a.fkDepartamento WHERE a.fkFuncionario = ${id};`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

module.exports = {
    cadastrar,
    buscarPorId,
    deleteHospital,
    find,
    updateHospital,
    listar,
    findDepsByFunc
}