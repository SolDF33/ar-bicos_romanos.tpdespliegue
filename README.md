# 🚀 TP Final: API Conversora de Números Romanos y Arábigos

Este proyecto implementa una **API REST** utilizando Node.js y Express para la conversión bidireccional entre números arábigos (enteros de 1 a 3999) y números romanos.

El proyecto incluye **tests unitarios** y un flujo de **Integración/Despliegue Continuo (CI/CD)** a través de GitHub Actions.

***

## 🌐 Endpoints de la API

La API expone dos endpoints principales (se asume que el dominio base es el provisto por Vercel, ej: `https://[app-name].vercel.app`):

| Método | Endpoint | Descripción | Parámetros Requeridos |
| :--- | :--- | :--- | :--- |
| **GET** | `/a2r` | Convierte un número arábigo a romano. | `?arabic=VALOR` |
| **GET** | `/r2a` | Convierte un número romano a arábigo. | `?roman=VALOR` |

### Ejemplos de Uso:

| Conversión | URL de Ejemplo | Resultado (JSON) |
| :--- | :--- | :--- |
| **1994 a Romano** | `/a2r?arabic=1994` | `{ "roman": "MCMXCIV" }` |
| **XXXVI a Arábigo** | `/r2a?roman=XXXVI` | `{ "arabic": 36 }` |

***

## ⚙️ Instalación y Uso Local

Para poner la API en funcionamiento en tu máquina local:

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/Despliegue-I-2025/numeros-romanos-SolDF33](https://github.com/Despliegue-I-2025/numeros-romanos-SolDF33)
    cd numeros-romanos-SolDF33
    ```
2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
3.  **Ejecutar la API Localmente:**
    ```bash
    npm start
    ```
    La API estará disponible en `http://localhost:3000`.

***

## 🧪 Pruebas Unitarias y de Integración (Jest & Supertest)

El proyecto utiliza **Jest** para ejecutar tests unitarios sobre las funciones de conversión (`arabicToRoman` y `romanToArabic`) y **Supertest** para realizar pruebas de integración directamente sobre los endpoints de la API (`/a2r` y `/r2a`), verificando códigos de estado y respuestas JSON.

### Ejecutar Tests:

```bash
# Ejecuta todos los tests y genera un reporte de cobertura
npm test