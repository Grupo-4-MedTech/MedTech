const database = require("../database/config"); 

function buscarPCs(idHospital){
    const query = `SELECT * FROM computador WHERE fkHospital = '${idHospital}';`;
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

module.exports = {
    buscarPCs
}
