const ufs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const select_ufs = document.getElementById('select_uf');
ufs.forEach(uf => {
    select_ufs.innerHTML += `<option value="${uf}">${uf}</option>`;
});

function buscarHospitais(
    nome = document.getElementById('input_search').value,
    dtCriacao = document.getElementById('select_dtCriacao').value,
    uf = document.getElementById('select_uf').value,
    verificado = document.getElementById('select_verificado').value
) {

    if (nome === '') {
        nome = null;
    }

    const date = new Date();
    dtCriacao = (dtCriacao === 0 ? `DAY(dtCriacao) = ${date.getDay}` :
        dtCriacao == 1 ? `DAY(dtCriacao) IN (${date.getDay}, ${date.getDay - 1}, ${date.getDay - 2}, ${date.getDay - 3}, ${date.getDay - 4}, ${date.getDay - 5}, ${date.getDay - 6}) ` :
            dtCriacao == 2 ? `MONTH(dtCriacao) = ${date.getMonth() + 1}` :
                null);
    fetch(`/hospital/buscar/${nome}/${dtCriacao}/${uf}/${verificado}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then((res) => {
        if (res.status != 201) {
            res.text().then((text) => {
                let error = false;
                if (res.status == 500) {
                    error = true;
                }
                showMessage(error, text);
            });
        } else {
            return res.json()
        }
    }).then((json) => {
        if (json && json.length > 0) {
            printResult(json);
        } else {
            printResult([]);
        }
    }).catch((error) => {
        console.log(error);
        showMessage(true, 'Erro inesperado! por favor, tente novamente mais tarde.');
    });
}

buscarHospitais();

function printResult(json = []) {
    const card = document.getElementById('mainCard');
    card.innerHTML = '';

    if (Object.keys(json).length < 1){
       return;
    }

    let content = '';
    json.forEach(row => {
        content += `
        <div class="profileCard">
            <div class="rectangle1">
                <span><b>Nome fantasia:</b> ${row.nomeFantasia}</span>
                <br>
                <span><b>Razão social:</b> ${row.razaoSocial}</span>
                <br>                              
                <span><b>CNPJ:</b> ${row.cnpj}</span>
                <br>
                <span><b>Email:</b> ${row.email}</span>
            </div>
            <div class="rectangle1" style="border-left: none; background-color: #fff;">
                <span><b>CEP:</b> ${row.cep}</span>
                <br>
                <span><b>Endereço:</b> ${row.rua, ', ', row.numero, ', ', row.complemento}</span>
                <br>                              
                <span><b>UF:</b> ${row.uf}</span>
            </div>
            <div class="rectangle2">`

        if (!row.verificado) {
            content += `<button onclick="activateHospital(${row.idHospital}, 1)">ATIVAR</button>`
        } else {
            content += `<button onclick="activateHospital(${row.idHospital}, 0)">DESATIVAR</button>`
        }

        content += `<button onclick="deleteHospital(${row.idHospital})">DELETAR</button>
            </div>
        </div>`;
    });
    card.innerHTML = content;
}

function deleteHospital(id) {
    fetch(`hospital/deletar/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    }).then((res) => {
        res.text().then((text) => {
            let error = false
            if (res.status !== 200) {
                error = true;
            } else {
                const buttons = document.querySelectorAll('[onclick]');
                buttons.forEach(button => {
                    if (button.getAttribute('onclick') == `deleteHospital(${id})`) {
                        button.parentNode.parentNode.remove();
                    }
                })
            }
            showMessage(error, text);
        })
    }).catch((error) => {
        console.log(error);
        showMessage(true, 'Erro inesperado! por favor, tente novamente mais tarde.');
    })
}

function activateHospital(id, ativo) {
    fetch(`hospital/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            verificado: ativo
        })
    }).then((res) => {
        res.text().then((text) => {
            let error = false
            if (res.status !== 200) {
                error = true;
            } else {
               buscarHospitais();
            }
            showMessage(error, text);
        })
    }).catch((error) => {
        console.log(error);
        showMessage(true, 'Erro inesperado! por favor, tente novamente mais tarde.');
    })
}