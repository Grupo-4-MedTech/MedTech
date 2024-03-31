const database = require("../database/config");

function cadastrar(cep, rua, numero, complemento, uf){
    const query = `INSERT INTO endereco (cep, rua, numero, complemento, uf) VALUES ('${cep}', '${rua}', ${numero}, '${complemento}', '${uf}');`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);

}


module.exports= {
    cadastrar
}