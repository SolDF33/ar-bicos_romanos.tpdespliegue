// Importamos Express para crear la API
const express = require('express');
const app = express();
const port = 3000;

// --- Funciones de Conversión ---

/**
 * Convierte un número arábigo (1 a 3999) a romano.
 * @param {number} arabicNumber - El número arábigo.
 * @returns {string} El número romano o un mensaje de error.
 */
function arabicToRoman(arabicNumber) {
    // 1. Manejo de rango y validación
    if (arabicNumber < 1 || arabicNumber > 3999) {
        return 'El número debe estar entre 1 y 3999.';
    }

    // 2. Mapa de valores (clave para la conversión eficiente)
    const map = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
        [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];

    let result = '';
    let num = arabicNumber;

    // 3. Algoritmo greedy: Restar el valor más grande posible
    for (const [value, symbol] of map) {
        while (num >= value) {
            result += symbol;
            num -= value;
        }
    }

    return result;
}

/**
 * Convierte un número romano a arábigo.
 * Se utiliza una expresión regular para la validación estricta de formato romano.
 * @param {string} romanNumber - El número romano (ej: 'MCMXCIV').
 * @returns {number|string} El número arábigo o un mensaje de error.
 */
function romanToArabic(romanNumber) {
    if (!romanNumber || typeof romanNumber !== 'string') {
        return 'Formato romano inválido.';
    }

    const roman = romanNumber.toUpperCase();

    // Expresión regular que valida la sintaxis romana (hasta 3999, rechazando patrones como IIII, VX, etc.)
    const romanRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

    if (!romanRegex.test(roman)) {
        return 'Formato romano inválido.';
    }

    // Mapa de valores individuales
    const map = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    };

    let result = 0;

    // Iterar sobre la cadena, verificando la regla de sustracción
    for (let i = 0; i < roman.length; i++) {
        const currentVal = map[roman[i]];
        const nextVal = map[roman[i + 1]];

        // Regla de substracción: Si el valor actual es menor que el siguiente (ej: I antes de V)
        if (nextVal && currentVal < nextVal) {
            result += nextVal - currentVal;
            i++; // Saltar el siguiente carácter, ya que se procesó en esta iteración.
        } else {
            result += currentVal;
        }
    }

    return result;
}

// --- API Endpoints con Express ---

// Conversión Arábigo a Romano (Endpoint /a2r)
app.get('/a2r', (req, res) => {
    // 1. Intenta convertir el parámetro de string a número
    const arabic = parseInt(req.query.arabic);

    // 2. Validación de presencia y formato
    if (isNaN(arabic) || req.query.arabic === undefined) {
        return res.status(400).send({ error: 'Parámetro "arabic" es requerido y debe ser un número.' });
    }

    // 3. Llamada a la lógica central
    const roman = arabicToRoman(arabic);

    // 4. Manejo de error de rango (retornado por arabicToRoman)
    if (typeof roman === 'string' && roman.includes('debe estar entre')) {
        return res.status(400).send({ error: roman });
    }

    // 5. Respuesta exitosa
    return res.status(200).send({ roman: roman });
});

// Conversión Romano a Arábigo (Endpoint /r2a)
app.get('/r2a', (req, res) => {
    const roman = req.query.roman;

    // 1. Validación de presencia
    if (!roman) {
        return res.status(400).send({ error: 'Parámetro "roman" es requerido.' });
    }

    // 2. Llamada a la lógica central
    const arabic = romanToArabic(roman);

    // 3. Manejo de error de formato (retornado por romanToArabic)
    if (typeof arabic === 'string' && arabic.includes('inválido')) {
        return res.status(400).send({ error: arabic });
    }

    // 4. Respuesta exitosa
    return res.status(200).send({ arabic: arabic });
});

// Para propósitos de testing, exportamos la app y las funciones
module.exports = { app, arabicToRoman, romanToArabic };

// Iniciar el servidor (solo si el script se ejecuta directamente, no durante los tests)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Servidor de números romanos corriendo en http://localhost:${port}`);
    });
}
