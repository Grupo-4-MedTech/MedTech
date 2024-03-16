let passwordVisibility = true;

function login(){
    let email = email_input.value;
    let senha = senha_input.value;

    if(email == "katia.rodrigues@santacruz.org" && senha == "santacruz"){
        message.innerText = "Login realizado com sucesso";
        message.style.backgroundColor = "rgb(50, 205, 50)";
        message.style.display = "block";
        setTimeout(() => {
            window.location = "index.html";
        }, 2000);
    }
    else{
        message.innerText = "Email ou senha incorretos";
        message.style.backgroundColor = "rgb(205, 50, 50)";
        message.style.display = "block";
    }
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