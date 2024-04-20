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

let listaProximasPaginas = [
                            `<h1>Localização</h1>
                            <label for="input_CEP">CEP:</label>
                            <input type="text" name="CEP" id="input_CEP">
                            <label for="input_rua">Rua:</label>
                            <input type="text" name="rua" id="input_rua">
                            <label for="input_numero">Numero:</label>
                            <input type="text" name="numero" id="input_numero">
                            <label for="input_complemento">Complemento:</label>
                            <input type="text" name="complemento" id="input_complemento">
                            <label for="input_uf">UF:</label>
                            <input type="text" name="uf" id="input_uf">
                            <button class="next" onclick="nextInput(2), toggleVisibility()">Prosseguir</button>
                            `,
                            `<h1>Credenciais</h1>
                            <label for="input_email">Email:</label>
                            <input type="text" name="email" id="input_email">
                            <label for="input_senha">Senha:</label>
                            <div class="olho_senha">
                                <span class="material-symbols-outlined visibility" id="visibilityOn" onclick="toggleVisibility();">
                                    visibility
                                </span>
                                <span class="material-symbols-outlined visibility" id="visibilityOff" onclick="toggleVisibility();">
                                    visibility_off
                                </span>
                                <input type="password" name="senha1" id="input_senha">
                            </div>
                            <label for="senha2">Digite a senha novamente:</label>
                            <input type="password" name="senha2" id="senha2">
                            <button class="next" onclick="finishForm()">Finalizar</button>`
                        ]
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
    actualPhase--
    position = actualPhase
}



function printInputs(indiceLista){
    div_inputs.innerHTML = `${listaProximasPaginas[indiceLista-1]}`
}
function nextInput(position) {    
    let error = false;
    switch (position) { /* VALIDAÇÃO LÓGICA INPUTS */
        case 1:
            razaoSocial  = input_razaoSocial.value;
            cnpj         = input_cnpj.value;
            nomeFantasia = input_nomeFantasia.value;

            if (!/^[A-Za-z\s]{6,25}$/.test(razaoSocial)) {
                error = true;
                inputColor(document.getElementById('input_razaoSocial'), error);
                return;
            }
            inputColor(document.getElementById('input_razaoSocial'), error);

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
            printInputs(position);
        break;

        case 2:
            cep          = input_CEP.value;
            rua          = input_rua.value;
            numero       = input_numero.value;
            complemento  = input_complemento.value;
            uf           = input_uf.value;
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
                return;
            }
            inputColor(document.getElementById('input_complemento'), error);

            printInputs(position);
            break;
        
        }
    
    actualPhase = position;
}


function finishForm() {
    let error = false;
    senha = input_senha.value;
    email = input_email.value;
    if (!/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email)) {
        error = true; 
        inputColor(document.getElementById('input_email'), error);
        return;
    }
    inputColor(document.getElementById('input_email'), error);

    if (!/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha)) {
        error = true;
    }
    else if (senha != senha2.value) {
        error = true;
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
                console.log('Cadastrado com sucesso');
                window.location.href = 'login.html';
            } else if(result.status == 401){
                console.log('Dados inválidos');
            }
        }).catch((error) => {
            console.log("Erro ao cadastrar");
            console.log(error.message);
        })
    }
}

function inputColor(input, error) {
    input.style.border = error == true ? '2px solid #b8052c' : '2px solid green';;
}

