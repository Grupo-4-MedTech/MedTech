let passwordVisibility = true;

function login() {
    let email = email_input.value;
    let senha = senha_input.value;

    // if(email == "katia.rodrigues@santacruz.org" && senha == "santacruz"){
    //     message.innerText = "Login realizado com sucesso";
    //     message.style.backgroundColor = "rgb(50, 205, 50)";
    //     message.style.display = "block";
    //     setTimeout(() => {
    //         window.location = "index.html";
    //     }, 2000);
    // }
    // else{
    //     message.innerText = "Email ou senha incorretos";
    //     message.style.backgroundColor = "rgb(205, 50, 50)";
    //     message.style.display = "block";
    // }

    fetch("/hospital/autenticar", {
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
                sessionStorage.TIPO = json.tipo;
                sessionStorage.PRIVILEGIO = json.privilegio;
            });

            showMessage('message', "Login realizado com sucesso");

            setTimeout(() => {
                window.location = "index.html";
            }, 2000);

        } else if (result.status == 400) {
            showMessage('error', 'Email ou senha incorretos');
        } else {
            showMessage('error', 'Erro inesperado');
        }
    })
}

function toggleVisibility() {
    if (passwordVisibility) {
        visibilityOn.style.display = "block"
        visibilityOff.style.display = "none"
        passwordVisibility = false;
        senha_input.type = "password";
    }
    else {
        visibilityOn.style.display = "none"
        visibilityOff.style.display = "block"
        passwordVisibility = true;
        senha_input.type = "text";
    }
}


function showMessage(type, text) {

    const bgcolor = type == 'error' ? "rgb(205, 50, 50)" : type == 'message' ? "rgb(50, 205, 50)" : null;

    message.innerText = text;
    message.style.backgroundColor = bgcolor;
    message.style.display = "block";
}