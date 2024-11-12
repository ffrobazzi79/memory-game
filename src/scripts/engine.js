// 1.- "emojis" array contendo pares de emojis para o jogo. 2."cartasAbertas" array temporário para armazenar os dois cards abertos na rodada atual. 3.- "emojisEmbaralhados" armazenará os emojis embaralhados. 4.- "intervaloCronometro" controla o cronômetro. 5.- "segundosPassados" conta os segundos desde o início do jogo. 6.- "contadorErros" conta o número de tentativas incorretas. 7.- "melhorTempo" Carrega o melhor tempo do localStorage ou define como null se ainda não existir.
const emojis = [
    "😺", "😺", "🦝", "🦝", "🦊", "🦊", "🐶", "🐶", "🦄", "🦄", "🐵", "🐵", "🦁", "🦁", "🐯", "🐯", "🐮", "🐮", "🐼", "🐼"
];
let cartasAbertas = [];
let emojisEmbaralhados;
let intervaloCronometro;
let segundosPassados = 0;
let contadorErros = 0;
let melhorTempo = localStorage.getItem("melhorTempo") ? parseInt(localStorage.getItem("melhorTempo")) : null;

// Exibe o melhor tempo e o contador de erros ao carregar a página
function exibirEstatisticas() {
    const exibicaoMelhorTempo = document.getElementById("melhor-tempo");
    exibicaoMelhorTempo.textContent = melhorTempo ? `Melhor Tempo: ${formatarTempo(melhorTempo)}` : "Melhor Tempo: --:--";
    document.getElementById("contagem-erros").textContent = `Erros: ${contadorErros}`;
}

function iniciarJogo() {
    // Embaralha os emojis e cria o layout do jogo.
    emojisEmbaralhados = emojis.sort(() => Math.random() - 0.5);
    // Limpa o jogo para resetar
    document.querySelector(".jogo").innerHTML = ""; 
    // Cria as divs das cartas
    emojisEmbaralhados.forEach(emoji => {
        let carta = document.createElement("div");
        carta.className = "item";
        carta.innerHTML = emoji;
        carta.onclick = handClick;
        document.querySelector(".jogo").appendChild(carta);
    });
    iniciarCronometro();  // Inicia o cronômetro
    contadorErros = 0;  // Reseta o contador de erros
    exibirEstatisticas();  // Exibe o melhor tempo e o contador de erros ao iniciar o jogo
}

function handClick() {
    // Permite abrir apenas dois cards ao mesmo tempo.
    if (cartasAbertas.length < 2 && !this.classList.contains("cartaAberta")) {
        this.classList.add("cartaAberta");
        cartasAbertas.push(this);
    }
    if (cartasAbertas.length === 2) {
        setTimeout(verificarPar, 500);
    }
}

// Verifica se os dois cards abertos têm o mesmo emoji.
function verificarPar() {
    // Se forem iguais, aplica a classe cartaCorreta para indicar o par encontrado. Se forem diferentes, fecha os cards e incrementa o contador de erros.
    if (cartasAbertas[0].innerHTML === cartasAbertas[1].innerHTML) {
        cartasAbertas[0].classList.add("cartaCorreta");
        cartasAbertas[1].classList.add("cartaCorreta");
    } else {
        cartasAbertas[0].classList.remove("cartaAberta");
        cartasAbertas[1].classList.remove("cartaAberta");
        // Incrementa o contador de erros em uma tentativa incorreta
        contadorErros++;
        document.getElementById("contagem-erros").textContent = `Erros: ${contadorErros}`;
    }
    cartasAbertas = [];

    // Verifica se o jogador encontrou todos os pares para declarar a vitória e atualizar o melhor tempo.
    if (document.querySelectorAll(".cartaCorreta").length === emojis.length) {
        clearInterval(intervaloCronometro);
        alert(`Você venceu! Tempo: ${formatarTempo(segundosPassados)} | Erros: ${contadorErros}`);
        atualizarMelhorTempo(segundosPassados);
    }
}

// inicia o cronômetro.
function iniciarCronometro() {
    segundosPassados = 0;
    atualizarCronometro();
    // Limpa o intervalo anterior
    clearInterval(intervaloCronometro);
    intervaloCronometro = setInterval(() => {
        segundosPassados++;
        atualizarCronometro();
    }, 1000);
}

// atualiza o cronômetro a cada segundo.
function atualizarCronometro() {
    document.getElementById("cronometro").textContent = `Tempo: ${formatarTempo(segundosPassados)}`;
}

// formata o tempo no estilo MM:SS.
function formatarTempo(segundos) {
    // Converte o total de segundos para minutos inteiros, dividindo por 60 e arredondando para baixo.
    const minutos = Math.floor(segundos / 60);
    // Calcula quantos segundos restam após os minutos inteiros
    const segundosRestantes = segundos % 60;
    // Formata a saída para exibir "MM:SS", incluindo zero à esquerda, se necessário.
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
}

function atualizarMelhorTempo(tempoAtual) {
    // Verifica se o tempo atual é melhor que o registrado.
    if (!melhorTempo || tempoAtual < melhorTempo) {
        melhorTempo = tempoAtual;
        // Salva o novo melhor tempo no localStorage
        localStorage.setItem("melhorTempo", melhorTempo);
        // Atualiza a exibição do melhor tempo
        exibirEstatisticas();  
        
    }
}

// Reinicia o jogo e o cronômetro.
function reiniciarJogo() {
    clearInterval(intervaloCronometro);
    iniciarJogo();
}

// Inicia o jogo ao carregar a página
iniciarJogo();
