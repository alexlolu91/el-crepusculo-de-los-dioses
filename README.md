# Mi Cómic 📖

Lector de cómic web, **estático** y **responsive**. No tiene dependencias ni
proceso de compilación: son solo archivos HTML/CSS/JS que se suben tal cual y
funcionan en cualquier navegador moderno.

---

## Índice

1. [Cómo funciona la web (explicación completa)](#1-cómo-funciona-la-web-explicación-completa)
2. [Controles para el lector](#2-controles-para-el-lector)
3. [Añadir páginas y capítulos (paso a paso)](#3-añadir-páginas-y-capítulos-paso-a-paso)
4. [Formatos de imagen compatibles](#4-formatos-de-imagen-compatibles)
5. [Probar en local](#5-probar-en-local)
6. [Desplegar online](#6-desplegar-online)
7. [Estructura de archivos](#7-estructura-de-archivos)
8. [Preguntas frecuentes](#8-preguntas-frecuentes)

---

## 1. Cómo funciona la web (explicación completa)

La web está formada por cuatro piezas:

| Archivo | Para qué sirve | ¿Lo tocas tú? |
|---|---|---|
| `index.html` | La estructura de la página (barra superior, zona de lectura). | No |
| `css/styles.css` | El aspecto: colores, tamaños, animación. | Solo si quieres cambiar el diseño |
| `js/chapters.js` | **La lista de tus capítulos y páginas.** | **Sí, este es el tuyo** |
| `js/reader.js` | El "motor" del lector (navegación, modos, gestos…). | No |

### Qué hace el lector por dentro

Cuando abres la web, `reader.js` realiza estos pasos:

1. **Lee tu configuración** de `js/chapters.js` (el objeto `COMIC`).
2. **Rellena el selector de capítulos** de la barra superior con la lista que
   hayas definido.
3. **Decide el modo de visualización** según el tamaño de la pantalla:
   - **Doble página** (dos páginas lado a lado, como un cómic abierto) si la
     pantalla es ancha y está en horizontal (≥ 900 px de ancho y más ancha que
     alta).
   - **Una sola página** en móviles, tablets en vertical o ventanas estrechas.
   - Si giras el móvil o cambias el tamaño de la ventana, **cambia de modo solo**
     y mantiene la página por la que ibas.
4. **Agrupa las páginas** para el modo doble. Si en `chapters.js` tienes
   `firstPageAlone: true`, la **portada se muestra sola** (igual que un cómic
   real, donde la portada abre por la derecha) y a partir de ahí empareja las
   páginas de dos en dos.
5. **Muestra las páginas** ajustándolas al alto disponible sin recortar nada
   (se ve la página entera siempre).
6. **Precarga** la página anterior y la siguiente para que el pase sea
   instantáneo.
7. **Guarda tu progreso** (capítulo y página) en el navegador. La próxima vez
   que entres, **retoma justo donde lo dejaste**.

### El pase de página

Al avanzar o retroceder, la nueva página entra con una **animación suave** de
desplazamiento. Si tu sistema operativo tiene activado *"reducir movimiento"*
(opción de accesibilidad), la animación se desactiva automáticamente y el cambio
es instantáneo, estilo Kindle.

### Navegación entre capítulos

Las flechas pasan **página a página**. Cuando llegas a la **última página de un
capítulo**, la flecha derecha **salta automáticamente al siguiente capítulo**; y
en la **primera página**, la flecha izquierda vuelve al capítulo anterior. Para
ir directamente a un capítulo concreto, usa el **selector de la barra superior**.

### Dirección de lectura

Soporta cómic occidental (izquierda → derecha) y **manga** (derecha → izquierda).
Se cambia con una sola línea en `chapters.js` (`readingDirection`). En modo manga
se invierten tanto el orden de las dos páginas como las flechas y los gestos.

---

## 2. Controles para el lector

| Acción | Cómo |
|---|---|
| Página siguiente | Flecha **›**, clic en la **mitad derecha**, tecla **→**, **AvPág**, **barra espaciadora**, o **deslizar a la izquierda** (táctil) |
| Página anterior | Flecha **‹**, clic en la **mitad izquierda**, tecla **←**, **RePág**, o **deslizar a la derecha** (táctil) |
| Cambiar de capítulo | **Selector** de la barra superior |
| Ir al principio del capítulo | Tecla **Inicio** (Home) |
| Ir al final del capítulo | Tecla **Fin** (End) |
| Pantalla completa | Botón **⛶** de la barra, o tecla **F** |

> En manga (`rtl`) las teclas ← → y los gestos se invierten para que sean
> coherentes con el sentido de lectura.

---

## 3. Añadir páginas y capítulos (paso a paso)

Todo se hace en **`js/chapters.js`**. No necesitas saber programar.

### Paso 1 — Coloca las imágenes

Crea una carpeta para cada capítulo dentro de `pages/` y mete ahí las imágenes.
Por ejemplo:

```
pages/
├── cap-01/
│   ├── 01.webp
│   ├── 02.webp
│   └── 03.webp
└── cap-02/
    ├── 01.webp
    └── 02.webp
```

> **Consejo:** nombra los archivos con ceros delante (`01`, `02`, … `10`, `11`)
> para que el orden sea fácil de mantener.

### Paso 2 — Edita `js/chapters.js`

El archivo contiene un objeto llamado `COMIC`. Tiene esta forma:

```js
const COMIC = {
  title: "Mi Cómic",          // Nombre que aparece en la pestaña y la barra
  readingDirection: "ltr",     // "ltr" = normal · "rtl" = manga
  firstPageAlone: true,        // true = la portada se muestra sola

  chapters: [
    {
      id: "cap-01",                       // identificador único (sin espacios)
      title: "Capítulo 1 — El comienzo",  // texto que aparece en el selector
      pages: [                            // lista de páginas EN ORDEN
        "pages/cap-01/01.webp",
        "pages/cap-01/02.webp",
        "pages/cap-01/03.webp"
      ]
    }
  ]
};
```

### Paso 3 — Añadir un capítulo nuevo

Copia un bloque de capítulo entero (desde `{` hasta `}`), pégalo dentro de
`chapters` **separado por una coma**, y cambia el `id`, el `title` y la lista de
`pages`:

```js
  chapters: [
    {
      id: "cap-01",
      title: "Capítulo 1 — El comienzo",
      pages: [ "pages/cap-01/01.webp", "pages/cap-01/02.webp" ]
    },                                    // ← coma entre capítulos
    {
      id: "cap-02",
      title: "Capítulo 2 — La aventura continúa",
      pages: [ "pages/cap-02/01.webp", "pages/cap-02/02.webp" ]
    }
  ]
```

### Paso 4 — Añadir páginas a un capítulo existente

Solo tienes que añadir más líneas a su lista `pages` (cada una entre comillas y
separada por comas), respetando el orden de lectura:

```js
      pages: [
        "pages/cap-01/01.webp",
        "pages/cap-01/02.webp",
        "pages/cap-01/03.webp",
        "pages/cap-01/04.webp"   // ← página nueva (la última no lleva coma)
      ]
```

### Reglas importantes (para que no falle)

- Cada ruta va **entre comillas dobles** `"..."`.
- Los elementos de una lista se separan con **comas**, pero **el último no
  lleva coma**.
- La **ruta debe coincidir exactamente** con el archivo, incluidas mayúsculas y
  extensión (`Pagina01.JPG` ≠ `pagina01.jpg`).
- Si una imagen no se encuentra, el lector lo avisa en pantalla mostrando la ruta
  que falla, para que sea fácil corregirla.

> Las imágenes `.svg` que vienen ahora son **placeholders** de ejemplo.
> Bórralas y pon las tuyas cuando las tengas.

---

## 4. Formatos de imagen compatibles

Como el lector usa imágenes normales del navegador, **vale cualquier formato que
el navegador sepa mostrar**. Los habituales:

| Formato | Extensión | Recomendado para cómic | Notas |
|---|---|---|---|
| **WebP** | `.webp` | ⭐ **El mejor** | Mucha calidad y poco peso. Primera opción. |
| **AVIF** | `.avif` | ⭐ Excelente | Aún menos peso que WebP. Soportado en navegadores actuales. |
| **JPEG** | `.jpg` / `.jpeg` | ✅ Muy buena | Ideal para dibujo/escaneo a color. No admite transparencia. |
| **PNG** | `.png` | ✅ Buena | Mejor para líneas/texto nítido o transparencia, pero pesa más. |
| **GIF** | `.gif` | ⚠️ Solo si lo necesitas | Admite animación, pero poca calidad de color. |
| **SVG** | `.svg` | ◽ Casos especiales | Solo si tu cómic es vectorial. Es lo que usan los placeholders. |
| **APNG** | `.apng` / `.png` | ◽ Raro | PNG animado, soporte variable. |
| **BMP** | `.bmp` | ❌ No recomendado | Funciona, pero pesa muchísimo. |

**Recomendación:** usa **WebP** (o **AVIF**) para que la web cargue rápida.
Puedes mezclar formatos sin problema (un capítulo en `.jpg` y otro en `.webp`).

### Tamaño recomendado de las imágenes

- **Alto:** ~1600 px es más que suficiente. Más grande no se aprecia y pesa más.
- **Proporción:** mantén la **misma proporción en todas las páginas** para que se
  vean uniformes (especialmente en modo doble página).
- **Peso por página:** intenta que ronde 150–400 KB en WebP/JPG.

---

## 5. Probar en local

Funciona abriendo `index.html` directamente, pero como carga imágenes desde
carpetas, lo más fiable es servirlo con un servidor local:

```powershell
# Con Python (incluido en Windows si instalaste Python)
python -m http.server 8000
# luego abre http://localhost:8000
```

También sirve la extensión **Live Server** de VS Code, o simplemente subirlo a
Vercel y verlo online.

---

## 6. Desplegar online

Guía completa paso a paso en **[`DEPLOY.md`](DEPLOY.md)**. En resumen:

1. Sube esta carpeta a un repositorio de **GitHub**.
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el repo.
3. Framework Preset: **Other**. Sin build ni output directory.
4. **Deploy.** Cada `git push` actualiza la web automáticamente.

El archivo `vercel.json` ya configura URLs limpias y la caché de las imágenes.
Incluye también instrucciones para usar **Cloudflare** (dominio propio o
Cloudflare Pages como alternativa).

---

## 7. Estructura de archivos

```
Comic/
├── index.html          ← la página (estructura)
├── css/
│   └── styles.css      ← estilos y animación
├── js/
│   ├── chapters.js     ← TU configuración (capítulos y páginas) ← editas esto
│   └── reader.js       ← motor del lector (no hace falta tocarlo)
├── pages/              ← aquí van las imágenes del cómic
│   ├── cap-01/
│   └── cap-02/
├── vercel.json         ← configuración de Vercel (caché, urls limpias)
├── DEPLOY.md           ← guía de despliegue
└── README.md           ← este archivo
```

---

## 8. Preguntas frecuentes

**¿Por qué se ve una sola página en el móvil?**
Es a propósito: en pantallas estrechas dos páginas se verían diminutas. Gira el
móvil en horizontal y, si hay sitio, pasará a doble página automáticamente.

**Cambié una imagen pero sigo viendo la antigua.**
Es la caché del navegador. Recarga con **Ctrl + F5**. (En producción, si
reemplazas una imagen por otra con el mismo nombre, puede tardar por la caché de
Vercel; cambiarle el nombre fuerza la actualización inmediata.)

**Quiero que la portada NO vaya sola en modo doble.**
Pon `firstPageAlone: false` en `chapters.js`.

**Mi cómic es un manga (se lee al revés).**
Pon `readingDirection: "rtl"` en `chapters.js`.

**¿Puedo cambiar los colores o el título?**
El título, en `chapters.js` (`title`). Los colores, en `css/styles.css` (al
principio, en la sección `:root`).

**Se me olvidó una coma y no carga.**
Revisa que cada capítulo esté separado por coma y que el último elemento de cada
lista **no** lleve coma. El navegador suele indicar el error en su consola
(tecla **F12**).
