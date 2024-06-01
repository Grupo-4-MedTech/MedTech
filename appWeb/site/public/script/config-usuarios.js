function buscarUsuarios(){
    fetch(`/funcionario/buscar/${sessionStorage.HOSP}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((result) => {
        if(result.status == 200){
            result.json().then(function(json){
                preencherTabela(json)
            })
        }
        else{
            result.text().then(function(text){
                // alert(text)
            })
        }
    })
    .catch((error) => {
        alert(`Erro inesperado`)
    })
}

function preencherTabela(json){
    const tabela = document.getElementById(`table-body`);
    let conteudo = '';
    tabela.innerHTML = "";

    json.forEach(linha => {
        conteudo += `<tr>
        <td>${linha.nome}</td>
        <td>${linha.email}</td>
        <td>${linha.cargo}</td>
        <td class="editar" onclick="editar(${linha.idFuncionario})"><a> Editar </a></td>
        <td class="deletar" onclick="abrirPopup(${linha.idFuncionario})"><a> Excluir </a></td>
      </tr>`

    });

    tabela.innerHTML = conteudo;

}

function editar(){
    fundotabela.style.display = 'none';
    popup.style.display = 'block';
}

function btnNovoFuncionario() {
    popupFuncionario.style.display = 'block';
    fundotabela.style.display = 'none';
    document.getElementById('btn-voltar').onclick = function () {
        popupFuncionario.style.display = 'none';
        fundotabela.style.display = 'flex';
        document.getElementById('btn-voltar').onclick = function () {
            voltar();
        }
    }
}


function voltar() {
    window.location = "./geralTI.html";
}

function novoFuncionario() {

    let nome = input_nome_funcionario.value
    let email = input_email.value
    let cargo = select_cargo.value

    fetch(`/funcionario/adicionarUsuario`, {
        method: "POST",
        body: JSON.stringify({
            nome,
            email,
            cargo,
            fkHospital: sessionStorage.HOSP
        }),
        headers: {
            "Content-Type": "application/json",
        },
        
    }).then((result) => {
        if (result.status == 200) {
            result.text()
            .then(
                function (text) {
                message.innerHTML = `Usuário adicionado com sucesso!`
                window.location.href= './config-usuarios.html'
            })
        }
        else if (result.status == 400 || result.status == 500){
            message.innerHTML += `Dados inválidos!`
        }
    })
    .catch((erro) => {
            message.innerHTML = `Não foi possível adicionar o usuário.`
        }
    )
}

function deletarFuncionario(idFuncionario){
    fetch(`/funcionario/deletar/${idFuncionario}`, {
        method: 'DELETE',
        headers:{
            "Content-Type":"application/json"
        }
    }).then(function (resposta) {
        if (resposta.status == 200) {
            alert(`Usuário deletado com sucesso!`);
            window.location = "./config-usuarios.html"
        } else if (resposta.status == 404) {
            alert("Não foi possível deletar o funcionário.");
            fecharPopup();
        } else {
           alert("Erro ao deletar o funcionário. Contate nosso suporte!");
           fecharPopup();
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}
function abrirPopup(idFuncionario){
    const popup = document.getElementById('popupDelecao');
    popup.style.display = 'flex';
    popup.innerHTML = `<div class="popupDelecao">
    <h1>
      Deseja mesmo deletar?
    </h1>
    <div class="botoesDelecao">
      <button class="botaoExclusao" onclick="deletarFuncionario(${idFuncionario})">Excluir</button>
      <button class="botaoCancelar" onclick="fecharPopup()">Cancelar</button>
    </div>
  </div>` 
}
function fecharPopup(){
    const popup = document.getElementById('popupDelecao');
    popup.style.display = 'none';
}

buscarUsuarios()

