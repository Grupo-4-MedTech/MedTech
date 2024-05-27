const database = require("../database/config");

function buscarPorId(idHospital) {
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

    if (query.indexOf('WHERE') > -1) {
        query += ` AND `;
    } else {
        query += ` WHERE `;
    }

    query += `DATE(dtOcorrencia) != DATE(NOW())`;

    query += ' ORDER BY dtOcorrencia;';
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}


function historic(fkHospital) {
    const query = `
    SELECT
    (SELECT COUNT(DISTINCT lc.fkComputador) AS count_critical_computers
		FROM logComputador lc
		INNER JOIN (
			SELECT fkComputador, MAX(dtOcorrencia) AS ultimaOcorrencia
			FROM logComputador
			WHERE fkHospital = ?
			AND grau = 'alerta'
			AND DATE(dtOcorrencia) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 DAY) - INTERVAL 6 DAY AND CURDATE()
			GROUP BY fkComputador, DATE(dtOcorrencia)
	) max_ocorrencias ON lc.fkComputador = max_ocorrencias.fkComputador AND lc.dtOcorrencia = max_ocorrencias.ultimaOcorrencia) critUltimaSem,
    (SELECT count(*) FROM computador WHERE status = 'crítico' AND fkHospital = ? GROUP BY(fkHospital)) critAtual,
    (SELECT COUNT(DISTINCT lc.fkComputador) AS count_critical_computers
        FROM logComputador lc
        INNER JOIN (
            SELECT fkComputador, MAX(dtOcorrencia) AS ultimaOcorrencia
            FROM logComputador
            WHERE fkHospital = ?
            AND grau = 'alerta'
            AND DATE(dtOcorrencia) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 DAY) - INTERVAL 6 DAY AND CURDATE()
            GROUP BY fkComputador, DATE(dtOcorrencia)
	) max_ocorrencias ON lc.fkComputador = max_ocorrencias.fkComputador AND lc.dtOcorrencia = max_ocorrencias.ultimaOcorrencia) alertaUltimaSem,
    (SELECT count(*) FROM computador WHERE status = 'alerta' AND fkHospital = ? GROUP BY(fkHospital)) alertaAtual,
    (SELECT count(*) FROM computador WHERE atividade = 0 AND fkHospital = ? GROUP BY(fkHospital)) offlineAtual,
    (SELECT count(*) FROM computador WHERE atividade = 1 AND fkHospital = ? GROUP BY(fkHospital)) onlineAtual;
    `.replace(/\?/g, fkHospital);

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function ultimasLeituras(status, fkHospital) {
    let query = `
    SELECT
        c.idComputador,
        c.nome,
        c.status,
        c.dtStatusUpdate,
        c.modeloProcessador,
        c.codPatrimonio,
        c.senha,
        c.gbRAM,
        c.gbDisco,
        c.fkDepartamento,
        c.fkHospital,
        lr.ram AS ramLeitura,
        lr.cpu AS cpuLeitura,
        lr.dataLeitura AS dataLeituraRamCpu,
        ld.disco AS discoLeitura,
        ld.dataLeitura AS dataLeituraDisco
    FROM
        computador c
    LEFT JOIN (
        SELECT
            lr1.fkComputador,
            lr1.ram,
            lr1.cpu,
            lr1.dataLeitura
        FROM
            leituraRamCpu lr1
        INNER JOIN (
            SELECT
                fkComputador,
                MAX(dataLeitura) AS maxDataLeitura
            FROM
                leituraRamCpu
            GROUP BY
                fkComputador
        ) lr2 ON lr1.fkComputador = lr2.fkComputador
        AND lr1.dataLeitura = lr2.maxDataLeitura
    ) lr ON c.idComputador = lr.fkComputador
    LEFT JOIN (
        SELECT
            ld1.fkComputador,
            ld1.disco,
            ld1.dataLeitura
        FROM
            leituraDisco ld1
        INNER JOIN (
            SELECT
                fkComputador,
                MAX(dataLeitura) AS maxDataLeitura
            FROM
                leituraDisco
            GROUP BY
                fkComputador
        ) ld2 ON ld1.fkComputador = ld2.fkComputador
        AND ld1.dataLeitura = ld2.maxDataLeitura
    ) ld ON c.idComputador = ld.fkComputador
    WHERE c.fkHospital = ${fkHospital}
    `;

    if (status == 'offline') {
        query += `AND c.atividade = 0;`;
    } else {
        query += `AND c.status = '${status}';`;
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function adicionarPC(nome, codPatrimonio, fkDepartamento, senha, fkHospital){
    const query = `INSERT INTO computador (nome, codPatrimonio, fkDepartamento, senha, fkHospital) VALUES ('${nome}', '${codPatrimonio}', ${fkDepartamento}, '${senha}', ${fkHospital})`
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function historicFerramentas(data) {
    let query = 'SELECT nomeApp, COUNT(*) qtdLeituras FROM leituraFerramenta';
    let i = 0;
    for (let [field, value] of data) {
        if (i === 0) {
            query += ` WHERE `;
        } else {
            query += ` AND `;
        }

        if (field === 'dtLeitura') {
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

    query += ' GROUP BY nomeApp ORDER BY qtdLeituras LIMIT 10;';
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

module.exports = {
    buscarPorId,
    findLogs,
    historic,
    adicionarPC,
    ultimasLeituras,
    historicFerramentas
}
