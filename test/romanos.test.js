const request = require('supertest');
const app = require('../romanos'); // Importa la aplicación Express
const { arabicToRoman, romanToArabic } = require('../converter'); // Importa la lógica pura

// --- PRUEBAS UNITARIAS (Lógica Pura: converter.js) ---

describe('Funciones de Conversión', () => {

    // --- Prueba Unitaria: Árabigo a Romano (arabicToRoman) ---
    describe('arabicToRoman', () => {
        test('Debe convertir números básicos correctamente', () => {
            expect(arabicToRoman(1)).toBe('I');
            expect(arabicToRoman(10)).toBe('X');
            expect(arabicToRoman(50)).toBe('L');
            expect(arabicToRoman(100)).toBe('C');
        });

        test('Debe manejar números complejos y subtracciones', () => {
            expect(arabicToRoman(4)).toBe('IV');
            expect(arabicToRoman(9)).toBe('IX');
            expect(arabicToRoman(49)).toBe('XLIX');
            expect(arabicToRoman(1994)).toBe('MCMXCIV');
        });

        test('Debe manejar el límite superior (3999)', () => {
            expect(arabicToRoman(3999)).toBe('MMMCMXCIX');
        });

        // ✅ CORRECCIÓN: Prueba que la función LANCE un error (throw)
        test('Debe lanzar un error para el número 0', () => {
            expect(() => arabicToRoman(0)).toThrow('El número debe ser un entero entre 1 y 3999.');
        });
        
        // ✅ CORRECCIÓN: Prueba que la función LANCE un error (throw)
        test('Debe lanzar un error para números fuera de rango (4000+)', () => {
            expect(() => arabicToRoman(4000)).toThrow('El número debe ser un entero entre 1 y 3999.');
        });
    });

    // --- Prueba Unitaria: Romano a Arábigo (romanToArabic) ---
    describe('romanToArabic', () => {
        test('Debe convertir romanos básicos correctamente', () => {
            expect(romanToArabic('I')).toBe(1);
            expect(romanToArabic('X')).toBe(10);
            expect(romanToArabic('MMM')).toBe(3000);
        });

        test('Debe manejar subtracciones y combinaciones', () => {
            expect(romanToArabic('IV')).toBe(4);
            expect(romanToArabic('XLIX')).toBe(49);
            expect(romanToArabic('MCMXCIV')).toBe(1994);
        });
        
        // ✅ CORRECCIÓN: Prueba que la función LANCE un error (throw)
        test('Debe rechazar entrada inválida (caracteres no romanos)', () => {
            expect(() => romanToArabic('IXZ')).toThrow('El formato del número romano es inválido o excede el rango.');
        });

        // ✅ CORRECCIÓN: Prueba que la función LANCE un error (throw)
        test('Debe rechazar entrada con patrón no permitido (ej: IIII)', () => {
            expect(() => romanToArabic('IIII')).toThrow('El formato del número romano es inválido o excede el rango.');
        });
    });
});


// --- PRUEBAS DE INTEGRACIÓN (Endpoints de la API con Supertest) ---

describe('API Endpoints de Conversión (Integración)', () => {

    // --- Prueba de Integración: GET /a2r (Arábigo a Romano) ---
    describe('GET /a2r', () => {
        test('Debe devolver 200 y la conversión correcta para 10', async () => {
            const response = await request(app).get('/a2r?arabic=10');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ roman: 'X' });
        });

        test('Debe devolver 400 para un valor fuera de rango', async () => {
            const response = await request(app).get('/a2r?arabic=4000');
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        test('Debe devolver 400 si el parámetro arabic está ausente', async () => {
            const response = await request(app).get('/a2r');
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    // --- Prueba de Integración: GET /r2a (Romano a Arábigo) ---
    describe('GET /r2a', () => {
        test('Debe devolver 200 y la conversión correcta para MCMXCIV', async () => {
            const response = await request(app).get('/r2a?roman=MCMXCIV');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ arabic: 1994 });
        });

        test('Debe devolver 400 para un formato romano inválido', async () => {
            const response = await request(app).get('/r2a?roman=IIII'); // Patrón no permitido
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        test('Debe devolver 400 si el parámetro roman está ausente', async () => {
            const response = await request(app).get('/r2a');
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
});
