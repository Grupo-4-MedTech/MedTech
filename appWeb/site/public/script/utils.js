const messageCard = document.getElementById('message');

function showMessage(error, text) {

    const bgcolor = error == true ? "rgb(205, 50, 50)" : "rgb(50, 205, 50)";

    messageCard.style.opacity = 1;
    messageCard.style.width = 'fit-content';
    messageCard.style.height = 'fit-content';
    messageCard.innerText = text;
    messageCard.style.backgroundColor = bgcolor;
    messageCard.style.display = "block";

    setTimeout(()=>{
        messageCard.innerText = '';
        messageCard.style.opacity = 0
        messageCard.style.width = 0;
        messageCard.style.height = 0;
    }, 5000);
}