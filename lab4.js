const numeroSecreto = Math.floor(Math.random() * 99);

function verificarPalpite() {
    const inputElement = document.getElementById("palpite");
    const valorDigitado = parseInt(inputElement.value);
    const elementoMensagem = document.getElementById("mensagem");

    if (isNaN(valorDigitado) || valorDigitado < 0 || valorDigitado > 99) {
        elementoMensagem.textContent = "Por favor, insira um número válido!";
        elementoMensagem.style.setProperty("background-color", "orange");
        elementoMensagem.style.color = "black";
        return;
    }

    if (valorDigitado === numeroSecreto) {
        elementoMensagem.textContent = "Parabéns! Acertou";
        elementoMensagem.style.setProperty("background-color", "green");
        elementoMensagem.style.color = "white";
    } 
    
    else {
        document.getElementById("mensagem").style.setProperty("background-color","red");
        document.getElementById("mensagem").style.color = "white";

        if (valorDigitado > numeroSecreto) {
            elementoMensagem.textContent = "O número secreto é MENOR!"
        } 
        
        else {
            elementoMensagem.textContent = "O número secreto é MAIOR!"
        }
    }
}