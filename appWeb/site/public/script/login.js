let passwordVisibility = true;
let email;
let senha;

function login() {

    email = email_input.value;
    senha = senha_input.value;
    if(
        !/^[a-zA-Z0-9!@#$%^&*()]{8,25}$/.test(senha) ||
        !/^[a-zA-Z0-9\.\_]{3,}[@][a-zA-Z]{3,}[.][a-zA-Z\.]{3,}$/.test(email)
    ){
        showMessage(true, 'Dados inválidos');
        return;
    }

    const admAcc = document.getElementById('input_accType').checked;

    if (admAcc) {
        fetchToAdm();
    } else {
        fetchToFunc();
    } 
}

function fetchToAdm() {
    fetch("/admin/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            senha
        })
    }).then((res) => {
        if (res.status == 200) {
            res.json().then((json) => {
                sessionStorage.NOME_USR = json.nome;
                sessionStorage.EMAIL_USR = json.email;
                sessionStorage.TOKEN = json.token;
                sessionStorage.CPF = json.cpf;
            });

            showMessage(false, "Login realizado com sucesso");

            setTimeout(() => {
                window.location = "admin.html";
            }, 2000);
        } else {
            result.text().then(text =>{
                showMessage(true, text);
            })
        }
    }).catch((error) => {
        console.log(error)
        showMessage(true, 'Houve um erro inesperado! entre em contato com o nosso suporte.');
    })
}

function fetchToFunc() {
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
                redirect(json);
            });
        } else {
            result.text().then(text =>{
                showMessage(true, text);
            })
        }
    }).catch((error) => {
        console.log(error)
        showMessage(true, 'Houve um erro inesperado! entre em contato com o nosso suporte.');
    })
}

function toggleVisibility() {
    if (passwordVisibility) {
        visibilityOn.style.display = "flex";
        visibilityOff.style.display = "none";
        passwordVisibility = false;
        senha_input.type = "password";
    }
    else {
        visibilityOn.style.display = "none";
        visibilityOff.style.display = "flex";
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

function redirect(json) {
    showMessage(false, "Login realizado com sucesso");

    console.log(json.token);
    sessionStorage.ID = json.idFuncionario;
    sessionStorage.NOME_USR = json.nome;
    sessionStorage.EMAIL_USR = json.email;
    sessionStorage.TEL_USR = json.telefone;
    sessionStorage.CARGO = json.cargo;
    sessionStorage.CPF = json.cpf;
    sessionStorage.TOKEN = json.token;
    sessionStorage.HOSP = json.fkHospital;

    if (['GESTOR_TI', 'TECNICO_TI'].indexOf(json.cargo) > -1) {
        setTimeout(() => {
            window.location.href = './dashboard/geralTI.html';
        }, 2000);
    } else {
        setTimeout(() => {
            window.location.href = './dashboard/geralGerencia.html';
        }, 2000);
    }
}