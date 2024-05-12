const ufs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const img_config = document.getElementById('img_config');

document.addEventListener('click', function(event) {
    if (!img_config.contains(event.target)) {
        showOptions(false);
    } else {
        showOptions(true);
    }
})

const select_ufs = document.getElementById('select_uf');
ufs.forEach(uf => {
    select_ufs.innerHTML += `<option value="${uf}">${uf}</option>`;
});

function printUserInfos() {
    div_config.innerHTML = `<span class="info"><b>${sessionStorage.NOME_USR}</b></span>
    <br>
    <br>
    <span class="info"><b>E-mail:</b> ${sessionStorage.EMAIL_USR}</span>
    <br>
    <br>
    <hr>
    <br>
    <div class="buttons">
        <button class="btn">Adicionar usuário</button>
        <button class="btn">Sair</button>
    </div>`
}

function buscarHospitais(
    nome = document.getElementById('input_search').value,
    dtCriacao = document.getElementById('select_dtCriacao').value,
    uf = document.getElementById('select_uf').value,
    verificado = document.getElementById('select_verificado').value
) {

    if (nome === '') {
        nome = null;
    }

    dtCriacao = dateToQueryCondition(dtCriacao);
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

function printResult(json = []) {
    const card = document.getElementById('mainCard');
    card.innerHTML = '';

    if (Object.keys(json).length < 1) {
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
                <span><b>E-mail:</b> ${row.email}</span>
                <br>
                <span><b>Data de criação:</b> ${row.dtCriacao.slice(0, 10).replace(/-/g, '/')}</span>
            </div>
            <div class="rectangle1" style="border-left: none; background-color: #696969;">
                <span><b>CEP:</b> ${row.cep}</span>
                <br>
                <span><b>Endereço:</b> ${row.rua + ', ' + row.numero + ', ' + row.complemento}</span>
                <br>                              
                <span><b>UF:</b> ${row.uf}</span>
            </div>
            <div class="rectangle2">`

        if (!row.verificado) {
            content += `<button class="btn" style="width: 40%; height: 50%" onclick="activateHospital(${row.idHospital}, 1)">ATIVAR</button>`
        } else {
            content += `<button class="btn" style="width: 40%; height: 50%" onclick="activateHospital(${row.idHospital}, 0)">DESATIVAR</button>`
        }

        content += `<button class="btn" style="width: 40%; height: 50%" onclick="deleteHospital(${row.idHospital})">DELETAR</button>
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

function dateToQueryCondition(dtCriacao) {
    const date = new Date();
    if (dtCriacao == 0) {
        return `dtCriacao = '${date.toISOString().slice(0, 10)}'`;
    }

    if (dtCriacao == 2) {
        return `MONTH(dtCriacao) = ${date.getMonth() + 1} AND YEAR(dtCriacao) = ${date.toISOString().slice(0, 4)}`;
    }

    if (dtCriacao == 1) {
        const day = Number(date.toISOString().slice(8, 10));
        return `DAY(dtCriacao) IN (${day}, ${day - 1}, ${day - 2}, ${day - 3}, ${day - 4}, ${day - 5}, ${day - 6}) AND MONTH(dtCriacao) = ${date.getMonth() + 1} AND YEAR(dtCriacao) = ${date.toISOString().slice(0, 4)}`
    }

    return null;
}

function showOptions(show){
    const attributes = img_config.getBoundingClientRect();
    console.log(attributes);

    if (show) {
        div_config.style.top = attributes.y + 30 + 'px';
        div_config.style.width = '380px';
        div_config.style.left = (attributes.x - div_config.getBoundingClientRect().width + 110) + 'px';
        div_config.style.height = '178px';
        div_config.style.padding = 20 + 'px';
        div_config.style.opacity = 1;
    } else {
        div_config.style.left = 0 + 'px';
        div_config.style.top = 0 + 'px';
        div_config.style.width = 0 + 'px';
        div_config.style.height = 0 + 'px';
        div_config.style.padding = 0 + 'px';
        div_config.style.opacity = 0;
    }
}

function chkLogin() {
}

printUserInfos();
buscarHospitais();