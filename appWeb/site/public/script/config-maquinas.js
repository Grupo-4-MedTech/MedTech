function buscarComputadores(){
    fetch(`/computador/buscarPCs/${sessionStorage.HOSP}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((result) => {
        if(result.status == 200){
            result.json().then(function(json){
                preencherTabelaPC(json)
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

function preencherTabelaPC(json){
    const table = document.getElementById(`table-body-maquina`);
    let content= '';
    table.innerHTML = "";

    json.forEach(row => {
        content += `<tr>
        <td>${row.nome}</td>
        <td>${row.codPatrimonio}</td>
        <td>${row.fkDepartamento}</td>
        <td class="editar" onclick="editar(${row.idComputador})"> <a>Editar </a></td>
      </tr>`

    });

    table.innerHTML = content;

}

function editar(idComputador){
    alert(idComputador)
}

buscarComputadores()

