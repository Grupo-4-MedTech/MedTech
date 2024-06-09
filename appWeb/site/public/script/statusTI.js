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
    .catch(error => showMessage(true ,error));
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
            <h3 style="display: flex; flex-direction: row">
                <span style="margin-right: 150px">${row.nome}</span>
                <i style="width: 22px; heigth: 22px; background-color: gray; display: flex; align-items: center; justify-content: center; border: 0px #FFF solid; border-radius: 5px; cursor: pointer">
                    <img onclick="edit(${row.idComputador})" style="height: 20px; width: auto" src="../assets/img/engrenagem.png" alt="configurar métricas">
                </i>
            </h3>
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

function edit(idComputador) {

    fetch(`/computador/${idComputador}/metrica`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => {
        if (res.status != 200) {
            res.text().then((text) => {
                showMessage(false, text);
                fillEditScreen({});
            })
        } else {
            res.json().then((json) => {
                console.log(json);
                fillEditScreen(json[0]);
            })
        }
    })
    .catch(error => showMessage(true ,error));
}

function fillEditScreen(json) {
    
    card_edit.innerHTML = `
    <div class="top">
    <h2>Editar métricas do computador <div onclick="exitEdit()" class="exit_btn">&#66327;<div></h2>
    </div>
    <div class="form_edit">
        <div class="column">
            <span>Alerta para RAM: <input id="alertaRam" type="number" value="${json.alertaRam * 100}" min="1" max="100"> %</span>
            <span>Estado Crítico para RAM: <input id="alertaCritRam" type="number" value="${json.alertaCritRam * 100}" min="1" max="100"> %</span>
            <span>Alerta para Disco: <input id="alertaDisco" type="number" value="${json.alertaDisco * 100}" min="1" max="100"> %</span>
        </div>
        <div class="column">
            <span>Estado Crítico para Disco: <input id="alertaCritDisco" type="number" value="${json.alertaCritDisco * 100}" min="1" max="100"> %</span>
            <span>Alerta para CPU: <input id="alertaCpu" type="number" value="${json.alertaCpu * 100}" min="1" max="100"> %</span>
            <span>Estado Crítico para CPU: <input id="alertaCritCpu" type="number" value="${json.alertaCritCpu * 100}" min="1" max="100"> %</span>
        </div>
    </div>
    <div class="edit_options">
        <button onclick="applyMetrics('/computador/${json.idComputador}/metrica')">Aplicar</button>
        <button onclick="applyMetrics('/hospital/${json.fkHospital}/metricas')">Aplicar Globalmente</button>
    </div>
    `;

    popup_edit.style.width = '100%';
    popup_edit.style.height = '100vh';
    popup_edit.style.zIndex = 20;
    popup_edit.style.opacity = 1;
}

function getFormEditValues() {

    const alertaRamVar = alertaRam.value > 100 ? 100 : alertaRam.value < 1 ? 1 : alertaRam.value;
    const alertaCritRamVar = alertaCritRam.value > 100 ? 100 : alertaCritRam.value < 1 ? 1 : alertaCritRam.value;
    const alertaDiscoVar = alertaDisco.value > 100 ? 100 : alertaDisco.value < 1 ? 1 : alertaDisco.value;
    const alertaCritDiscoVar = alertaCritDisco.value > 100 ? 100 : alertaCritDisco.value < 1 ? 1 : alertaCritDisco.value;
    const alertaCpuVar = alertaCpu.value > 100 ? 100 : alertaCpu.value < 1 ? 1 : alertaCpu.value;
    const alertaCritCpuVar = alertaCritCpu.value > 100 ? 100 : alertaCritCpu.value < 1 ? 1 : alertaCritCpu.value;

    return {
        alertaRam: alertaRamVar / 100,
        alertaCritRam: alertaCritRamVar / 100,
        alertaDisco: alertaDiscoVar / 100,
        alertaCritDisco: alertaCritDiscoVar / 100,
        alertaCpu: alertaCpuVar / 100,
        alertaCritCpu: alertaCritCpuVar / 100
    };
}

function applyMetrics(route) {
    fetch(route, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            getFormEditValues()
        )
    })
    .then((res) => {
        res.text().then((text) => {
            if (res.status === 200) {
                showMessage(false, text);
                exitEdit();
            } else {
                showMessage(true, text);
            }
        })
    })
    .catch((error) => {
        console.log(error);
        showMessage(true , 'Houve um erro inesperado! por favor, entre em contato com o nosso suporte.')
    });
}

function exitEdit() {
    card_edit.innerHTML = '';

    popup_edit.style.width = '0px';
    popup_edit.style.height = '0px';
    popup_edit.style.zIndex = 0;
    popup_edit.style.opacity = 0;
}