# Aptitude Aligner

Este es un proyecto de Next.js creado en Firebase Studio que ayuda a los usuarios a descubrir sus aptitudes profesionales y obtener recomendaciones personalizadas impulsadas por IA.

## Primeros Pasos

Para empezar, echa un vistazo al código fuente, comenzando por `src/app/page.tsx`.

### Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación y Ejecución

1.  **Instala las dependencias:** Antes que nada, abre una terminal en la raíz del proyecto y ejecuta el siguiente comando para instalar todas las librerías necesarias. Este es un paso crucial.
    ```bash
    npm install
    ```

2.  **Ejecuta los servidores de desarrollo:** Una vez instaladas las dependencias, necesitarás tener **dos terminales abiertas** para ejecutar la aplicación, ya que hay dos procesos que deben correr simultáneamente.

    -   **En tu primera terminal**, inicia el servidor de Next.js para la interfaz de usuario:
        ```bash
        npm run dev
        ```

    -   **En tu segunda terminal**, inicia los flujos de Genkit para las funciones de IA:
        ```bash
        npm run genkit:dev
        ```

3.  **Abre la aplicación:** Tu aplicación estará disponible en `http://localhost:9002`. Ambos procesos en las terminales deben permanecer en ejecución mientras desarrollas.
