
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
        token += chars[Math.round(Math.random() * chars.length)];
    }

    return token;
}

module.exports = {
    tokenGenerator
}