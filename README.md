# Angular Dashboard (Taller de Aplicaciones en Internet) 🚀

Este proyecto es una aplicación frontend (SPA) moderna, rápida y escalable, desarrollada como parte oficial del curso **Taller de Aplicaciones en Internet**.

🌐 **Sitio Web del Curso:** [https://cody-apps-internet.vercel.app/](https://cody-apps-internet.vercel.app/)

---

## 🏗️ Arquitectura y Tecnologías
Este dashboard está construido siguiendo rigurosamente los principios de **Clean Code** y **Clean Architecture**, adoptando una estructura modular guiada por dominio (Feature-Driven Architecture). 

Utiliza la tecnología más vanguardista del ecosistema Angular:

* **Angular 21**: Aprovechando las últimas bondades del framework (Standalone Components).
* **Zoneless**: No incluye `zone.js`. Utiliza el motor nativo de reactividad de Angular para una detección de cambios híper rápida y eficiente.
* **Signals**: Toda la reactividad y el manejo de estado global (como el módulo de tareas) está controlado 100% mediante Signals, eliminando dependencias de terceros como NgRx.
* **PrimeNG**: Biblioteca robusta de componentes de interfaz de usuario (Tablas, Diálogos, Notificaciones).
* **Tailwind CSS**: Framework de CSS utilitario para maquetación ágil, temas oscuros y diseños responsive (TailAdmin UI).
* **Alias de Rutas (Path Aliases)**: Evita el infierno de directorios (`../../`) usando referencias limpias como `@core`, `@features`, `@shared`.
* **Variables de Entorno**: Listo para producción, con URLs de API y configuraciones separadas por entorno.

---

## 📂 Estructura de Directorios

El proyecto sigue una estructura **Feature-Driven**:
```text
src/
 ├── app/
 │   ├── core/         # Servicios globales (AuthService), Guards, Interceptores (JWT)
 │   ├── features/     # Módulos de dominio (Cada uno es independiente)
 │   │   ├── auth/         # Login, Registro
 │   │   ├── cart/         # Carrito de compras
 │   │   ├── dashboard/    # Panel principal
 │   │   ├── categories/   # CRUD de Categorías
 │   │   ├── products/     # CRUD de Productos
 │   │   └── tasks/        # Gestión de Tareas (Ejemplo maestro con Signals)
 │   └── shared/       # Componentes reutilizables, directivas y pipes
 └── environments/ # Variables de entorno (desarrollo y producción)
```

---

## 💻 Requisitos Previos

Asegúrate de tener instalados los siguientes programas en tu entorno de desarrollo:
- [Node.js](https://nodejs.org/) (Recomendado: Versión LTS 20 o superior)
- npm (Viene incluido con Node.js)
- [Angular CLI](https://github.com/angular/angular-cli) (Recomendado instalarlo globalmente: `npm install -g @angular/cli`)

---

## 🛠️ Instalación y Configuración

1. **Clonar e Ingresar al directorio:**
   ```bash
   # Asegúrate de estar en el directorio correcto
   cd angular-dashboard
   ```

2. **Instalar Dependencias:**
   Ejecuta el siguiente comando para descargar todos los paquetes y librerías declarados en el `package.json`.
   ```bash
   npm install
   ```

3. **Configurar el Backend (API REST):**
   Por defecto, la aplicación en entorno de desarrollo espera que la API funcione en `http://localhost:8000/api/v1`. 
   Si deseas modificar este endpoint, edita el archivo:
   `src/environments/environment.ts`

4. **Ejecutar en modo Desarrollo:**
   ```bash
   npm start
   ```
   *El comando compilará la aplicación y levantará un servidor local (por defecto en `http://localhost:4200/`). La aplicación se recargará automáticamente al modificar algún archivo.*

---

## 🚀 Despliegue a Producción

Para compilar la aplicación para producción (generará archivos estáticos ultra-optimizados y utilizará el entorno de `environment.prod.ts`):

```bash
npm run build
```

Los archivos resultantes se colocarán en el directorio `dist/`. Esos archivos son los que deberás subir a tu servidor web, bucket de S3 o plataformas como Vercel/Netlify.

---
*Módulo 03 - Desarrollo Frontend Avanzado con Angular*
