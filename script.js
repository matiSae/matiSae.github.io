let grafica2D; // Global para Chart.js

function calcularProductoPunto() {
    const vectorA = document.getElementById('vectorA').value.split(',').map(Number);
    const vectorB = document.getElementById('vectorB').value.split(',').map(Number);
    const angulo = document.getElementById('angulo').value;

    // Validación
    if (
        vectorA.length === vectorB.length &&
        (vectorA.length === 2 || vectorA.length === 3) &&
        vectorA.every(n => !isNaN(n)) &&
        vectorB.every(n => !isNaN(n))
    ) {
        // Calcular producto punto
        let resultado = 0;
        if (angulo) {
            const magA = Math.sqrt(vectorA.reduce((sum, v) => sum + v * v, 0));
            const magB = Math.sqrt(vectorB.reduce((sum, v) => sum + v * v, 0));
            const rad = Number(angulo) * Math.PI / 180;
            resultado = (magA * magB * Math.cos(rad)).toFixed(4);
        } else {
            resultado = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0).toFixed(4);
        }

        document.getElementById('resultado').textContent = resultado;

        // Proyección de A sobre B
        const proy = calcularProyeccion(vectorA, vectorB);
        document.getElementById('proyeccion').textContent = `(${proy.join(', ')})`;

        // Mostrar gráfica correspondiente
        if (vectorA.length === 2) {
            document.getElementById('graficaVectores2D').style.display = "block";
            document.getElementById('graficaVectores3D').style.display = "none";
            graficarVectores2D(vectorA, vectorB, proy);
        } else {
            document.getElementById('graficaVectores2D').style.display = "none";
            document.getElementById('graficaVectores3D').style.display = "block";
            graficarVectores3D(vectorA, vectorB, proy);
        }
    } else {
        document.getElementById('resultado').textContent = "Por favor, ingresa vectores válidos (2 o 3 componentes)";
        document.getElementById('proyeccion').textContent = "Entrada inválida";
        document.getElementById('graficaVectores2D').style.display = "none";
        document.getElementById('graficaVectores3D').style.display = "none";
    }
}

function calcularProyeccion(A, B) {
    const producto = A.reduce((sum, val, i) => sum + val * B[i], 0);
    const magB2 = B.reduce((sum, val) => sum + val * val, 0);
    const escalar = producto / magB2;
    return B.map(val => (escalar * val).toFixed(2));
}

// === Gráfica 2D con Chart.js ===
function graficarVectores2D(A, B, proy) {
    const ctx = document.getElementById('canvas2D').getContext('2d');

    const datos = {
        datasets: [
            {
                label: 'Vector A',
                data: [{x: 0, y: 0}, {x: parseFloat(A[0]), y: parseFloat(A[1])}],
                borderColor: 'red',
                showLine: true,
                fill: false,
                tension: 0
            },
            {
                label: 'Vector B',
                data: [{x: 0, y: 0}, {x: parseFloat(B[0]), y: parseFloat(B[1])}],
                borderColor: 'blue',
                showLine: true,
                fill: false,
                tension: 0
            },
            {
                label: 'Proyección',
                data: [{x: 0, y: 0}, {x: parseFloat(proy[0]), y: parseFloat(proy[1])}],
                borderColor: 'green',
                showLine: true,
                fill: false,
                tension: 0
            }
        ]
    };

    if (grafica2D) grafica2D.destroy();

    grafica2D = new Chart(ctx, {
        type: 'scatter',
        data: datos,
        options: {
            scales: {
                x: { min: -10, max: 10 },
                y: { min: -10, max: 10 }
            }
        }
    });
}

// === Gráfica 3D con Plotly.js ===
function graficarVectores3D(A, B, proy) {
    const origen = { x: 0, y: 0, z: 0 };

    const vectorPlot = (nombre, vec, color) => ({
        type: 'scatter3d',
        mode: 'lines+markers',
        name: nombre,
        line: { width: 6, color },
        marker: { size: 4 },
        x: [origen.x, parseFloat(vec[0])],
        y: [origen.y, parseFloat(vec[1])],
        z: [origen.z, parseFloat(vec[2])],
    });

    const layout = {
        title: 'Gráfico de Vectores 3D',
        margin: { l: 0, r: 0, b: 0, t: 50 },
        scene: {
            xaxis: { title: 'X' },
            yaxis: { title: 'Y' },
            zaxis: { title: 'Z' }
        }
    };

    Plotly.newPlot('graficaVectores3D', [
        vectorPlot('Vector A', A, 'red'),
        vectorPlot('Vector B', B, 'blue'),
        vectorPlot('Proyección', proy, 'green')
    ], layout);
}
