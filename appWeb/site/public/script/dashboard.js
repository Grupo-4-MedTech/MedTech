/* funcionalidades do profile => */
let optionsIsActive = false;

function toggleOptions() {
    switch (optionsIsActive) {
        case true:
            profile_content.style.display = 'none';
            optionsIsActive = false;
            break;
        case false:
            profile_content.style.display = 'block';
            optionsIsActive = true;
            break;
    }

    /* protectedOptionsv <= verificar se o usuário tem permissão de gerenciar usuários*/
    // protectedOptions.style.display = block
}

function openConfig() {
    profile_content.style.display = 'none';
    backgrounddiv.style.display = 'block';

}

function openUserManagement() {
    profile_content.style.display = 'none';
    backgrounddiv.style.display = 'block';

}

function openComputerRegistration() {
    profile_content.style.display = 'none';
    backgrounddiv.style.display = 'block';

}

function closeConfig() {
    backgrounddiv.style.display = 'none';
    profile_content.style.display = 'none';

}

function logout() {
    /* desconectar usuário antes */
    window.location = "../index.html";
}