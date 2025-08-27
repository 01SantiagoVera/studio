# Aptitude Aligner

Este es un proyecto de Next.js creado en Firebase Studio que ayuda a los usuarios a descubrir sus aptitudes profesionales y obtener recomendaciones personalizadas impulsadas por IA.

## Primeros Pasos

Para empezar, echa un vistazo al código fuente, comenzando por `src/app/page.tsx`.

### Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```

### Ejecutar el Proyecto Localmente

Para ejecutar el proyecto en tu entorno local, necesitarás tener dos terminales abiertas, ya que hay dos procesos que deben correr simultáneamente: el servidor de desarrollo de Next.js (para la interfaz de usuario) y el servidor de Genkit (para las funciones de inteligencia artificial).

1.  **En tu primera terminal**, ejecuta este comando para iniciar el servidor de Next.js:
    ```bash
    npm run dev
    ```
    Tu aplicación estará disponible en `http://localhost:9002`.

2.  **En tu segunda terminal**, ejecuta este comando para iniciar los flujos de Genkit que gestionan la IA:
    ```bash
    npm run genkit:dev
    ```

Ambos procesos necesitan permanecer en ejecución mientras desarrollas.