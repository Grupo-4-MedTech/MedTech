/* Variáveis das inputs*/
let nome;
let cnpj;
let cep;
let endereco;
let email;
let tel;
let senha;

/* */

let phases = document.getElementsByClassName("phase");
let actualPhase = 0;
let passwordVisibility = true;

function toggleVisibility() {
    if (passwordVisibility) {
        visibilityOn.style.display = "block"
        visibilityOff.style.display = "none"
        passwordVisibility = false;
        senha1.type = "password";
    }
    else {
        visibilityOn.style.display = "none"
        visibilityOff.style.display = "block"
        passwordVisibility = true;
        senha1.type = "text";
    }
}

function prevInput() {
    actualPhase--
    nextInput(actualPhase);
}

function calcNextInput(element, position) {
    //calcula o espaçamento (negativo) necessário para a posição desejada
    element.style.left = `calc(-485px * ${position})`;
}

function nextInput(position) {
    let error = false;
    nome = nomeCompleto.value;
    cnpj = cnpjcpf.value;
    cep = CEP.value;
    endereco = enderecoInpt.value;
    email = emailInpt.value;
    tel = celular.value;

    switch (position) { /* VALIDAÇÃO LÓGICA INPUTS */
        case 1:
            if (nome.length < 3) {
                nomeCompleto.style.border = `2px solid #b8052c`;
                error = true;
            }
            else {
                nomeCompleto.style.border = `2px solid green`;
            }
            break;
        case 2:
            if (cnpj.length == 14 || cnpjcpf.value.length == 11) {
                cnpjcpf.style.border = `2px solid green`;
            }
            else {
                cnpjcpf.style.border = `2px solid #b8052c`;
                error = true;
            }
            break;
        case 3:
            if (cep.length != 11) {
                CEP.style.border = `2px solid #b8052c`;
                error = true;
            } else {
                CEP.style.border = `2px solid green`;
            }
            if (endereco.length < 10) {
                enderecoInpt.style.border = `2px solid #b8052c`;
                error = true;
            } else {
                enderecoInpt.style.border = `2px solid green`;
            }
            break;
        case 4:
            if (email.length < 5 || email.indexOf("@") == -1 || email.indexOf(".") == -1) {
                emailInpt.style.border = `2px solid #b8052c`;
                error = true;
            } else {
                emailInpt.style.border = `2px solid green`;
            }
            if (tel.length != 9 || isNaN(Number(tel))) {
                celular.style.border = `2px solid #b8052c`;
                error = true;
            } else {
                celular.style.border = `2px solid green`;
            }
            break;
    }



    if (!error) {
        // vai fazer requisição do calculo da posição de cada div.phase
        for (let i = 0; i < phases.length; i++) {
            calcNextInput(phases[i], position)
        }

        if (position != 0) { // esconde ou mostra a seta de voltar nas fases de inputs
            arrowBack.style.display = "block";
        } else {
            arrowBack.style.display = "none";
        }
        actualPhase = position;
    }

}


function finishForm() {
    let error = false;
    if (senha1.value.length < 8) {
        senha1.style.border = `2px solid #b8052c`;
        error = true;
    }
    else if (senha1.value != senha2.value) {
        senha1.style.border = `2px solid green`;
        senha2.style.border = `2px solid #b8052c`;
        error = true;
    } else {
        senha1.style.border = `2px solid green`;
        senha2.style.border = `2px solid green`;
        senha = senha1.value;
    }

    if (!error) {
        sessionStorage.setItem("nome", nome);
        sessionStorage.setItem("cnpj", cnpj);
        sessionStorage.setItem("cep", cep);
        sessionStorage.setItem("endereco", endereco);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("tel", tel);
        sessionStorage.setItem("senha", senha);
    }
}