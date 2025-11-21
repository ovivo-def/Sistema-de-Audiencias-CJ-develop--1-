# Sistema de Reproducción de Audiencias - Backend

Este proyecto es el backend para el Sistema de Reproducción de Audiencias, diseñado para gestionar archivos multimedia y facilitar su búsqueda y reproducción.

## Tecnologías Utilizadas

- Node.js
- Express
- FFmpeg para la conversión de videos
- Axios para solicitudes HTTP

## Configuración

Para ejecutar este proyecto, necesitarás Node.js y NPM instalados en tu sistema.

1. Clona este repositorio:
git clone https://github.com/oe-vivo/audienciasCJ_api

2. Instala las dependencias:
npm install

3. Configura las variables de entorno necesarias en un archivo `.env`:
PORT=3000
BASE_URL=http://localhost:3000/
CACHE_DIR=<ruta-al-directorio-de-cache>

4. Inicia el servidor:
npm start

## Endpoints

- `/buscar`: Busca archivos por nombre.
- `/contenido-carpeta`: Muestra el contenido de una carpeta específica.
- `/ver-archivo`: Permite acceder a un archivo y lo convierte a formato compatible si es necesario.

