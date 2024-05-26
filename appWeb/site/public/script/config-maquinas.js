function buscarComputadores() {
    fetch(`/computador/buscarPCs/${sessionStorage.HOSP}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((result) => {
            if (result.status == 200) {
                result.json().then(function (json) {
                    preencherTabelaPC(json)
                })
            }
            else {
                result.text().then(function (text) {
                    alert(text)
                })
            }
        })
        .catch((error) => {
            alert(`Erro inesperado`)
        })
}

function preencherTabelaPC(json) {
    const table = document.getElementById(`table-body-maquina`);
    let content = '';
    table.innerHTML = "";

    json.forEach(row => {
        content += `<tr>
        <td>${row.nome}</td>
        <td>${row.codPatrimonio}</td>
        <td>${row.fkDepartamento}</td>
        <td>${row.senha}</td>
        <td class="editar" onclick="editar()"> <a>Editar </a></td>
      </tr>`

    });

    table.innerHTML = content;

}

function editar() {
    popup.style.display = 'block';
    fundotabela.style.display = 'none';
}

function btnNovoComputador() {
    PCpopup.style.display = 'block';
    fundotabela.style.display = 'none';
}
function novoComputador() {

    let nome = input_nome.value
    let codPatrimonio = input_codPatrimonio.value
    let departamento = listaDepartamentos.value
    let senha = input_senha.value


    fetch(`/computador/adicionarPC`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome,
            codPatrimonio,
            departamento,
            senha,
            fkHospital: sessionStorage.HOSP
        }),
    }).then((result) => {
        if (result.status == 200) {
            result.json().then(function (json) {
                alert(`maquina cadastrada!`)
                window.location.href= '../config-maquinas.html'
            })
        } else {
            alert(`Não deu`)

        }
    })
}


function listar() {
    fetch(`/hospital/listar`, {
        method: "GET",
    })

        .then(function (resposta) {
            resposta.json().then((departamentos) => {
                departamentos.forEach((departamento) => {
                    listaDepartamentos.innerHTML += `<option value='${departamento.idDepartamento}'>${departamento.nome}</option>`;
                });
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function deletarPC(idComputador){
    fetch(`/computador/deletar/${idComputador}`, {
        method: 'DELETE',
    })
}

buscarComputadores()
listar()
