const UNEXPECTED_ERROR = 'Houve um erro inesperado! Por favor, entre em contato com o nosso suporte.';
const NOT_FOUND = 'Nenhum registro encontrado.';
const SUCCESSFULLY_CHANGED = 'Registro alterado com sucesso!';
const INVALID_ALERT_DATA = 'As porcentagens de alerta devem ser menores do que as de estado crítico!';
const BAD_REQUEST = 'Os dados fornecidos são inválidos!';
const SUCCESSFULLY_CREATED = 'Registro criado com sucesso!';
const SUCCESSFULLY_DELETED= 'Registro deletado com sucesso!';

function showMessage(error, text) {
    const messageCard = document.getElementById('message');

    const bgcolor = error == true ? "rgb(205, 50, 50)" : "rgb(50, 205, 50)";

    messageCard.style.opacity = 1;
    messageCard.style.width = 'fit-content';
    messageCard.style.height = 'fit-content';
    messageCard.innerText = text;
    messageCard.style.backgroundColor = bgcolor;
    messageCard.style.display = "block";
    showing = true;

    setTimeout(()=>{
        messageCard.innerText = '';
        messageCard.style.opacity = 0
        messageCard.style.width = 0;
        messageCard.style.height = 0;
        showing = false;
    }, 5000);
}

function tokenGenerator() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    while (token.length < 255) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }

    return token;
}

function chkLoginDash() {
    setTimeout(() => {
        fetch(`/funcionario/islogged/${sessionStorage.TOKEN}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            if (res.status != 200) {
                logout();
            } else {
                try{
                    profileOptions();
                } catch(e) {
                    return
                } 
            }
        }).catch(() => {
            logout();
        });
    }, 200);
}


function logout(){
    sessionStorage.clear();
    window.location.href = '../index.html';
}

function profileOptions() {
    let content = `
    <li onclick="openConfig()"> <img src="../assets/img/engrenagem.png" alt="">Configurações</li>`;

    if (sessionStorage.CARGO === 'GESTOR_TI') {
        content += `
        <li onclick="openUserManagement()">
            <img src="../assets/img/config-usuario.png" alt="">
            Usuários
        </li>
        <li onclick="openComputerRegistration()">
            <img src="../assets/img/config-computador.png" alt="">
            Máquinas
        </li>
        `;
    } else if (sessionStorage.CARGO === 'MEDICO_GERENTE') {
         content += `
         <li onclick="window.location.href = 'filtragemJanelas.html'">
            <img src="../assets/img/config-computador.png" alt="">
             Alertas Slack
        </li>`;
    }

    content += `
    <li onclick="logout();"><img src="../assets/img/logout.png" alt="">Logout</li>`;

    profile_content_container.innerHTML = content;
}

module.exports = {
    tokenGenerator,
    UNEXPECTED_ERROR,
    NOT_FOUND,
    SUCCESSFULLY_CHANGED,
    INVALID_ALERT_DATA,
    BAD_REQUEST,
    SUCCESSFULLY_CREATED,
    SUCCESSFULLY_DELETED
}