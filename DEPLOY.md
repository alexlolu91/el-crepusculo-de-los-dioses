# Guía completa de despliegue — de cero a web publicada

Esta guía te lleva **desde absolutamente nada** hasta tener tu cómic publicado en
internet con tu propio dominio, usando **GitHub + Vercel + Cloudflare**. No
asume que tengas cuentas, ni Git instalado, ni dominio. Sigue los pasos **en
orden** y no te saltes ninguno.

> Tiempo aproximado: 30–45 minutos la primera vez. Las siguientes
> actualizaciones son cuestión de segundos (ver [parte 8](#parte-8--actualizar-la-web-en-el-futuro)).

---

## Cómo encaja cada pieza (para que entiendas qué haces)

- **GitHub** = donde se guarda el código de tu web (una "copia maestra" online).
- **Vercel** = el servidor que coge ese código y lo publica en internet. Se
  reconstruye solo cada vez que cambias algo en GitHub.
- **Cloudflare** = donde compras y gestionas el **dominio** (la dirección bonita
  tipo `micomic.com`) y lo apuntas hacia Vercel.

El flujo es: **tú editas → subes a GitHub → Vercel publica → Cloudflare dirige tu
dominio a esa publicación.**

```
   Tu PC  ──push──►  GitHub  ──auto──►  Vercel  ◄──dominio──  Cloudflare
 (editas)         (guarda)          (publica)            (micomic.com)
```

---

## Índice

- [Parte 1 — Crear las tres cuentas](#parte-1--crear-las-tres-cuentas)
- [Parte 2 — Instalar y configurar Git en Windows](#parte-2--instalar-y-configurar-git-en-windows)
- [Parte 3 — Subir el proyecto a GitHub](#parte-3--subir-el-proyecto-a-github)
- [Parte 4 — Publicar en Vercel](#parte-4--publicar-en-vercel)
- [Parte 5 — Elegir y comprar el dominio en Cloudflare](#parte-5--elegir-y-comprar-el-dominio-en-cloudflare)
- [Parte 6 — Conectar el dominio de Cloudflare con Vercel](#parte-6--conectar-el-dominio-de-cloudflare-con-vercel)
- [Parte 7 — Comprobar que todo funciona (HTTPS incluido)](#parte-7--comprobar-que-todo-funciona-https-incluido)
- [Parte 8 — Actualizar la web en el futuro](#parte-8--actualizar-la-web-en-el-futuro)
- [Solución de problemas](#solución-de-problemas)
- [Anexo — Alternativa con GitHub Desktop (sin terminal)](#anexo--alternativa-con-github-desktop-sin-terminal)

---

## Parte 1 — Crear las tres cuentas

Hazlas las tres seguidas; usa el **mismo correo** en todas para no liarte.

### 1.1 GitHub

1. Entra en [github.com](https://github.com) → **Sign up**.
2. Pon tu correo, una contraseña y un nombre de usuario.
3. Verifica el correo (te llega un código).
4. El plan **gratuito (Free)** es más que suficiente.

### 1.2 Vercel

1. Entra en [vercel.com](https://vercel.com) → **Sign Up**.
2. Elige **"Continue with GitHub"** (así quedan conectados desde el principio).
3. Autoriza a Vercel a acceder a tu GitHub cuando te lo pida.
4. Elige el plan **Hobby (gratis)**.

### 1.3 Cloudflare

1. Entra en [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).
2. Crea la cuenta con tu correo y contraseña.
3. Verifica el correo.

> No configures nada más en Cloudflare todavía: el dominio lo compraremos en la
> [parte 5](#parte-5--elegir-y-comprar-el-dominio-en-cloudflare).

---

## Parte 2 — Instalar y configurar Git en Windows

Git es la herramienta que sube tu carpeta a GitHub.

### 2.1 Comprueba si ya lo tienes

Abre **PowerShell** (botón Inicio → escribe "PowerShell" → Enter) y ejecuta:

```powershell
git --version
```

- Si te responde algo como `git version 2.x` → **ya está instalado**, salta a 2.3.
- Si da error ("no se reconoce…") → instálalo (2.2).

### 2.2 Instalar Git

Opción rápida desde PowerShell:

```powershell
winget install --id Git.Git -e
```

(O descárgalo de [git-scm.com/download/win](https://git-scm.com/download/win) y
pulsa Siguiente en todo el instalador.)

**Cierra y vuelve a abrir PowerShell** al terminar, y comprueba de nuevo con
`git --version`.

### 2.3 Configura tu identidad (solo la primera vez)

Pon tu nombre y el correo de tu cuenta de GitHub:

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tucorreo@ejemplo.com"
```

---

## Parte 3 — Subir el proyecto a GitHub

### 3.1 Crear el repositorio vacío en GitHub

1. En [github.com](https://github.com), arriba a la derecha, pulsa **+** → **New repository**.
2. **Repository name:** por ejemplo `mi-comic`.
3. Visibilidad: **Public** o **Private**, da igual para Vercel.
4. **NO** marques "Add a README", ".gitignore" ni "license" (lo dejamos vacío
   para que no haya conflictos).
5. Pulsa **Create repository**.
6. En la página que aparece, copia la URL del repo. Será del estilo:
   `https://github.com/TU_USUARIO/mi-comic.git`

### 3.2 Subir la carpeta desde PowerShell

Ve a la carpeta del cómic. Ajusta la ruta si tu carpeta está en otro sitio:

```powershell
cd "C:\Your Path\Comic"
```

Ahora prepara y sube el proyecto (copia los comandos uno a uno):

```powershell
git init
git add .
git commit -m "Lector de comic inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mi-comic.git
git push -u origin main
```

- En `git remote add origin …` pega **tu** URL (la del paso 3.1).
- En el `push`, la primera vez se abrirá una ventana del navegador para
  **iniciar sesión en GitHub y autorizar**. Acepta.

Cuando termine, **recarga la página del repo en GitHub**: deberías ver todos los
archivos (`index.html`, `css/`, `js/`, `pages/`…). ✅

> ¿No te apañas con la terminal? Mira el [Anexo con GitHub Desktop](#anexo--alternativa-con-github-desktop-sin-terminal).

---

## Parte 4 — Publicar en Vercel

1. Entra en [vercel.com](https://vercel.com) (ya logueado con GitHub).
2. Pulsa **Add New…** → **Project**.
3. Verás la lista de tus repositorios de GitHub. Busca `mi-comic` y pulsa
   **Import**.
   - Si no aparece: pulsa **Adjust GitHub App Permissions** / **Configure GitHub
     App** y dale acceso al repositorio.
4. En la pantalla de configuración:
   - **Framework Preset:** `Other`.
   - **Root Directory:** déjalo como está (la raíz). *Solo* cámbialo a `Comic` si
     hubieras subido una carpeta que contiene a `Comic` dentro.
   - **Build Command** y **Output Directory:** **déjalos vacíos** (esta web no
     necesita compilación).
5. Pulsa **Deploy** y espera unos segundos.
6. Al terminar verás **"Congratulations"** y una URL tipo
   `https://mi-comic.vercel.app`. Ábrela: **tu cómic ya está online.** 🎉

Esa URL `.vercel.app` ya es pública y funciona. Si te basta con ella, has
terminado. Si quieres un **dominio propio** (`micomic.com`), sigue con la parte 5.

---

## Parte 5 — Elegir y comprar el dominio en Cloudflare

Compraremos el dominio directamente en **Cloudflare** porque lo vende **al precio
de coste** (sin sobreprecio) y queda ya integrado con su gestión de DNS.

### 5.1 Pensar el nombre

- Cuanto más corto y fácil de recordar, mejor (`micomic.com`).
- La terminación (`.com`, `.es`, `.net`, `.art`, `.xyz`…) afecta al precio. El
  `.com` es el más reconocible.
- Evita guiones y números si puedes; se prestan a confusión al dictarlo.

### 5.2 Comprobar disponibilidad y comprar

1. En el panel de Cloudflare ([dash.cloudflare.com](https://dash.cloudflare.com)),
   en el menú lateral entra en **Domain Registration** → **Register Domains**.
2. Escribe el nombre que quieras (ej. `micomic`) y mira las terminaciones
   disponibles y su precio anual.
3. Elige el que te guste y pulsa **Purchase** / añadir y continuar.
4. Rellena los **datos de contacto** del titular (obligatorio por normativa; usa
   datos reales). Cloudflare incluye **privacidad WHOIS gratis**, así que tus
   datos no se publican.
5. Introduce el **método de pago** y confirma la compra.

> El dominio se renueva **una vez al año**. Activa la **renovación automática**
> (Auto-renew) para no perderlo por olvido.

Al comprarlo en Cloudflare, el dominio queda **automáticamente gestionado por
Cloudflare** (no hace falta el típico paso de "cambiar nameservers"). Eso nos
facilita la parte 6.

---

## Parte 6 — Conectar el dominio de Cloudflare con Vercel

Ahora le decimos a Vercel "este dominio es mío" y a Cloudflare "envía el tráfico
de este dominio a Vercel".

### 6.1 Añadir el dominio en Vercel

1. En Vercel, entra en tu proyecto → pestaña **Settings** → **Domains**.
2. En el campo de texto escribe tu dominio **sin www**, por ejemplo
   `micomic.com`, y pulsa **Add**.
3. Cuando pregunte, elige la opción que **redirige `www` a la raíz** (o al revés,
   como prefieras; lo habitual es usar `micomic.com` como principal).
4. Vercel te mostrará **qué registros DNS** necesitas crear. Apunta estos dos
   (son los valores estándar de Vercel):

   | Tipo | Nombre | Valor |
   |------|--------|-------|
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

   > Usa **siempre los valores que te muestre Vercel en pantalla**, por si en el
   > futuro cambiaran. La tabla de arriba es la referencia actual.

### 6.2 Crear esos registros en Cloudflare

1. En Cloudflare, entra en tu dominio → sección **DNS** → **Records**.
2. Pulsa **Add record** y crea el primero:
   - **Type:** `A`
   - **Name:** `@`  (significa el dominio raíz, `micomic.com`)
   - **IPv4 address:** `76.76.21.21`
   - **Proxy status:** ponlo en **DNS only** (la nube debe quedar **gris**, no
     naranja). 👈 importante, ver nota.
   - **Save**.
3. **Add record** otra vez para el segundo:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Target:** `cname.vercel-dns.com`
   - **Proxy status:** **DNS only** (nube **gris**).
   - **Save**.

> **¿Por qué la nube gris (DNS only)?**
> Si dejas el proxy de Cloudflare activado (nube naranja) junto con el HTTPS de
> Vercel, es fácil que aparezca el error *"too many redirects"*. Lo más sencillo
> y fiable es dejarlo en **DNS only** y que Vercel gestione el certificado HTTPS.
> (Usuarios avanzados pueden activar el proxy naranja y poner el SSL de
> Cloudflare en **Full (strict)**, pero no es necesario.)

### 6.3 Esperar la verificación

Vuelve a Vercel → **Settings → Domains**. En uno o dos minutos (a veces hasta
unas horas, según el DNS) el dominio pasará de "Invalid Configuration" a
**Valid Configuration / Active** con una marca verde. Vercel emite el
certificado HTTPS automáticamente.

---

## Parte 7 — Comprobar que todo funciona (HTTPS incluido)

1. Abre en el navegador `https://micomic.com` (tu dominio). Debe cargar el cómic.
2. Prueba también `https://www.micomic.com`: debe llevarte al mismo sitio.
3. Comprueba el **candado** 🔒 de la barra de direcciones: significa que el HTTPS
   está activo. No tienes que hacer nada más para el certificado: Vercel lo
   renueva solo.

¡Ya está! Tu cómic está publicado en tu propio dominio. 🎉

---

## Parte 8 — Actualizar la web en el futuro

Cada vez que añadas páginas o capítulos (editando `js/chapters.js` y metiendo
imágenes en `pages/`), solo tienes que subir los cambios:

```powershell
cd "C:\Your Path\Comic"
git add .
git commit -m "Anadido capitulo 3"
git push
```

En cuanto haces `git push`, **Vercel detecta el cambio y vuelve a publicar solo**
en unos segundos. No hay que tocar ni Vercel ni Cloudflare nunca más.

> Con GitHub Desktop sería: ver los cambios → escribir un mensaje → **Commit to
> main** → **Push origin**.

---

## Solución de problemas

**`git push` me pide usuario y contraseña y la contraseña no funciona.**
GitHub ya no acepta la contraseña normal por terminal. Cuando se abra la ventana
del navegador, inicia sesión y autoriza ahí. Si te pide un "token", usa el botón
de autorización del navegador en lugar de escribir la contraseña.

**En Vercel no aparece mi repositorio al importar.**
Pulsa **Adjust GitHub App Permissions** y concede acceso al repo `mi-comic`.

**El dominio sigue en "Invalid Configuration" pasado un rato.**
- Revisa que los registros DNS en Cloudflare están **exactamente** como los pide
  Vercel (tipo, nombre y valor).
- Asegúrate de que el proxy está en **DNS only** (nube **gris**).
- El DNS puede tardar; espera y pulsa **Refresh** en Vercel.

**Sale "Too many redirects" al abrir el dominio.**
Es el proxy naranja de Cloudflare peleándose con el HTTPS de Vercel. Pon los
registros en **DNS only** (nube gris) como se indica en 6.2.

**Cambié una imagen por otra con el mismo nombre y sigo viendo la antigua.**
Es la caché. Recarga con **Ctrl + F5**. Si persiste, renombra la imagen (p. ej.
`01b.webp`) y actualiza la ruta en `chapters.js`; así se fuerza la actualización.

**"La web no se actualiza tras el push."**
Entra en Vercel → pestaña **Deployments** y mira si el último despliegue está en
verde (Ready). Si está en rojo (Error), pulsa encima para ver el mensaje.

---

## Anexo — Alternativa con GitHub Desktop (sin terminal)

Si prefieres no usar PowerShell para Git:

1. Descarga **GitHub Desktop** de [desktop.github.com](https://desktop.github.com)
   e instálalo. Inicia sesión con tu cuenta de GitHub.
2. Menú **File → Add local repository** → selecciona la carpeta `Comic`.
3. Te dirá que no es un repositorio aún → pulsa **create a repository** → **Create**.
4. Abajo a la izquierda, escribe un mensaje (ej. "inicial") → **Commit to main**.
5. Arriba, pulsa **Publish repository** → elige nombre y si es público/privado →
   **Publish**.
6. A partir de aquí, sigue desde la [Parte 4](#parte-4--publicar-en-vercel)
   (importar el repo en Vercel). Para futuras actualizaciones: haces cambios →
   **Commit to main** → **Push origin**.
