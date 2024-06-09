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

    query += `CAST(dtOcorrencia AS DATE) != CAST(GETDATE() AS DATE)`;

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
            AND grau = 'crítico'
            AND CAST(dtOcorrencia AS DATE) BETWEEN CAST(DATEADD(DAY, -6, GETDATE()) AS DATE) AND CAST(GETDATE() AS DATE)
            GROUP BY fkComputador, CAST(dtOcorrencia AS DATE)
        ) max_ocorrencias ON lc.fkComputador = max_ocorrencias.fkComputador AND lc.dtOcorrencia = max_ocorrencias.ultimaOcorrencia) AS critUltimaSem,
    (SELECT COUNT(*) 
        FROM computador 
        WHERE status = 'crítico' 
        AND fkHospital = ?) AS critAtual,
    (SELECT COUNT(DISTINCT lc.fkComputador) AS count_critical_computers
        FROM logComputador lc
        INNER JOIN (
            SELECT fkComputador, MAX(dtOcorrencia) AS ultimaOcorrencia
            FROM logComputador
            WHERE fkHospital = ?
            AND grau = 'alerta'
            AND CAST(dtOcorrencia AS DATE) BETWEEN CAST(DATEADD(DAY, -6, GETDATE()) AS DATE) AND CAST(GETDATE() AS DATE)
            GROUP BY fkComputador, CAST(dtOcorrencia AS DATE)
        ) max_ocorrencias ON lc.fkComputador = max_ocorrencias.fkComputador AND lc.dtOcorrencia = max_ocorrencias.ultimaOcorrencia) AS alertaUltimaSem,
    (SELECT COUNT(*) 
        FROM computador 
        WHERE status = 'alerta' 
        AND fkHospital = ?) AS alertaAtual,
    (SELECT COUNT(*) 
        FROM computador 
        WHERE atividade = 0 
        AND fkHospital = ?) AS offlineAtual,
    (SELECT COUNT(*) 
        FROM computador 
        WHERE atividade = 1 
        AND fkHospital = ?) AS onlineAtual;
    `.replace(/\?/g, fkHospital);

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function historicLeituras(status, fkHospital) {
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
    const query = `INSERT INTO computador (nome, codPatrimonio, fkDepartamento, senha, fkHospital) VALUES ('${nome}', '${codPatrimonio}', ${fkDepartamento}, '${senha}', ${fkHospital});`;
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function historicFerramentas(data) {
    let query = 'SELECT TOP 10 nomeApp, COUNT(*) qtdLeituras FROM leituraFerramenta';
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

    query += ' GROUP BY nomeApp ORDER BY qtdLeituras;';
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function deletar(idComputador){
    const query = `EXEC delete_computador ${idComputador};`
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function editarPC(updateNome, updateCodPatrimonio, updateSenha, updateDepartamento,  idComputador) {
    var instrucaoSql = `
        UPDATE computador SET
        nome = '${updateNome}',
        codPatrimonio = '${updateCodPatrimonio}',
        senha = '${updateSenha}',
        fkDepartamento = '${updateDepartamento}'  WHERE idComputador = ${idComputador}`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function findComputerByDeps(fkDepartamento){
    const query = `
    SELECT
    c.*,
    d.nome nomeDepartamento
    FROM computador c JOIN departamento d ON c.fkDepartamento = d.idDepartamento WHERE fkDepartamento = ${fkDepartamento};`;
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function historicAtividade(fkComputador) {
    const query = `
    WITH ParesDeEventos AS (
        SELECT
            l.fkComputador,
            CAST(l.dtOcorrencia AS DATE) AS dia,
            l.dtOcorrencia AS inicio,
            MIN(ld.dtOcorrencia) AS fim
        FROM logAtividade l
                JOIN logAtividade ld
                ON l.fkComputador = ld.fkComputador
                AND l.atividade = 1
                AND ld.atividade = 0
                AND ld.dtOcorrencia > l.dtOcorrencia
        WHERE l.dtOcorrencia >= DATEADD(DAY, -8, GETDATE())
        GROUP BY l.fkComputador, l.dtOcorrencia
    )
     SELECT
         dia,
         fkComputador,
         (SUM(DATEDIFF(SECOND, inicio, fim)) / 3600.0) AS tempo_ligado
     FROM ParesDeEventos
     WHERE fkComputador = ${fkComputador}
     GROUP BY dia, fkComputador
     ORDER BY dia, fkComputador;
    `;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function lastFourFerramentas (idComputador){
    const query = `SELECT TOP 4 *
    FROM leituraFerramenta AS lf1
    WHERE EXISTS (
        SELECT 1
        FROM leituraFerramenta AS lf2
        WHERE lf1.fkComputador = lf2.fkComputador
        AND lf1.nomeApp = lf2.nomeApp
        GROUP BY lf2.fkComputador, lf2.nomeApp
        HAVING MAX(lf2.dtLeitura) = lf1.dtLeitura
    )
    AND lf1.fkComputador = ${idComputador}
    ORDER BY lf1.dtLeitura;`;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function findMetrica (idComputador) {
    const query = `SELECT * FROM metrica WHERE fkComputador = ${idComputador};`;
    
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function updateMetrica (atributes, idComputador) {
    const query = `
    UPDATE metrica
    SET 
        alertaRam = ${atributes.alertaRam},
        alertaCritRam = ${atributes.alertaCritRam},
        alertaCpu = ${atributes.alertaCpu},
        alertaCritCpu = ${atributes.alertaCritCpu},
        alertaDisco = ${atributes.alertaDisco},
        alertaCritDisco = ${atributes.alertaCritDisco}
    WHERE 
        fkComputador = ${idComputador};
    `;

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

module.exports = {
    buscarPorId,
    findLogs,
    historic,
    adicionarPC,
    historicLeituras,
    historicFerramentas,
    deletar,
    historicAtividade,
    findComputerByDeps,
    lastFourFerramentas,
    editarPC,
    findMetrica,
    updateMetrica
}
