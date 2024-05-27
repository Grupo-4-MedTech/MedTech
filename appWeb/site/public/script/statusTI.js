const charts = [];
let timeoutSetted = false;

function searchByState(state) {
    fetch(`/computador/buscar-ultimas-leituras/${sessionStorage.HOSP}/${state}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => {
        if (res.status != 200) {
            res.text().then((text) => {
                showMessage(false, text);
                printComputers([], state);
            })
        } else {
            res.json().then((json) => {
                console.log(json);
                printComputers(json, state);
            })
        }
    })
    .catch(error => alert(error))
}

function printComputers(json = [], state) {
    dashboard_screendiv.innerHTML = '';

    const date = new Date().toISOString();
    dashboard_screendiv.innerHTML += `
    <div class="dashDescription">
        <div class="titulo">
            <h2>${'Estado ' + state}</h2>
        </div>
        <span>Última atualização: ${date.slice(0, 10).replace(/\-/g, '/')} ${date.slice(11, 19)}</span>
    </div>
    <div class="dashCards">
        <div class="dashLine" id="div_dashLine">
        </div>
    </div>
    `;

    if (charts.length > 0) {
        charts.forEach(chart => {
            chart.destroy();
        });
        charts.splice(0, charts.length);
    }

    json.forEach(row => {

        row.gbRAM = row.gbRAM == null ? 0 : row.gbRAM;
        row.gbDisco = row.gbDisco == null ? 0 : row.gbDisco;
        row.cpuLeitura = row.cpuLeitura == null ? 0 : row.cpuLeitura;
        row.ramLeitura = row.ramLeitura == null ? 0 : row.ramLeitura;
        row.discoLeitura = row.discoLeitura == null ? 0 : row.discoLeitura;
        row.modeloProcessador = row.modeloProcessador == null ? 'Desconhecido' : row.modeloProcessador;

        div_dashLine.innerHTML += `
        <div class="dashCard">
            <h3>${row.nome}</h3>
            <span>
                Código: ${row.codPatrimonio}
                <br>
                <div class="tecnicalEspecification">
                    <strong>Especificações técnicas:</strong> <br>
                    Modelo do processador:
                    <br>
                    ${row.modeloProcessador}
                    <br>
                    Memória:
                    <br>
                    ${row.gbRAM}GB
                    <br>
                    Armazenamento:
                    <br>
                    ${row.gbDisco}GB
                </div>
            </span>
            <canvas id="canvas_${row.idComputador}" class="charts"></canvas>
        </div>`;

        setTimeout(() => {
            const ctx = document.getElementById(`canvas_${row.idComputador}`).getContext('2d');
            charts.push(new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['CPU', 'Memória', 'Armazenamento'],
                    datasets: [{
                        label: 'Porcentagem de uso',
                        data: [row.cpuLeitura, row.ramLeitura, row.discoLeitura],
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        y: {
                            max: 100,
                            beginAtZero: true
                        }
                    }
                }
            }));
        }, 100);
    });

    if (!timeoutSetted) {
        timeoutSetted = true;
        setTimeout(() => {
            searchByState(state);
            timeoutSetted = false;
        }, 10000);
    }
}
