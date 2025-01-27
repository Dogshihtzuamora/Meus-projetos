const canvas = document.createElement("canvas");
const contexto = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const mapa = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
];

const jogador = { x: 1.5, y: 1.5, angulo: 0, velocidade: 0.05, velocidadeRotacao: 0.05 };
const teclas = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

function desenharCena() {
    for (let x = 0; x < canvas.width; x++) {
        const raioAngulo = (jogador.angulo - Math.PI / 6) + (x / canvas.width) * (Math.PI / 3);
        let distancia = 0;
        let atingiu = false;

        while (!atingiu && distancia < 10) {
            distancia += 0.01;
            const raioX = jogador.x + Math.cos(raioAngulo) * distancia;
            const raioY = jogador.y + Math.sin(raioAngulo) * distancia;
            const mapaX = Math.floor(raioX);
            const mapaY = Math.floor(raioY);

            if (mapa[mapaY] && mapa[mapaY][mapaX] === 1) {
                atingiu = true;
                const alturaParede = Math.min(canvas.height / distancia, canvas.height);
                const corParede = `rgb(${139}, ${69}, ${19})`;
                contexto.fillStyle = corParede;
                contexto.fillRect(x, (canvas.height - alturaParede) / 2, 1, alturaParede);
            }
        }
    }
}

function desenhar() {
    contexto.fillStyle = "blue";
    contexto.fillRect(0, 0, canvas.width, canvas.height / 2);
    contexto.fillStyle = "green";
    contexto.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    desenharCena();
}

function moverJogador() {
    let novoX = jogador.x;
    let novoY = jogador.y;

    if (teclas.ArrowUp) {
        novoX += Math.cos(jogador.angulo) * jogador.velocidade;
        novoY += Math.sin(jogador.angulo) * jogador.velocidade;
    }
    if (teclas.ArrowDown) {
        novoX -= Math.cos(jogador.angulo) * jogador.velocidade;
        novoY -= Math.sin(jogador.angulo) * jogador.velocidade;
    }

    if (mapa[Math.floor(novoY)][Math.floor(jogador.x)] === 0) {
        jogador.y = novoY;
    }
    if (mapa[Math.floor(jogador.y)][Math.floor(novoX)] === 0) {
        jogador.x = novoX;
    }

    if (teclas.ArrowLeft) {
        jogador.angulo -= jogador.velocidadeRotacao;
    }
    if (teclas.ArrowRight) {
        jogador.angulo += jogador.velocidadeRotacao;
    }
}

function criarBotoes() {
    const controles = [
        { label: "↑", acao: "ArrowUp" },
        { label: "↓", acao: "ArrowDown" },
        { label: "←", acao: "ArrowLeft" },
        { label: "→", acao: "ArrowRight" }
    ];

    controles.forEach(controle => {
        const botao = document.createElement("button");
        botao.textContent = controle.label;
        botao.style.position = "fixed";
        botao.style.fontSize = "24px";
        botao.style.zIndex = 10;

        if (controle.label === "↑") {
            botao.style.left = "50%";
            botao.style.bottom = "80px";
        } else if (controle.label === "↓") {
            botao.style.left = "50%";
            botao.style.bottom = "20px";
        } else if (controle.label === "←") {
            botao.style.left = "40%";
            botao.style.bottom = "50px";
        } else if (controle.label === "→") {
            botao.style.left = "60%";
            botao.style.bottom = "50px";
        }

        botao.addEventListener("mousedown", () => teclas[controle.acao] = true);
        botao.addEventListener("mouseup", () => teclas[controle.acao] = false);
        botao.addEventListener("touchstart", () => teclas[controle.acao] = true);
        botao.addEventListener("touchend", () => teclas[controle.acao] = false);
        document.body.appendChild(botao);
    });
}

function loop() {
    moverJogador();
    desenhar();
    requestAnimationFrame(loop);
}

criarBotoes();
loop();
