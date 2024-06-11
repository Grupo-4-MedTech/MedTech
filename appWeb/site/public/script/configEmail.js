function findConfigurations() {
    fetch(`/funcionario/${sessionStorage.ID}/configuracoes-email`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => {
            if (res.status != 200) {
                res.text().then((text) => {
                    showMessage(false, text);
                })
            } else {
                res.json().then((json) => {
                    console.log(json);
                    printInputs(json[0]);
                })
            }
        })
        .catch(error => showMessage(true, UNEXPECTED_ERROR));
}

function printInputs(json) {
    input_host.value = json.host;
    input_porta.value = json.port;
    input_email.value = json.email;
    input_senha.value = json.pass;
}

function updateConfigurations() {
    fetch(`/funcionario/${sessionStorage.ID}/configuracoes-email`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            host: input_host.value,
            port: input_porta.value,
            email: input_email.value,
            pass: input_senha.value
        })
    })
        .then((res) => {
            res.text().then((text) => {
                showMessage(res.status !== 200, text);
            });
        })
        .catch(error => showMessage(true, UNEXPECTED_ERROR));
}

findConfigurations();