

function buscarUsuarios() {
    fetch(`/funcionario/buscar/${sessionStorage.HOSP}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then((result) => {
            if (result.status == 200) {
                result.json().then(function (json) {
                    preencherTabela(json)
                });
            } else {
                result.text().then((text) => {
                    showMessage(result.status === 500, text);
                });
            }
        })
        .catch(() => {
            showMessage(true, UNEXPECTED_ERROR);
        })
}

function preencherTabela(json) {
    const tabela = document.getElementById(`table-body`);
    let conteudo = '';
    tabela.innerHTML = "";

    json.forEach(linha => {

        const jsonStringF = JSON.stringify(linha).replace(/\"/g, '\'')
        console.log(JSON.stringify(linha))
        conteudo += `<tr>
        <td>${linha.nome}</td>
        <td>${linha.email}</td>
        <td>${linha.cargo}</td>
        <td class="editar" onclick="editar(${jsonStringF})"><a> Editar </a></td>
        <td class="deletar" onclick="abrirPopup(${linha.idFuncionario})"><a> Excluir </a></td>
      </tr>`

    });

    tabela.innerHTML = conteudo;
}


function editar(funcionario) {

    var listaCargos = [
        {
            cargo: 'MEDICO_GERENTE',
            nome: 'Médico gerente'
        },
        {
            cargo: 'TECNICO_TI',
            nome: 'Técnico TI'
        },
        {
            cargo: 'GESTOR_TI',
            nome: 'Gestor TI'
        }
    ];


    console.log(funcionario)

    popup.style.display = 'block';
    fundotabela.style.display = 'none';

    update_input_nome.value = funcionario.nome;
    update_input_email.value = funcionario.email;
    update_select_cargo.value = funcionario.cargo;
    update_input_cpf.value = funcionario.cpf;
    update_input_telefone.value = funcionario.telefone;

    update_select_cargo.innerHTML = ""
    for (let i = 0; i < listaCargos.length; i++) {
        if (listaCargos[i].cargo == funcionario.cargo) {
            update_select_cargo.innerHTML += `<option value="${listaCargos[i].cargo}" selected>${listaCargos[i].nome}</option> `;
        } else {
            update_select_cargo.innerHTML += `<option value="${listaCargos[i].cargo}">${listaCargos[i].nome}</option> `
        }

    }
    buttonSalvar.onclick = function () {
        editarFuncionario(funcionario.idFuncionario)
    }

    fundotabela.style.display = 'none';
    popup.style.display = 'block';
    createChkBoxes('chkboxEdit');
}

function createChkBoxes(element) {
    fetch(`/hospital/listar/${sessionStorage.HOSP}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => {
            if (res.status != 200) {
                res.text().then((text) => {
                    showMessage(false, text);
                    printChkBoxes([], element);
                })
            } else {
                res.json().then((json) => {
                    printChkBoxes(json, element);
                })
            }
        })
        .catch(error => showMessage(true , UNEXPECTED_ERROR));
}


function printChkBoxes(json, element) {
    let content = '';
    json.forEach(x => {
        content += `<span><input type="checkbox" name="${element}_chkBox" value="${x.idDepartamento}">${x.nome}</span>`;
    });
    document.getElementById(element).innerHTML = content;
}

function getChkBoxes(element){
    const chkBoxes = Array.from(document.getElementsByName(`${element}_chkBox`));
    return chkBoxes.map((x) => {
        if (x.checked) {
            return Number(x.value);
        }
    }).filter(x => x !== undefined);

}

function btnNovoFuncionario() {
    createChkBoxes('chkboxCreate');
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

function reload() {
    popupFuncionario.style.display = 'none';
    popup.style.display = 'none';
    fundotabela.style.display = 'flex';
    buscarUsuarios();
}


function voltar() {
    window.location = "./geralTI.html";
}

function novoFuncionario() {

    const deps = getChkBoxes('chkboxCreate');
    if (deps.length < 1) {
        showMessage(true, 'Selecione ao menos um departamento!');
        return;
    }

    let nome = input_nome_funcionario.value
    let email = input_email.value
    let cargo = select_cargo.value

    fetch(`/funcionario/adicionarUsuario`, {
        method: "POST",
        body: JSON.stringify({
            nome,
            email,
            cargo,
            deps,
            senha: tokenGenerator(),
            telefone: input_telefone.value,
            cpf: input_cpf.value,
            fkHospital: sessionStorage.HOSP
        }),
        headers: {
            "Content-Type": "application/json",
        },

    }).then((result) => {
        result.text().then((text) => {
            showMessage(result.status !== 200, text);
            if (result.status === 200) {
                setTimeout(() => {
                    reload();
                }, 1500);
            }
        });
    })
        .catch(() => {
            showMessage(true, UNEXPECTED_ERROR)
        }
        );
}

function deletarFuncionario(idFuncionario) {
    fetch(`/funcionario/deletar/${idFuncionario}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    }).then((result) => {
        result.text().then((text) => {
            showMessage(result.status !== 200, text);
            setTimeout(() => {
                fecharPopup();
                reload();
            }, 1500);
        });
    }).catch((resultado) => {
        console.log(`#ERRO: ${resultado}`);
    });
}

function editarFuncionario(idFuncionario) {

    const deps = getChkBoxes('chkboxEdit');
    if (deps.length < 1) {
        showMessage(true, 'Selecione ao menos um departamento!');
        return;
    }

    fetch(`/funcionario/editarFuncionario/${idFuncionario}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            updateNome: update_input_nome.value,
            updateEmail: update_input_email.value,
            updateCargo: update_select_cargo.value,
            deps: deps,
            senha: tokenGenerator(),
            telefone: update_input_telefone.value,
            cpf: update_input_cpf.value
        })

    }).then((result) => {
        result.text().then((text) => {
            showMessage(result.status !== 200, text);
            setTimeout(() => {
                fecharPopup();
                reload();
            }, 1500);
        });
    })
        .catch(() => {
            showMessage(true, UNEXPECTED_ERROR)
        }
        );
}

function abrirPopup(idFuncionario) {
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
function fecharPopup() {
    const popup = document.getElementById('popupDelecao');
    popup.style.display = 'none';
}

buscarUsuarios()

