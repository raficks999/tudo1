"use strict"

const canvas = document.getElementById("meuCanvas");
const ctx = canvas.getContext("2d");

function desenhar_quadrado(x, y, largura, altura, cor) {
    ctx.fillStyle = cor;
    ctx.fillRect(x, y, largura, altura);
}

function desenhar_linha(x1, y1, x2, y2, cor, espessura = 1) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = cor;
    ctx.linewidth = espessura;
    ctx.stroke();
}

function desenhar_arco(x, y, raio, inicio, fim, cor) {
    ctx.beginPath();
    ctx.arc(x, y, raio, inicio, fim);
    ctx.strokeStyle = cor;
    ctx.stroke();
}

function escrever(text, x, y, tamanho = 16, cor = "preto") {
    ctx.fillStyle = cor;
    ctx.font =  '${tamanho}px Arial';
    ctx.textAlign = "center";
    ctx.fillText(texto, x, y);
}

function desenhar_circulo(x, y, raio, cor) {
    ctx.beginPath();
    ctx.arc(x, y, raio, 0, Math.PI * 2);
    ctx.fillStyle = cor;
    ctx.fill();
}

function desenhar_campo() {
    ctx.beginPath();

    desenhar_quadrado(0, 0, 300, 300, "lightgreen");

    desenhar_circulo(225, 75, 32, "yellow");

    ctx.beginPath();
    ctx.moveTo(0, 195);
    ctx.lineTo(20, 205);
    ctx.lineTo(20, 240);
    ctx.lineTo(90, 260);
    ctx.quadraticCurveTo(120, 275, 120, 300);
    ctx.lineTo(0, 300);
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();

    desenhar_quadrado(35, 235, 265, 65, "darkslategray");

    desenhar_quadrado(38, 190, 15, 45, "saddlebrown");

    desenhar_circulo(45, 180, 23, "darkgreen");

    desenhar_quadrado(260, 255, 15, 30, "saddlebrown");

    desenhar_circulo(268, 245, 23, "darkgreen");

    desenhar_quadrado(120, 155, 80, 80, "saddlebrown");

    ctx.beginPath();
    ctx.moveTo(120, 155);
    ctx.lineTo(160, 120);
    ctx.lineTo(200, 155);
    ctx.closePath();
    ctx.fillStyle = "tomato";
    ctx.fill();

    desenhar_quadrado(130, 170, 23, 23, "deepskyblue");
    desenhar_quadrado(167, 170, 23, 23, "deepskyblue");

    desenhar_quadrado(155, 195, 15, 40, "brown");
}

desenhar_campo();