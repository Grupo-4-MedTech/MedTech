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

function voltar() {
    window.location = document.referrer;
}
buscarComputadores()

// function novoComputador() {
//     fetch("/computador/adicionarPC", {
//         method: "POST",
//             headers: {
//             "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 nome,
//                 codPatrimonio,
//                 departamento,
//                 senha
//             }),
//         }).then((result) => {
//             if (result.status == 201) {
//                 showMessage(false, 'Cadastro realizado com sucesso! Nossa equipe entrará em contato pelo e-mail cadastrado!');

//                 setTimeout(() => {
//                     window.location.href = 'index.html';
//                 }, 5000)
//             } else {
//                 result.text().then(text => {
//                     showMessage(true, text)
//                 })
//             }
//         }).catch((error) => {
//             console.log(error);
//             showMessage(true, 'Erro inesperado! por favor, tente novamente mais tarde.');
//         })
//     }

//nao finalizado ^