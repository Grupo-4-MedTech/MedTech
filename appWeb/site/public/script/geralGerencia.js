chkLoginDash();
let mainChart;
listeningSelect_data = false;
function searchHistory(data = select_data.value) {
    const date = new Date();
    if (data == 1) {
        const day = Number(date.toISOString().slice(8, 10));
        data = `DAY(dtLeitura) IN (${day}, ${day - 1}, ${day - 2}, ${day - 3}, ${day - 4}, ${day - 5}, ${day - 6}) AND MONTH(dtLeitura) = ${date.getMonth() + 1} AND YEAR(dtLeitura) = ${date.toISOString().slice(0, 4)}`
    } else if (data == 2) {
        data = `MONTH(dtLeitura) = ${date.getMonth() + 1} AND YEAR(dtLeitura) = ${date.toISOString().slice(0, 4)}`;
    } else if (data == 3) {
        data = `MONTH(dtLeitura) IN(${date.getMonth() + 1}, ${date.getMonth()}, ${date.getMonth() - 1}) AND YEAR(dtLeitura) = ${date.toISOString().slice(0, 4)}`
    } else {
        data = null;
    }

    fetch(`/computador/historico-ferramentas/${sessionStorage.HOSP}/${data}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((res) => {
            if (res.status != 200) {
                res.text().then(text => alert(text));
                fillChart();
            } else {
                res.json().then((json) => {
                    console.log(json);
                    fillChart(json);
                });
            }

        })
        .catch(error => console.log(error));
}

function fillChart(json = []) {
    if (mainChart) {
        mainChart.destroy();
    }
    const ctx01 = document.getElementById('chart01');
    const dtChart = {
        labels: [],
        datasets: [{
            label: 'Acessos',
            data: [],
            borderWidth: 1
        }]
    }

    json.forEach(row => {
        dtChart.labels.push(row.nomeApp);
        dtChart.datasets[0].data.push(row.qtdLeituras);
    });

    mainChart = new Chart(ctx01, {
        type: 'bar',
        data: dtChart,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const date = new Date().toISOString();
    lastUpdate.innerHTML = `Atualizado em: ${date.slice(0, 10).replace(/\-/g, '/')} às ${date.slice(11, 19)}`;

    if (!listeningSelect_data) {
        select_data.addEventListener('change', () => {
            searchHistory();
        });
        listeningSelect_data = true;
    }
}

function searchKpisData() {
    fetch(`/computador/historico/${sessionStorage.HOSP}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((res) => {
            if (res.status != 200) {
                res.text().then((text) => {
                    if (text.indexOf("<!") > -1) {
                        showMessage(true, 'Houve um erro inesperado. Por favor, entre em contato com o nosso suporte.');
                    } else {
                        showMessage(false, text);
                    }
                    printKpis();
                })
            } else {
                res.json().then((json) => {
                    console.log(json)
                    printKpis(json);
                })
            }
        }).catch((error) => {
            console.log(error);
            showMessage(true, 'Houve um erro inesperado. Por favor, entre em contato com o nosso suporte.')
        });
}

function printKpis(json = []) {
    json = json[0];
    json.offlineAtual = ([null, undefined, 0].indexOf(json.offlineAtual) > -1 ? 0 : json.offlineAtual);
    json.onlineAtual = ([null, undefined, 0].indexOf(json.onlineAtual) > -1 ? 0 : json.onlineAtual);

    div_notification.innerHTML = `
    <div class="notificationCard statusGreen">
        <h3>Online</h3>
        <div class="subtextos">
            <span class="notificationNumber">${json.onlineAtual}
            </span>

            <span class="porcentagem">
                ${json.onlineAtual == 1 ? 'Computador' : 'Computadores'} online
            </span>
        </div>
    </div>
    <div class="notificationCard statusGray">
        <h3>Offline</h3>
        <div class="subtextos">
            <span class="notificationNumber">8
            </span>

            <span class="porcentagem">
                ${json.offlineAtual == 1 ? 'Computador' : 'Computadores'} offline
            </span>
        </div>
    </div>
    `;
}

function searchDeps() {
    fetch(`/hospital/departamentos/${sessionStorage.ID}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((res) => {
            if (res.status != 200) {
                res.text().then((text) => {
                    showMessage(false, text);
                    loadNavBar();
                })
            } else {
                res.json().then((json) => {
                    loadNavBar(json);
                })
            }
        })
        .catch((error) => {
            console.log(error);
            showMessage(true, 'Houve um erro inesperado. Por favor, entre em contato com o nosso suporte.')
        });
}

function loadNavBar(json = []) {
    let content = `
    <a href="#" class="navSelected" onclick="loadGeral()">
        <li>Geral</li>
    </a>`;

    json.forEach(row => {
        content += `
        <a onclick="searchCompByDep(${row.idDepartamento})">
            <li>${row.nome}</li>
        </a>
        `;
    })

    nav_setores.innerHTML = content;
}

function searchCompByDep(id) {
    fetch(`/computador/historico-atividade/${id}`, {
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
                    alert(json);
                })
            }
        })
        .catch((error) => {
            console.log(error);
            showMessage(true, 'Houve um erro inesperado. Por favor, entre em contato com o nosso suporte.')
        });
}

function loadGeral() {
    dashboard_screendiv.innerHTML = `
        <div class="containerCardsTopo">
        <div class="dashNotification" id="div_notification">
            <div class="notificationCard statusGreen">
                <h3>Online</h3>
                <div class="subtextos">
                    <span class="notificationNumber">
                    </span>

                    <span class="porcentagem">
                    </span>
                </div>
            </div>
            <div class="notificationCard statusGray">
                <h3>Offline</h3>
                <div class="subtextos">
                    <span class="notificationNumber">
                    </span>

                    <span class="porcentagem">
                    </span>
                </div>

            </div>
        </div>

        </div>
        <br><br>
        <div class="dashDescription">
            <span class="titulo">
                <h2>Guias mais acessadas</h2>
            </span>

        </div><br><br>
        <div class="att-select">
            <div class="data-atualizacao">
                <h3 id="lastUpdate"> Atualizado em: 30/04/2024, às 20:32. </h3>
            </div>

            <select class="select-data" id="select_data">
                <option value="null" selected disabled>Período de busca</option>
                <option value="1">Última semana</option>
                <option value="2">Último mês</option>
                <option value="3">Últimos 3 meses</option>
                <option value="null">Todos os tempos</option>
            </select>

        </div>
        <div class="dashContent">
            <div class="mainChart">
                <canvas id="chart01" class="mainChart"></canvas>
            </div>

        </div>

        </div>
    `;

    searchHistory();
    searchKpisData();
}

searchDeps();
searchHistory();
searchKpisData();