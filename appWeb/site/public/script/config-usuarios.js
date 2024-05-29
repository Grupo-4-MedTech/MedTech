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
        <td class="deletar" onclick=""><a> Excluir </a></td>
      </tr>`

    });

    tabela.innerHTML = conteudo;

}

function editar(){
    popup.style.display = 'none';
    backgrounddiv.style.display = 'block';
}

function btnNovoFuncionario() {
    popupFuncionario.style.display = 'block';
    fundotabela.style.display = 'none';
}


function voltar() {
    window.location = document.referrer;
}

function novoFuncionario() {

    let nome = input_nome_funcionario.value
    let email = input_email.value
    let cargo = select_cargo.value

    fetch(`/funcionario/adicionarUsuario`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome,
            email,
            cargo,
            fkHospital: sessionStorage.HOSP
        }),
    }).then((result) => {
        if (result.status == 200) {
            result.json()
            .then(
                function (json) {
                resposta.innerHTML = `Usuário adicionado com sucesso!`
                window.location.href= './config-usuarios.html'
            })
        }
        else if (result.status == 400){
            resposta.innerHTML += `Dados inválidos!`
        }
    })
    .catch((erro) => {
            resposta.innerHTML = `Não foi possível adicionar o usuário.`
        }
    )
}

buscarUsuarios()

