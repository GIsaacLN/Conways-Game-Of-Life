const rows = 32;
const cols = 32;
const grid = document.getElementById("grid");
const currentPopulationElement = document.getElementById("currentPopulation");
const currentIterationElement = document.getElementById("currentIteration");
const endMessageElement = document.getElementById("endMessage");
const populationInput = document.getElementById("populationInput");
let cells = [];
let interval = null;
let currentPopulation = 0;
let currentIteration = 0;
let populationData = []; 
const populationChartCtx = document.getElementById('populationChart').getContext('2d');

const populationChart = new Chart(populationChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Population Over Time',
            data: populationData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Iteration' }},
            y: { title: { display: true, text: 'Population' }}
        }
    }
});

const textContent = {
    en: {
        title: "Conway's Game of Life",
        endMessage: "Game Over: Population has reached zero.",
        generate: "Generate Population",
        start: "Start",
        pause: "Pause",
        next: "Next",
        placeholder: "Enter population size",
        currentPopulationLabel: "Current Population:",
        currentIterationLabel: "Current Iteration:"
    },
    es: {
        title: "El Juego de la Vida de Conway",
        endMessage: "Fin del Juego: La población ha llegado a cero.",
        generate: "Generar Población",
        start: "Iniciar",
        pause: "Pausa",
        next: "Siguiente",
        placeholder: "Ingresa el tamaño de la población",
        currentPopulationLabel: "Población Actual:",
        currentIterationLabel: "Iteración Actual:"
    }
};

function switchLanguage(lang) {
    document.getElementById("title").textContent = textContent[lang].title;
    endMessageElement.textContent = textContent[lang].endMessage;
    document.getElementById("generate").textContent = textContent[lang].generate;
    document.getElementById("start").textContent = textContent[lang].start;
    document.getElementById("pause").textContent = textContent[lang].pause;
    document.getElementById("next").textContent = textContent[lang].next;
    populationInput.placeholder = textContent[lang].placeholder;
    document.getElementById("currentPopulationLabel").textContent = `${textContent[lang].currentPopulationLabel} `;
    document.getElementById("currentIterationLabel").textContent = `${textContent[lang].currentIterationLabel} `;
}

function createGrid() {
    for (let i = 0; i < rows; i++) {
        cells[i] = [];
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            grid.appendChild(cell);
            cells[i][j] = {
                element: cell,
                alive: false
            };
        }
    }
}

function generatePopulation() {
    const populationSize = Math.min(populationInput.value, rows * cols);
    resetGrid();

    let populatedCells = 0;
    while (populatedCells < populationSize) {
        const x = Math.floor(Math.random() * rows);
        const y = Math.floor(Math.random() * cols);
        if (!cells[x][y].alive) {
            cells[x][y].alive = true;
            cells[x][y].element.classList.add("alive");
            populatedCells++;
        }
    }
    currentPopulation = populationSize;
    updateMetrics();
}

function resetGrid() {
    cells.forEach(row => row.forEach(cell => {
        cell.alive = false;
        cell.element.classList.remove("alive");
    }));
    currentIteration = 0;
    populationData.length = 0;
    populationChart.data.labels = [];
    populationChart.update();
    endMessageElement.style.display = "none";
    updateMetrics();
}

function getNeighbors(x, y) {
    let neighbors = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const row = x + i;
            const col = y + j;
            if (row >= 0 && row < rows && col >= 0 && col < cols && cells[row][col].alive) {
                neighbors++;
            }
        }
    }
    return neighbors;
}

function updateGrid() {
    const newCells = cells.map((row, x) =>
        row.map((cell, y) => {
            const neighbors = getNeighbors(x, y);
            const alive = (cell.alive && (neighbors === 2 || neighbors === 3)) || (!cell.alive && neighbors === 3);
            return { ...cell, alive };
        })
    );

    cells = newCells;
    renderGrid();
    currentIteration++;
    currentPopulation = cells.flat().filter(cell => cell.alive).length;
    updateMetrics();
    updatePopulationChart();

    if (currentPopulation === 0) {
        endGame();
    }
}

function renderGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            cells[i][j].element.classList.toggle("alive", cells[i][j].alive);
        }
    }
}

function startGame() {
    if (!interval) {
        interval = setInterval(updateGrid, 500); 
    }
}

function pauseGame() {
    clearInterval(interval);
    interval = null;
}

function nextIteration() {
    updateGrid();
}

function endGame() {
    pauseGame();
    showToast("Game Over: Population has reached zero.");
}

// Function to show toast message
function showToast(message) {
    const toast = document.getElementById("toastMessage");
    toast.textContent = message;
    toast.classList.add("show");
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function updateMetrics() {
    currentPopulationElement.innerText = currentPopulation;
    currentIterationElement.innerText = currentIteration;
}

function updatePopulationChart() {
    populationData.push(currentPopulation);
    populationChart.data.labels.push(currentIteration);
    populationChart.update();
}

createGrid();
switchLanguage('en');
