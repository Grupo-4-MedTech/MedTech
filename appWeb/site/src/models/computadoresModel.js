const database = require("../database/config"); 

function buscarPorId(idHospital){
    const query = `SELECT * FROM computador WHERE fkHospital = '${idHospital}';`;
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function findLogs(data) {
    let query = 'SELECT * FROM logComputador';
    let i = 0;
    for (let [field, value] of data) {
        if (i === 0) {
            query += ` WHERE `;
        } else {
            query += ` AND `;
        }

        if (field === 'dtOcorrencia') {
            query += value;
        } else {
            query += `${field} = `;

            if (/^[0-9]$/.test(value)) {
                value = Number(value);
            }

            if (typeof value === 'string') {
                query += `'${value}'`;
            } else {
                query += `${value}`;
            }
        }

        i++
    }

    query += ';';
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}


function historic(fkHospital) {
    const query = `SELECT 
    (SELECT count(*) FROM computador WHERE status = 'crítico' AND dtStatusUpdate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND dtStatusUpdate < CURDATE() AND fkHospital = ? GROUP BY(fkHospital)) critUltimaSem,
    (SELECT count(*) FROM computador WHERE status = 'crítico' AND DATE(dtStatusUpdate) = DATE(NOW()) AND fkHospital = ? GROUP BY(fkHospital)) critAtual,
    (SELECT count(*) FROM computador WHERE status = 'alerta' AND dtStatusUpdate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND dtStatusUpdate < CURDATE() AND fkHospital = ? GROUP BY(fkHospital)) alertaUltimaSem,
    (SELECT count(*) FROM computador WHERE status = 'alerta' AND DATE(dtStatusUpdate) = DATE(NOW()) AND fkHospital = ? GROUP BY(fkHospital)) alertaAtual,
    (SELECT count(*) FROM computador WHERE status = 'offline' AND dtStatusUpdate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND dtStatusUpdate < CURDATE() AND fkHospital = ? GROUP BY(fkHospital)) offlineUltimaSem,
    (SELECT count(*) FROM computador WHERE status = 'offline' AND DATE(dtStatusUpdate) = DATE(NOW()) AND fkHospital = ? GROUP BY(fkHospital)) offlineAtual;
    ;`.replace(/\?/g, fkHospital);

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function adicionarPC(nome, codPatrimonio, fkDepartamento){
    const query = `INSERT INTO computador (nome, codPatrimonio, fkDepartamento, senha) VALUES (${nome}, ${codPatrimonio}, ${fkDepartamento}, ${senha})`
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

module.exports = {
    buscarPorId,
    findLogs,
    historic,
    adicionarPC
}
