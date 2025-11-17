const express = require('express');
const cors = require('cors');

const app = express();

// Importar la lógica de conversión desde el módulo local
const { arabicToRoman, romanToArabic } = require('./converter'); 

// --- Middleware (Configuración CORS Simple) ---
// El uso simple de cors() es suficiente y necesario para el entorno.
app.use(cors());

app.use(express.json()); 

// Endpoint para la raíz (Interfaz de usuario simple)
app.get('/', (req, res) => {
    // HTML para una pequeña interfaz de prueba con los colores pastel solicitados
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Convertidor Árabigo ↔ Romano | Pastel</title>
            <style>
                /* Estilos Generales y Layout */
                body { 
                    font-family: 'Inter', sans-serif; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    min-height: 100vh; 
                    margin: 0; 
                    background-color: #f3f0ff; /* Fondo lila muy claro (pastel) */
                    color: #333; 
                }
                .container { 
                    display: flex; 
                    flex-direction: row; 
                    gap: 30px; 
                    padding: 30px; 
                    flex-wrap: wrap; 
                    justify-content: center;
                }
                .card { 
                    /* Aseguramos que las tarjetas tengan un tamaño fijo para ser rectangulares e iguales */
                    width: 350px; 
                    min-height: 380px; /* Altura mínima para igualar ambas tarjetas */
                    background: #ffffff; 
                    padding: 40px 30px; 
                    border-radius: 12px; 
                    box-shadow: 0 8px 15px rgba(168, 144, 245, 0.2); /* Sombra con el color lila */
                    text-align: center; 
                    border: 1px solid #e0e0e0;
                    box-sizing: border-box; /* Importante para que padding no afecte el ancho total */
                }
                h1 { 
                    color: #a890f5; /* Título principal en lila pastel */
                    margin-bottom: 5px; 
                    font-size: 26px;
                }
                h3 {
                    color: #6a53b5; /* Subtítulo lila oscuro */
                    margin-top: 0;
                }
                p { 
                    color: #777; 
                    margin-bottom: 30px; 
                    font-size: 15px;
                }

                /* Campos de entrada y Botones */
                input[type="text"] { 
                    width: 100%; 
                    padding: 12px; 
                    margin-bottom: 20px; 
                    border: 1px solid #dcdcdc; 
                    border-radius: 8px; 
                    box-sizing: border-box; 
                    background-color: #fff;
                    color: #333;
                    transition: border-color 0.3s;
                }
                input[type="text"]:focus {
                    border-color: #a890f5; /* Borde de enfoque lila */
                    outline: none;
                }
                
                button { 
                    width: 100%; 
                    padding: 14px; 
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer; 
                    font-size: 17px; 
                    font-weight: bold; 
                    transition: background-color 0.3s, box-shadow 0.3s; 
                    color: white; 
                    background-color: #79d2a3; /* Botón en verde esmeralda pastel */
                    box-shadow: 0 4px 0 #5fba87; /* Sombra inferior */
                }
                button:active {
                    transform: translateY(2px);
                    box-shadow: 0 2px 0 #5fba87;
                }
                button:hover { 
                    background-color: #68c091; /* Verde esmeralda ligeramente más oscuro al pasar el ratón */
                }

                /* Caja de Respuesta */
                .response-box { 
                    margin-top: 20px; 
                    padding: 15px; 
                    border-radius: 8px; 
                    min-height: 20px; 
                    word-wrap: break-word; 
                    font-weight: bold;
                    text-align: left;
                    font-size: 14px;
                    border-left: 5px solid; /* Borde de color para status */
                }
                /* Estilos para Respuesta OK (Verde) */
                .response-box[style*="e6ffe6"] { 
                    background-color: #f0fff0; 
                    border-color: #79d2a3; /* Verde pastel en el borde */
                    color: #4a9e70;
                }
                /* Estilos para Respuesta Error (Lila/Rojo) */
                .response-box[style*="ffe6e6"] { 
                    background-color: #fff0f0; 
                    border-color: #e74c3c;
                    color: #c0392b;
                }
            </style>
            <script>
                async function convert(endpoint, inputId, outputId) {
                    const input = document.getElementById(inputId).value;
                    const outputElement = document.getElementById(outputId);
                    
                    let url = endpoint;
                    if (endpoint === '/a2r') {
                        url += '?arabic=' + encodeURIComponent(input);
                    } else if (endpoint === '/r2a') {
                        url += '?roman=' + encodeURIComponent(input);
                    }

                    try {
                        const response = await fetch(url);
                        const data = await response.json();

                        if (response.status === 200) {
                            if (data.roman) {
                                outputElement.innerHTML = \`**Romano:** \${data.roman}\`;
                            } else if (data.arabic) {
                                outputElement.innerHTML = \`**Arábigo:** \${data.arabic}\`;
                            }
                            // Usamos el style attribute para que CSS lo detecte
                            outputElement.setAttribute('style', 'background-color: #e6ffe6; border-color: #4CAF50;');
                        } else if (response.status === 400) {
                            outputElement.innerHTML = \`**Error:** \${data.error}\`;
                            outputElement.setAttribute('style', 'background-color: #ffe6e6; border-color: #f44336;');
                        } else {
                            outputElement.innerHTML = 'Error desconocido en la API.';
                            outputElement.setAttribute('style', 'background-color: #ffdddd; border-color: #ff0000;');
                        }
                    } catch (error) {
                        outputElement.innerHTML = \`Error de conexión: \${error.message}\`;
                        outputElement.setAttribute('style', 'background-color: #ffdddd; border-color: #ff0000;');
                    }
                }
            </script>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <h1>Convertidor Árabigo ↔ Romano</h1>
                    <p>Utilizando los endpoints de la API REST.</p>
                    <div class="a2r">
                        <h3>Conversión: Árabigo a Romano</h3>
                        <input type="text" id="arabicInput" placeholder="Introduce un número (1-3999)">
                        <button onclick="convert('/a2r', 'arabicInput', 'romanOutput')">Convertir a Romano</button>
                        <div id="romanOutput" class="response-box">Esperando entrada...</div>
                    </div>
                </div>
                <div class="card">
                    <div class="r2a">
                        <h3>Conversión: Romano a Arábigo</h3>
                        <input type="text" id="romanInput" placeholder="INTRODUCE UN NÚMERO ROMANO (EJ: MCMXCIV)">
                        <button onclick="convert('/r2a', 'romanInput', 'arabicOutput')">Convertir a Arábigo</button>
                        <div id="arabicOutput" class="response-box">Esperando entrada...</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Endpoint para convertir Árabigo a Romano
app.get('/a2r', (req, res) => {
    // 1. Obtener el valor como string
    const arabicString = req.query.arabic;

    // 2. Validación estricta: si no es un string de dígitos, forzar el error de formato
    if (arabicString !== undefined && !/^\d+$/.test(arabicString)) {
         return res.status(400).json({ error: "El número debe ser un entero entre 1 y 3999." });
    }

    // 3. Si pasó la validación de formato (o si el parámetro está ausente), convertir a entero
    const num = parseInt(arabicString); 
    
    try {
        const roman = arabicToRoman(num);
        res.status(200).json({ roman });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Endpoint para convertir Romano a Arábigo
app.get('/r2a', (req, res) => {
    // Si el parámetro 'roman' no existe, usamos un string vacío, el cual será validado en converter.js
    const roman = req.query.roman || '';
    
    try {
        // Se llama a romanToArabic directamente con la entrada original.
        const arabic = romanToArabic(roman);
        res.status(200).json({ arabic });
    } catch (e) {
        // Captura el error de validación y devuelve el mensaje EXACTO de converter.js con status 400
        res.status(400).json({ error: e.message });
    }
});
// Exportar la instancia de Express
module.exports = app;
