/* Variáveis das inputs*/
let razaoSocial = '';
let nomeFantasia = '';
let cnpj = '';
let cep = '';
let rua = '';
let numero = '';
let complemento = '';
let uf = '';
let email = '';
let senha = '';
let senha2 = '';
let listaProximasPaginas = [];

function reloadList(){
    listaProximasPaginas = [
        `<h1>
            <span style="color: #066467; cursor: pointer;" onclick="prevInput()">&#8617</span>
            Crie sua conta agora
        </h1>
        <label for="input_razaoSocial">Razão Social:</label>
        <input type="text" name="razaoSocial" id="input_razaoSocial" value="${razaoSocial}">
        <label for="input_nomeFantasia">Nome Fantasia:</label>
        <input type="text" name="input_nomeFantasia" id="input_nomeFantasia" value="${nomeFantasia}">
        <label for="input_cnpj">CNPJ:</label>
        <input type="text" name="cnpjcpf" id="input_cnpj" value="${cnpj}">
        <button class="next" onclick="nextInput(1)">Prosseguir</button> `,
        `<h1>
        <span style="color: #066467; cursor: pointer;" onclick="prevInput()">&#8617</span>
        Localização</h1>
                                <label for="input_CEP">CEP:</label>
                                <input type="text" name="CEP" id="input_CEP" value="${cep}">
                                <label for="input_rua">Rua:</label>
                                <input type="text" name="rua" id="input_rua" value="${rua}">
                                <label for="input_numero">Numero:</label>
                                <input type="text" name="numero" id="input_numero" value="${numero}">
                                <label for="input_complemento">Complemento:</label>
                                <input type="text" name="complemento" id="input_complemento" value="${complemento}">
                                <label for="input_uf">UF:</label>
                                <input type="text" name="uf" id="input_uf" value="${uf}">
                                <button class="next" onclick="nextInput(2), toggleVisibility()">Prosseguir</button>
                                `,
        `<h1>
        <span style="color: #066467; cursor: pointer;" onclick="prevInput()">&#8617</span>
        Credenciais</h1>
                                <label for="input_email">Email:</label>
                                <input type="text" name="email" id="input_email" value="${email}">
                                <label for="input_senha">Senha:</label>
                                <div class="olho_senha">
                                    <span class="material-symbols-outlined visibility" id="visibilityOn" onclick="toggleVisibility();">
                                        visibility
                                    </span>
                                    <span class="material-symbols-outlined visibility" id="visibilityOff" onclick="toggleVisibility();">
                                        visibility_off
                                    </span>
                                    <input type="password" name="senha1" id="input_senha" value="${senha}">
                                </div>
                                <label for="senha2">Digite a senha novamente:</label>
                                <input type="password" name="senha2" id="senha2" value="${senha2}">
                                <button class="next" onclick="finishForm()">Finalizar</button>`
    ]
}
/* */

let phases = document.getElementsByClassName("phase");
let actualPhase = 0;
let passwordVisibility = true;

function toggleVisibility() {
    if (passwordVisibility) {
        visibilityOn.style.display = "flex"
        visibilityOff.style.display = "none"
        passwordVisibility = false;
        input_senha.type = "password";
    }
    else {
        visibilityOn.style.display = "none"
        visibilityOff.style.display = "flex"
        passwordVisibility = true;
        input_senha.type = "text";
    }
}

function prevInput() {
    // console.log(actualPhase)
    if (actualPhase >= 1) {
        if (actualPhase === 1) {
            cep = input_CEP.value;
            rua = input_rua.value;
            numero = input_numero.value;
            complemento = input_complemento.value;
            uf = input_uf.value;
        } else {
            senha = input_senha.value;
            email = input_email.value;
            senha2 = document.getElementById('senha2').value;
        }
        actualPhase--
        position = actualPhase
        printInputs(position);
    }
}



function printInputs(indiceLista) {
    reloadList();
    div_inputs.innerHTML = `${listaProximasPaginas[indiceLista]}`
}
function nextInput(position) {
    let error = false;
    switch (position) { /* VALIDAÇÃO LÓGICA INPUTS */
        case 1:
            razaoSocial = input_razaoSocial.value;
            cnpj = input_cnpj.value;
            nomeFantasia = input_nomeFantasia.value;
            if (!/^[A-Za-z\s]{6,25}$/.test(razaoSocial)) {
                error = true;
                inputColor(document.getElementById('input_razaoSocial'), error);
                break;
            }
            inputColor(document.getElementById('input_razaoSocial'), error);

            if (!/^[a-zA-Z\s]{6,25}$/.test(nomeFantasia)) {
                error = true;
                inputColor(document.getElementById('input_nomeFantasia'), error);
                break;
            }
            inputColor(document.getElementById('input_nomeFantasia'), error);

            if (!/^[0-9]{14}$/.test(cnpj)) {
                error = true;
                inputColor(document.getElementById('input_cnpj'), error);
                break;
            }

            inputColor(document.getElementById('input_cnpj'), error);
            break;

        case 2:
            cep = input_CEP.value;
            rua = input_rua.value;
            numero = input_numero.value;
            complemento = input_complemento.value;
            uf = input_uf.value;
            if (!/^[0-9]{8}$/.test(cep)) {
                error = true;
                inputColor(document.getElementById('input_CEP'), error);
                break;
            }
            inputColor(document.getElementById('input_CEP'), error);

            if (!/^[a-zA-Z\s]{10,25}$/.test(rua)) {
                error = true;
                inputColor(document.getElementById('input_rua'), error);
                break;
            }
            inputColor(document.getElementById('input_rua'), error);


            if (!/^[1-9][0-9]{1,}$/.test(numero)) {
                error = true;
                inputColor(document.getElementById('input_numero'), error);
                break;
            }
            inputColor(document.getElementById('input_numero'), error);

            if (!/^[a-zA-Z]{2}$/.test(uf)) {
                error = true;
                inputColor(document.getElementById('input_uf'), error);
                break;
            }
            inputColor(document.getElementById('input_uf'), error);

            if (!/^[a-zA-Z0-9\s]{0,255}$/.test(complemento)) {
                error = true;
                inputColor(document.getElementById('input_complemento'), error);
                break;
            }
            inputColor(document.getElementById('input_complemento'), error);
            break;
    }

    if (!error) {
        printInputs(position);
        actualPhase = position;
        console.log(actualPhase);
    } else {
        showMessage(error, 'dados inválidos!');
    }
}


function finishForm() {
    let error = false;
    senha = input_senha.value;
    email = input_email.value;
    if (!/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email)) {
        error = true;
        inputColor(document.getElementById('input_email'), error);
        showMessage(error, 'Email inválido!');
        return;
    }

    senha2 = document.getElementById('senha2').value;
    inputColor(document.getElementById('input_email'), error);

    if (!/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha)) {
        error = true;
        showMessage(error, 'Senha inválida!');
    }
    else if (senha != senha2) {
        error = true;
        showMessage(error, 'As senhas são diferentes!');
    }
    inputColor(document.getElementById('input_senha'), error);
    inputColor(document.getElementById('senha2'), error);

    if (!error) {
        console.log({
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
        });
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
                showMessage(false, 'Cadastro realizado com sucesso! Nossa equipe entrará em contato pelo e-mail cadastrado!');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 5000)
            } else {
                result.text().then(text => {
                    showMessage(true, text)
                })
            }
        }).catch((error) => {
            console.log(error);
            showMessage(true, 'Erro inesperado! por favor, tente novamente mais tarde.');
        })
    }
}

function inputColor(input, error) {
    input.style.border = error == true ? '2px solid #b8052c' : '2px solid green';;
}

