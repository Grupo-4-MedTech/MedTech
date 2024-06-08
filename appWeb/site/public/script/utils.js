
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

    if (sessionStorage.CARGO == 'GESTOR_TI') {
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
    }

    content += `
    <li onclick="logout();"><img src="../assets/img/logout.png" alt="">Logout</li>`;

    profile_content_container.innerHTML = content;
}

module.exports = {
    tokenGenerator
}