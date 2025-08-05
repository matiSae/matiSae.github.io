function calcularProductoPunto() {
    const vectorA = document.getElementById('vectorA').value.split(',').map(Number);
    const vectorB = document.getElementById('vectorB').value.split(',').map(Number);
    const angulo = document.getElementById('angulo').value;

    if (
        vectorA.length === vectorB.length &&
        vectorA.every(n => !isNaN(n)) &&
        vectorB.every(n => !isNaN(n))
    ) {
        let resultado = 0;
        if (angulo) {
            const magnitudA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
            const magnitudB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
            const radianes = Number(angulo) * Math.PI / 180;
            resultado = (magnitudA * magnitudB * Math.cos(radianes)).toFixed(4);
        } else {
            for (let i = 0; i < vectorA.length; i++) {
                resultado += vectorA[i] * vectorB[i];
            }
        }
        document.getElementById('resultado').textContent = resultado;

        const proy = calcularProyeccion(vectorA, vectorB);
        document.getElementById('proyeccion').textContent = `(${proy.join(', ')})`;

        graficarVectores(vectorA, vectorB, proy);
    } else {
        document.getElementById('resultado').textContent = "Por favor, ingresa vectores válidos";
        document.getElementById('proyeccion').textContent = "";
        Plotly.purge('graficaVectores');
    }
}

function calcularProyeccion(A, B) {
    const producto = A.reduce((sum, val, i) => sum + val * B[i], 0);
    const magB2 = B.reduce((sum, val) => sum + val * val, 0);
    const escalar = producto / magB2;
    return B.map(val => parseFloat((escalar * val).toFixed(2)));
}

function graficarVectores(A, B, proyAB) {
    const norm = v => Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
    const maxLength = Math.max(norm(A), norm(B), norm(proyAB));

    const colores = {
        A: 'blue',
        B: 'green',
        Proy: 'red'
    };

    const vectorData = (vec, color, nombre) => ([
        // Línea del vector
        {
            type: 'scatter3d',
            mode: 'lines',
            line: { width: 6, color: color },
            x: [0, vec[0]],
            y: [0, vec[1]],
            z: [0, vec[2]],
            name: nombre
        },
        // Flecha (cono) al final
        {
            type: 'cone',
            x: [vec[0]],
            y: [vec[1]],
            z: [vec[2]],
            u: [vec[0]],
            v: [vec[1]],
            w: [vec[2]],
            anchor: 'tip',  // el cono termina justo en el punto final del vector
            sizemode: 'absolute',
            sizeref: maxLength / 10,
            colorscale: [[0, color], [1, color]],
            showscale: false
        }
    ]);

    const data = [
        ...vectorData(A, colores.A, 'Vector A'),
        ...vectorData(B, colores.B, 'Vector B'),
        ...vectorData(proyAB, colores.Proy, 'Proyección A sobre B')
    ];

    const layout = {
        scene: {
            aspectmode: 'cube',
            xaxis: { title: 'X', range: [-maxLength, maxLength] },
            yaxis: { title: 'Y', range: [-maxLength, maxLength] },
            zaxis: { title: 'Z', range: [-maxLength, maxLength] }
        },
        margin: { l: 0, r: 0, b: 0, t: 0 }
    };

    Plotly.newPlot('graficaVectores', data, layout);
}





