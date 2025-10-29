// Definición de las constantes de conversión 
const ROMAN_MAP = new Map([
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
]);

/**
 * Convierte un número arábigo a romano.
 * @param {number} arabic - Número entero entre 1 y 3999.
 * @returns {string} - Representación en números romanos.
 * @throws {Error} - Si el número está fuera del rango o no es un entero.
 */
function arabicToRoman(arabic) {
    if (typeof arabic !== 'number' || arabic <= 0 || arabic > 3999 || !Number.isInteger(arabic)) {
        throw new Error("El número debe ser un entero entre 1 y 3999.");
    }

    let roman = '';
    let num = arabic;
    for (const [value, symbol] of ROMAN_MAP.entries()) {
        while (num >= value) {
            roman += symbol;
            num -= value;
        }
    }
    return roman;
}

/**
 * Convierte un número romano a arábigo.
 * @param {string} roman - Cadena de texto que representa un número romano válido.
 * @returns {number} - El valor arábigo.
 * @throws {Error} - Si el formato del número romano es inválido.
 */
function romanToArabic(roman) {
    if (typeof roman !== 'string' || roman.length === 0) {
        throw new Error("La entrada debe ser una cadena de texto no vacía.");
    }
    
    const uppercaseRoman = roman.toUpperCase();
    const romanRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;
    if (!romanRegex.test(uppercaseRoman)) {
        throw new Error("El formato del número romano es inválido o excede el rango.");
    }

    const ROMAN_VALUES = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    };

    let arabic = 0;
    for (let i = 0; i < uppercaseRoman.length; i++) {
        const current = ROMAN_VALUES[uppercaseRoman[i]];
        const next = ROMAN_VALUES[uppercaseRoman[i + 1]];

        if (next < current) { // Esto es un error en la lógica anterior, lo corrijo aquí: next > current es la sustracción.
            arabic += current;
        } else if (next > current) {
            arabic += (next - current);
            i++; 
        } else {
            arabic += current;
        }
    }
    return arabic;
}

module.exports = {
    arabicToRoman,
    romanToArabic
};
