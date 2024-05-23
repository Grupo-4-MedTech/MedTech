chkLoginDash();
const table_causas = document.getElementById('table_causas');
const div_kpis = document.getElementById('div_kpis');
const select = document.getElementById('select_data');
const ctx01 = document.getElementById('chart01');
const options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};


//labels = datas
//data = ocorrencias
const dataChart = {
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    datasets: [{
        label: 'Número de incidentes',
        data: [8, 3, 2, 6, 4, 2, 1],
        borderWidth: 1,
        borderColor: '#37dadf'
    }]
}
const chart = new Chart(ctx01, {
    type: 'line',
    data: dataChart,
    options: options
});

select.addEventListener('change', () => searchChartData());

function searchChartData(data = select.value) {
    const date = new Date
    if (data == 1) {
        const day = Number(date.toISOString().slice(8, 10));
        data = `DAY(dtOcorrencia) IN (${day}, ${day - 1}, ${day - 2}, ${day - 3}, ${day - 4}, ${day - 5}, ${day - 6}) AND MONTH(dtOcorrencia) = ${date.getMonth() + 1} AND YEAR(dtOcorrencia) = ${date.toISOString().slice(0, 4)}`
    } else if (data == 2) {
        data = `MONTH(dtOcorrencia) = ${date.getMonth() + 1} AND YEAR(dtOcorrencia) = ${date.toISOString().slice(0, 4)}`;
    } else if (data == 3) {
        data = `MONTH(dtOcorrencia) IN(${date.getMonth() + 1}, ${date.getMonth()}, ${date.getMonth() - 1}) AND YEAR(dtOcorrencia) = ${date.toISOString().slice(0, 4)}`
    } else {
        data = null;
    }

    fetch(`/computador/logs/${data}/crítico/${sessionStorage.HOSP}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((res) => {
            if (res.status != 200) {
                res.text().then(text => showMessage(false, text));
                fillChart();
            } else {
                res.json().then((json) => {
                    fillChart(json);
                });
            }
                
        })
        .catch(error => console.log(error))
}

function fillChart(json = []) {
    const data = mapOcurrences(json);
    dataChart.datasets[0].data = data.occurences;
    dataChart.labels = data.date;
    chart.update();
}

function mapOcurrences(json) {
    let data = {
        date: [],
        occurences: []
    }

    let resultsByDate = [];
    //Agrupando por data
    json.forEach(r1 => {
        r1.dtOcorrencia = r1.dtOcorrencia.slice(0, 10);
        let array = json.map((r2) => { //Rodando para procurar datas iguais
            r2.dtOcorrencia = r2.dtOcorrencia.slice(0, 10);
            if (r2.dtOcorrencia === r1.dtOcorrencia) {
                if (resultsByDate.map((x)=>{if (x[0].dtOcorrencia == r2.dtOcorrencia) {return x;}}).filter(x => x != undefined).length < 1) {//Comparando com os results by date para ver se essa data já está no array
                    return r2;
                }
            }
        }).filter(x => x != undefined);

        if (array.length > 0) {
            resultsByDate.push(array);
        }
    });

    // console.log(`ANTES:`)
    // console.log(JSON.stringify(resultsByDate))
    //Filtrando ocorrencias da mesma data, de um mesmo componente e de um mesmo computador
    for (let i = 0; i < resultsByDate.length; i++) {
        for (let j = resultsByDate[i].length - 1; j >= 0; j--) {
            for (let k = resultsByDate[i].length - 1; k >= 0 && j <= resultsByDate[i].length - 1; k--) {
                if (JSON.stringify(resultsByDate[i][k]) !== JSON.stringify(resultsByDate[i][j])) {
                    if (
                        resultsByDate[i][k].dtOcorrencia === resultsByDate[i][j].dtOcorrencia &&
                        resultsByDate[i][k].fkComputador === resultsByDate[i][j].fkComputador &&
                        resultsByDate[i][k].causa === resultsByDate[i][j].causa
                    ) {
                        resultsByDate[i].splice(k, 1);
                    }
                }
            }
        }
    }
    // console.log('DEPOIS')
    // console.log(JSON.stringify(resultsByDate))
    let cpu = 0;
    let ram = 0;
    let disco = 0;

    resultsByDate.forEach(element => {
        data.date.push(element[0].dtOcorrencia);
        data.occurences.push(element.length);

        element.forEach(index => {
            if (index.causa === 'cpu') {
                cpu += 1;
            } else if (index.causa === 'ram') {
                ram += 1;
            } else {
                disco += 1;
            }
        })
    });

    table_causas.innerHTML = `
        <tr>
            <th>Principais causas</th>
        </tr>
        <tr>
            <td>CPU</td>
            <td> ${cpu}</td>
        </tr>
        <tr>
            <td>RAM</td>
            <td> ${ram} </td>
        </tr>
        <tr>
            <td>Disco </td>
            <td> ${disco} </td>
        </tr>
    `;

    return data;
}

function searchStatusKpis() {
    fetch(`/computador/historico/${sessionStorage.HOSP}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((res) => {
        if (res.status != 200) {
            res.text().then((text) => {
                showMessage(false, text);
            })
        } else {
            res.json().then((json) => {
                printKpis(json);
            })
        }
    })
}

function printKpis(json = []) {
    console.log(json);
    json = json[0];

    // > 100 = - 100

    const prctCrit = json.critAtual * 100 / json.critUltimaSem;
    const prctAlerta = json.alertaAtual * 100 / json.alertaUltimaSem;

    div_kpis.innerHTML = `<div class="dashNotification">
    <div class="notificationCard statusRed">
        <h3>Crítico</h3>
        <div class="subtextos">
            <span class="notificationNumber">${json.critAtual}<img ${prctCrit > 100 ? null : 'class="upArrow"' } src="../assets/img/arrow.png">
            </span>

            <span class="porcentagem">
                ${prctCrit > 100 ? `Aumento de ${Math.round(prctCrit - 100)}% em relação a última semana` : `Diminuição de ${Math.round(prctCrit)}% desde a última semana`}
            </span>
        </div>
    </div>
    <div class="notificationCard statusYellow">
        <h3>Alerta</h3>
        <div class="subtextos">
            <span class="notificationNumber">${json.alertaAtual}<img ${prctAlerta > 100 ? null: 'class="upArrow"' } src="../assets/img/arrow.png">
            </span>
            <span class="porcentagem">
            ${prctAlerta > 100 ? `Aumento de ${Math.round(prctAlerta - 100)}% em relação a última semana` : `Diminuição de ${Math.round(prctAlerta)}% desde a última semana`}
            </span>
        </div>

    </div>
    <div class="notificationCard statusGray">
        <h3>Offline</h3>
        <div class="subtextos">
            <span class="notificationNumber">8<img src="../assets/img/arrow.png">
            </span>

            <span class="porcentagem">
                Aumento de 30% desde a última semana
            </span>
        </div>`
}

searchChartData();
searchStatusKpis();
