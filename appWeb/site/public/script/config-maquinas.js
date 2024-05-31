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
                    // alert(text)
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
    
    console.log(json);
    
    json.forEach(row => {
        content += `<tr>
        <td>${row.nome}</td>
        <td>${row.codPatrimonio}</td>
        <td>${row.fkDepartamento}</td>
        <td>${row.senha}</td>
        <td class="editar" onclick="editar()"><a>Editar </a></td>
        <td class="deletar" onclick="abrirPopup(${row.idComputador})"><a> Excluir </a></td>
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

function voltar() {
    window.location = "/geralTI.html";
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
        headers:{
            "Content-Type":"application/json"
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

function editarPC(){
    let updateNome = update_input_nome.value
    let updateCodPatrimonio = update_input_codPatrimonio.value
    let updateDepartamento = listaDepartamentos.value
    let updateSenha = update_input_senha.value
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
