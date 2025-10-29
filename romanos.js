const express = require('express');
const app = express();

// Definición de las constantes de conversión (Necesario para las funciones)
const ROMAN_MAP = new Map([
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
]);

// Función de Conversión Arábigo a Romano (Implementación Corregida)
function arabicToRoman(arabic) {
    if (typeof arabic !== 'number' || arabic <= 0 || arabic > 3999 || !Number.isInteger(arabic)) {
        throw new Error("El número debe ser un entero entre 1 y 3999.");
    }

    let roman = '';
    for (const [value, symbol] of ROMAN_MAP.entries()) {
        while (arabic >= value) {
            roman += symbol;
            arabic -= value;
        }
    }
    return roman;
}

// Función de Conversión Romano a Arábigo (Implementación Corregida)
function romanToArabic(roman) {
    if (typeof roman !== 'string' || roman.length === 0) {
        throw new Error("La entrada debe ser una cadena de texto no vacía.");
    }
    
    // Regla de validación (Regex para asegurar que es un romano válido)
    const romanRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;
    if (!romanRegex.test(roman)) {
        throw new Error("El formato del número romano es inválido o excede el rango.");
    }

    const ROMAN_VALUES = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    };

    let arabic = 0;
    for (let i = 0; i < roman.length; i++) {
        const current = ROMAN_VALUES[roman[i]];
        const next = ROMAN_VALUES[roman[i + 1]];

        if (next > current) {
            arabic += (next - current);
            i++; 
        } else {
            arabic += current;
        }
    }
    return arabic;
}

// --- Endpoints de la API ---

// Endpoint raíz para dar la bienvenida y mostrar instrucciones (Vercel fix)
app.get('/', (req, res) => {
    res.status(200).json({
        message: "API de Conversión de Números Romanos",
        instructions: {
            arabic_to_roman: "/a2r?arabic=<numero_arabigo_entre_1_y_3999>",
            roman_to_arabic: "/r2a?roman=<numero_romano>"
        },
        info: "Accede a /a2r o /r2a con el parámetro de query correspondiente."
    });
});

// Endpoint para Arábigo a Romano
app.get('/a2r', (req, res) => {
    const arabic = parseInt(req.query.arabic, 10);
    
    // 1. Validar que es un número
    if (isNaN(arabic)) {
        return res.status(400).json({ error: "El parámetro 'arabic' debe ser un número." });
    }

    // 2. Ejecutar la conversión y manejar errores de rango/tipo
    try {
        const roman = arabicToRoman(arabic);
        res.status(200).json({ roman: roman });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Endpoint para Romano a Arábigo
app.get('/r2a', (req, res) => {
    const roman = req.query.roman ? req.query.roman.toUpperCase() : '';

    // 1. Validar que existe el parámetro
    if (!roman) {
        return res.status(400).json({ error: "El parámetro 'roman' no debe estar vacío." });
    }

    // 2. Ejecutar la conversión y manejar errores de formato/rango
    try {
        const arabic = romanToArabic(roman);
        res.status(200).json({ arabic: arabic });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});


// Estructura Vercel-Compatible:
// Si el archivo se ejecuta directamente (npm start), escucha en el puerto 3000.
// Si es importado (por Vercel), exporta 'app' para que Vercel lo gestione.

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running locally on http://localhost:${PORT}`);
    });
}

// ESTO ES LO CRUCIAL PARA VERCEL: Exportar la instancia de la aplicación
module.exports = app;
