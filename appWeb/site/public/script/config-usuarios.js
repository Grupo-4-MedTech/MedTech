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
                alert(text)
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
        <td class="editar" onclick="editar(${linha.idFuncionario})"> <a>Editar </a></td>
      </tr>`

    });

    tabela.innerHTML = conteudo;

}

function editar(idFuncionario){
    alert(idFuncionario)
}

buscarUsuarios()

