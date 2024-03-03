function nextInput(i) {
    switch (i) {
        case 1:
            screendiv.innerHTML = `
            <label for="cnpjcpf">CNPJ/CPF:</label>
            <input type="text" name="cnpjcpf" id="cnpjcpf">
            <div class="space"></div>
            <label for="CEP">CEP:</label>
            <input type="text" name="CEP" id="CEP">
            <label for="endereco">Endereço:</label>
            <input type="text" name="endereco" id="endereco">
            <div class="space"></div>
            <div class="space"></div>
            <button class="next" onclick="nextInput(2);">Prosseguir</button>`;
            break;
        case 2:
            screendiv.innerHTML = `
            <label for="email">Seu email:</label>
            <input type="text" name="email" id="email">
            <div class="space"></div>
            <label for="celular">Telefone celular:</label>
            <input type="text" name="celulcar" id="celular">
            <div class="space"></div>
            <div class="space"></div>
            <button class="next" onclick="nextInput(3);">Prosseguir</button>`;
            break;
        case 3:
            screendiv.innerHTML = `
            <h1>Crie uma senha:</h1>
            <div class="space"></div>
            <label for="senha1">Senha:</label>
            <input type="text" name="senha1" id="senha1">
            <div class="space"></div>
            <label for="senha2">Digite a senha novamente:</label>
            <input type="text" name="senha2" id="senha2">
            <div class="space"></div>
            <div class="space"></div>
            <button class="next" onclick="nextInput(4);">Finalizar</button>`;
            break;

    }
}