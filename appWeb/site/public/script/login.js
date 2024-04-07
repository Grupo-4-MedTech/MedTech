let passwordVisibility = true;

function login() {
    const email = email_input.value;
    const senha = senha_input.value;

    if(
        !/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha) ||
        !/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email)
    ){
        showMessage(true, 'Dados inválidos');
        return;
    }

    fetch("/funcionario/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            senha
        }),
    }).then((result) => {
        if (result.status == 201) {
            console.log('Logado com sucesso');
            result.json().then((json) => {
                sessionStorage.NOME_USR = json.nome;
                sessionStorage.EMAIL_USR = json.email;
                sessionStorage.TEL_USR = json.telefone;
                sessionStorage.CARGO = json.cargo;
                sessionStorage.CPF = json.cpf;
                sessionStorage.HOSP = json.fkHospital;
            });

            showMessage(false, "Login realizado com sucesso");

            setTimeout(() => {
                window.location = "index.html";
            }, 2000);

        } else if (result.status == 400) {
            showMessage(true, 'Email ou senha incorretos');
        } else if(result.status == 401){
            showMessage(true, 'Dados inválidos');
        } else {
            showMessage(true, 'Erro inesperado');
        }
    })
}

function toggleVisibility() {
    if (passwordVisibility) {
        visibilityOn.style.display = "block";
        visibilityOff.style.display = "none";
        passwordVisibility = false;
        senha_input.type = "password";
    }
    else {
        visibilityOn.style.display = "none";
        visibilityOff.style.display = "block";
        passwordVisibility = true;
        senha_input.type = "text";
    }
}


function showMessage(error, text) {

    const bgcolor = error == true ? "rgb(205, 50, 50)" : "rgb(50, 205, 50)";

    message.style.opacity = 1;
    message.innerText = text;
    message.style.backgroundColor = bgcolor;
    message.style.display = "block";

    setTimeout(()=>{message.style.opacity = 0}, 5000);
}