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
}

function nextInput(position) {

    let error    = false;
    razaoSocial  = input_razaoSocial.value;
    cnpj         = input_cnpj.value;
    cep          = input_CEP.value;
    nomeFantasia = input_nomeFantasia.value;
    rua          = input_rua.value;
    numero       = input_numero.value;
    complemento  = input_complemento.value;
    uf           = input_uf.value;
    email        = input_email.value;
    senha        = input_senha.value;

    switch (position) { /* VALIDAÇÃO LÓGICA INPUTS */
        case 1:
            if (!/^[A-Za-z\s]{6,25}$/.test(razaoSocial)) {
                error = true;
                inputColor(document.getElementById('input_razaoSocial'), error);
                return;
            }
            inputColor(document.getElementById('input_razaoSocial'), error);
            break;
        case 2:
            if (!/^[a-zA-Z\s]{6,25}$/.test(nomeFantasia)) {
                error = true;
                inputColor(document.getElementById('input_nomeFantasia'), error);
                return;
            }
            inputColor(document.getElementById('input_nomeFantasia'), error);

            if (!/^[0-9]{14}$/.test(cnpj)) {
                error = true;
                inputColor(document.getElementById('input_cnpj'), error);
                return;
            }
                inputColor(document.getElementById('input_cnpj'), error);
            break;
        case 3:
            if (!/^[0-9]{8}$/.test(cep)) {
                error = true;
                inputColor(document.getElementById('input_CEP'), error);
                return;
            }
            inputColor(document.getElementById('input_CEP'), error);

            if (!/^[a-zA-Z\s]{10,25}$/.test(rua)) {
                error = true;
                inputColor(document.getElementById('input_rua'), error);
                return;
            }
            inputColor(document.getElementById('input_rua'), error);


            if (!/^[1-9][0-9]{1,}$/.test(numero)) {
                error = true;
                inputColor(document.getElementById('input_numero'), error);
                return;
            }
            inputColor(document.getElementById('input_numero'), error);

            if (!/^[a-zA-Z]{2}$/.test(uf)) {
                error = true;
                inputColor(document.getElementById('input_uf'), error);
                return;
            }
            inputColor(document.getElementById('input_uf'), error);

            if (!/^[a-zA-Z0-9\s]{0,255}$/.test(complemento)) {
                error = true;
                inputColor(document.getElementById('input_complemento'), error);
                return
            }
            inputColor(document.getElementById('input_complemento'), error);

            break;
        case 4:
            if (!/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email)) {
                error = true; 
                inputColor(document.getElementById('input_email'), error);
                return;
            }
            inputColor(document.getElementById('input_email'), error);
            break;
    }

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


function finishForm() {
    let error = false;
    senha = input_senha.value;
    if (!/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha)) {
        error = true;
    }
    else if (senha != senha2.value) {
        error = true;
    }
    inputColor(document.getElementById('input_senha'), error);
    inputColor(document.getElementById('senha2'), error);

    if (!error) {
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
        }).then((result) => {
            if (result.status == 201) {
                console.log('Cadastrado com sucesso');
                window.location.href = 'login.html';
            } else if(result.status == 401){
                console.log('Dados inválidos');
            }
        }).catch((error) => {
            console.log(error.message);
        })
    }
}

function inputColor(input, error) {
    input.style.border = error == true ? '2px solid #b8052c' : '2px solid green';;
}

