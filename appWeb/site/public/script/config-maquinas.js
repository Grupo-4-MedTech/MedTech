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
            console.log(error)
        })

}

function preencherTabelaPC(json) {
    const table = document.getElementById(`table-body-maquina`);
    let content = '';
    table.innerHTML = "";

    console.log(json);

    json.forEach(row => {

        const jsonString = JSON.stringify(row).replace(/\"/g, '\'')

        console.log(JSON.stringify(row))
        content += `<tr>
        <td>${row.nome}</td>
        <td>${row.codPatrimonio}</td>
        <td>${row.fkDepartamento}</td>
        <td>${row.senha}</td>
        <td class="editar" onclick="editar(${jsonString})"><a>Editar </a></td>
        <td class="deletar" onclick="abrirPopup(${row.idComputador})"><a> Excluir </a></td>
      </tr>`

    });

    table.innerHTML = content;

}

function editar(computador) {
    console.log(computador)

    popup.style.display = 'block';
    fundotabela.style.display = 'none';

    update_input_nome.value = computador.nome;
    update_input_codPatrimonio.value = computador.codPatrimonio;
    update_listaDepartamentos.value = computador.departamento;
    update_input_senha.value = computador.senha;

    console.log(listaDeDepartamentos)

    update_listaDepartamentos.innerHTML = ""
    for (let i = 0; i < listaDeDepartamentos.length; i++) {
        if(listaDeDepartamentos[i].idDepartamento == computador.fkDepartamento){
            update_listaDepartamentos.innerHTML += `<option value="${listaDeDepartamentos[i].idDepartamento}" selected>${listaDeDepartamentos[i].nome}</option> `;
        }else{
           update_listaDepartamentos.innerHTML += `<option value="${listaDeDepartamentos[i].idDepartamento}">${listaDeDepartamentos[i].nome}</option> `
        }

    }
    buttonSalvar.onclick = function(){
        editarPC(computador.idComputador)
    }
}

function btnNovoComputador() {
    PCpopup.style.display = 'block';
    fundotabela.style.display = 'none';
    document.getElementById('btn-voltar').onclick = function () {
        PCpopup.style.display = 'none';
        fundotabela.style.display = 'flex';
        document.getElementById('btn-voltar').onclick = function () {
            voltar();
        }
    }
}

function voltar() {
    window.location = "./geralTI.html";
}
function novoComputador() {

    let nome = input_nome.value
    let codPatrimonio = input_codPatrimonio.value
    let departamento = listaDepartamentos.value
    let senha = input_senha.value

    fetch(`/computador/adicionarPC`, {
        method: "POST",
        body: JSON.stringify({
            nome,
            codPatrimonio,
            departamento,
            senha,
            fkHospital: sessionStorage.HOSP
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((result) => {
        if (result.status == 200) {
            showMessage(true,`Máquina cadastrada!`)

            result.json().then(function (json) {
                
                window.location.href = '../config-maquinas.html'
            })

        } else {
            showMessage(true,`Não foi possível cadastrar a máquina`)

        }
    })
}


function listar() {
    fetch(`/hospital/listar/${sessionStorage.HOSP}`, {
        method: "GET",
    })


        .then(function (resposta) {
            resposta.json().then((departamentos) => {
                departamentos.forEach((departamento) => {
                    listaDepartamentos.innerHTML += `<option value='${departamento.idDepartamento}'>${departamento.nome}</option>`;
                });
                listaDeDepartamentos = departamentos
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function deletarPC(idComputador) {
    fetch(`/computador/deletar/${idComputador}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {
        if (resposta.status = 200) {
            alert(`Máquina deletada com sucesso!`)
            window.location = "./config-maquinas.html"
        } else if (resposta.status == 404) {
            alert("Não foi possível deletar a máquina.");
        } else {
            alert("Erro ao deletar a máquina. Contate nosso suporte!");
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}


function editarPC(idComputador) {

    fetch(`/computador/editarPC/${idComputador}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            updateNome: update_input_nome.value,
            updateCodPatrimonio: update_input_codPatrimonio.value,
            updateDepartamento: update_listaDepartamentos.value,
            updateSenha: update_input_senha.value
        })

    }).then(function (resposta) {

        if (resposta.status == 200) {
            message.innerHTML += "Alterações salvas com sucesso!"
        } else if (resposta.status == 400) {
            message.innerHTML += "Dados inválidos!"
        } else {
            message.innerHTML += "Não foi possível realizar as alterações. Entre em contato com o nosso suporte."
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}



function abrirPopup(idComputador){
    const popup = document.getElementById('popupDelecao');
    popup.style.display = 'flex';
    popup.innerHTML = `<div class="popupDelecao">
    <h1>
      Deseja mesmo deletar?
    </h1>
    <div class="botoesDelecao">
      <button class="botaoExclusao" onclick="deletarPC(${idComputador})">Excluir</button>
      <button class="botaoCancelar" onclick="fecharPopup()">Cancelar</button>
    </div>
  </div>`
}
function fecharPopup(){
    const popup = document.getElementById('popupDelecao');
    popup.style.display = 'none';
}

buscarComputadores()
listar()
