

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
        showMessage(true,`Erro inesperado`)
    })
}

function preencherTabela(json){
    const tabela = document.getElementById(`table-body`);
    let conteudo = '';
    tabela.innerHTML = "";

    json.forEach(linha => {

        const jsonStringF = JSON.stringify(linha).replace(/\"/g, '\'')
        console.log(JSON.stringify(linha))
        conteudo += `<tr>
        <td>${linha.nome}</td>
        <td>${linha.email}</td>
        <td>${listaCargos.nome}</td>
        <td class="editar" onclick="editar(${jsonStringF})"><a> Editar </a></td>
        <td class="deletar" onclick="abrirPopup(${linha.idFuncionario})"><a> Excluir </a></td>
      </tr>`

    });

    tabela.innerHTML = conteudo;
}

var listaCargos = [
            {
            cargo: 'MEDICO_GERENTE',
            nome: 'Médico gerente'
            },
            {
            cargo:'TECNICO_TI',
            nome: 'Técnico TI'
            },
            {
            cargo:'GESTOR_TI',  
            nome: 'Gestor TI'
            }
        ];
    
function editar(funcionario){

        console.log(funcionario)
    
        popup.style.display = 'block';
        fundotabela.style.display = 'none';
    
        update_input_nome.value = funcionario.nome;
        update_input_email.value = funcionario.email;
        update_select_cargo.value = funcionario.cargo;
    
        
        update_select_cargo.innerHTML = ""
        for (let i = 0; i < listaCargos.length; i++) {
            if(listaCargos[i].cargo == funcionario.cargo){
                update_select_cargo.innerHTML += `<option value="${listaCargos[i].cargo}" selected>${listaCargos[i].nome}</option> `;
            }else{
               update_select_cargo.innerHTML += `<option value="${listaCargos[i].cargo}">${listaCargos[i].nome}</option> `
            }
    
        }
        buttonSalvar.onclick = function(){
            editarFuncionario(funcionario.idFuncionario)
        }
    
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
                showMessage(false,`Usuário adicionado com sucesso!`)
                window.location.href= './config-usuarios.html'
            })
        }
        else if (result.status == 400 || result.status == 500){
            showMessage(true,`Dados inválidos!`)
        }
    })
    .catch((erro) => {
           showMessage(true, `Não foi possível adicionar o usuário.`)
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
            showMessage(false,`Usuário deletado com sucesso!`);
            window.location = "./config-usuarios.html"
        } else if (resposta.status == 404) {
            showMessage(true,"Não foi possível deletar o funcionário.");
            fecharPopup();
        } else {
           showMessage(true, "Erro ao deletar o funcionário. Contate nosso suporte!");
           fecharPopup();
        }
    }).catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });
}

function editarFuncionario(idFuncionario) {

    fetch(`/funcionario/editarFuncionario/${idFuncionario}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            updateNome: update_input_nome.value,
            updateEmail: update_input_email.value,
            updateCargo: update_select_cargo.value
        })

    }).then(function (resposta) {

        if (resposta.status == 200) {
            showMessage(false, "Alterações salvas com sucesso!")
        } else if (resposta.status == 400) {
            showMessage(true,"Dados inválidos!")
        } else {
            showMessage(true,"Não foi possível realizar as alterações. Entre em contato com o nosso suporte.")
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

