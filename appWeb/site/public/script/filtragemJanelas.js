function findFiltrosFerramentas(){
    fetch(`/hospital/${sessionStorage.HOSP}/filtrosFerramentas`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res) => {
        if (res.status != 200) {
            res.text().then((text) => {
                showMessage(false, text);
                printTable();
            })
        } else {
            res.json().then(json => printTable(json))
        }
    }).catch((error) => {
        console.log(error);
        showMessage(true, UNEXPECTED_ERROR);
    });
}

function printTable(json = []) {
    console.log(json);

    let content = '';
    json.forEach(row => {
        content += `
        <tr>
            <td style="text-align: center;">${row.nome}</td>
            <td class="deletar" style="text-align: center;" onclick="deleteFiltroFerramenta(${row.idFiltroFerramenta})"><a>DELETAR</a></td>
        </tr>
        `;
    })
    table_body.innerHTML = content;
}

function deleteFiltroFerramenta(idFiltroFerramenta) {
    fetch(`/hospital/filtroFerramenta/${idFiltroFerramenta}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => {
        res.text().then((text) => {
            showMessage(false, text);
            findFiltrosFerramentas();
        });
    })
    .catch((error) => {
        console.log(error);
        showMessage(true, UNEXPECTED_ERROR);
    })
}

function addFilter() {
    // if (!input_nomeJanela.value) {
    //     showMessage(true, BAD_REQUEST);
    //     return;
    // }

    fetch('/hospital/filtroFerramenta', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: input_nomeJanela.value.toUpperCase(),
            fkHospital: sessionStorage.HOSP
        })
    })
    .then((res) => {
        res.text().then((text) => {
            input_nomeJanela.value = '';
            showMessage(res.status !== 200, text);
            findFiltrosFerramentas();
        });
    })
    .catch((error) => {
        console.log(error);
        showMessage(true, UNEXPECTED_ERROR);
    })
    
}

findFiltrosFerramentas();