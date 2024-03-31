/* Variáveis das inputs*/
let razaoSocial;
let nomeFantasia;
let cnpj;
let cep;
let rua;
let numero;
let complemento;
let uf;
let email;
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
        input_senha.type = "password";
    }
    else {
        visibilityOn.style.display = "none"
        visibilityOff.style.display = "block"
        passwordVisibility = true;
        input_senha.type = "text";
    }
}

function prevInput() {
    actualPhase--
    nextInput(actualPhase);
}

function calcNextInput(element, position) {
    //calcula o espaçamento (negativo) necessário para a posição desejada
    element.style.left = `calc(-485px * ${position})`;
    // phases[position].style.opacity = 1;
    // phases[position].style.position = 'absolute';
}

function nextInput(position) {

    let error = false;
    razaoSocial = input_razaoSocial.value;
    cnpj = input_cnpj.value;
    cep = input_CEP.value;
    nomeFantasia = input_nomeFantasia.value;
    rua = input_rua.value;
    numero = input_numero.value;
    complemento = input_complemento.value;
    uf = input_uf.value;
    email = input_email.value;
    senha = input_senha.value;

    switch (position) { /* VALIDAÇÃO LÓGICA INPUTS */
        case 1:
            if (razaoSocial.length < 3) {
                // razaoSocial.style.border = `2px solid #b8052c`;
                error = true;
            }
            else {
                // razaoSocial.style.border = `2px solid green`;
            }
            break;
        case 2:
            if (cnpj.length == 11) {
                // cnpjcpf.style.border = `2px solid green`;
            }
            else {
                // cnpjcpf.style.border = `2px solid #b8052c`;
                error = true;
            }
            break;
        case 3:
            if (cep.length != 8) {
                // input_CEP.style.border = `2px solid #b8052c`;
                error = true;
            } else {
                // input_CEP.style.border = `2px solid green`;
            }

            break;
        case 4:
            if (email.length < 5 || email.indexOf("@") == -1 || email.indexOf(".") == -1) {
                // emailInpt.style.border = `2px solid #b8052c`;
                error = true;
            } else {
                // emailInpt.style.border = `2px solid green`;
            }
            // if (tel.length != 9 || isNaN(Number(tel))) {
            //     celular.style.border = `2px solid #b8052c`;
            //     error = true;
            // } else {
            //     celular.style.border = `2px solid green`;
            // }
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
    if (input_senha.value.length < 8) {
        input_senha.style.border = `2px solid #b8052c`;
        error = true;
    }
    else if (input_senha.value != senha2.value) {
        input_senha.style.border = `2px solid green`;
        senha2.style.border = `2px solid #b8052c`;
        error = true;
    } else {
        input_senha.style.border = `2px solid green`;
        senha2.style.border = `2px solid green`;
        senha = input_senha.value;
    }

    // if (!error) {
    //     sessionStorage.setItem("nome", nome);
    //     sessionStorage.setItem("cnpj", cnpj);
    //     sessionStorage.setItem("cep", cep);
    //     sessionStorage.setItem("endereco", endereco);
    //     sessionStorage.setItem("email", email);
    //     sessionStorage.setItem("tel", tel);
    //     sessionStorage.setItem("senha", senha);
    // }

    fetch("/hospital/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            razaoSocial,
            nomeFantasia,
            cnpj,
            cep,
            rua,
            numero,
            complemento,
            uf,
            email,
            senha
        }),
    }).then((result)=>{
        if(result.status == 201){
            console.log('cadastrado com sucesso');
            window.location.href = 'login.html';
        }
    }).catch((error)=>{
        console.log(error.message);
    })

    
}

