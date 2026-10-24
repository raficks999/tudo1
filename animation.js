"use strict";

const canvas = document.getElementById("meuCanvas");
const ctx = canvas.getContext("2d");

const imagem = new Image();
imagem.src = "imagens/corinthians.png";

const largura = 50;
const altura = 50;

let x = canvas.width / 2;
let y = canvas.height / 2;

function desenharImagem() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        imagem,
        x - largura / 2,
        y - altura / 2,
        largura,
        altura
    );
}

imagem.onload = function () {
    console.log("Imagem Carregada!")
    desenharImagem();
};

imagem.onerror = function () {
    console.log("Erro! Não foi possível carregar a imagem");
};

canvas.addEventListener("mousemove", function (evento) {
    const retangulo = canvas.getBoundingClientRect();

    const mouseX = evento.clientX - retangulo.left;
    const mouseY = evento.clientY - retangulo.top;

    x = Math.max(
        largura / 2,
        Math.min(mouseX, canvas.width - largura / 2)
    );

    y = Math.max(
        altura / 2,
        Math.min(mouseY, canvas.height - altura / 2)
    );

    desenharImagem();

    
});