/* ===========================================================
   Lector de cómic — lógica
   -----------------------------------------------------------
   - Selector de capítulos
   - Modo doble página (pantallas grandes) o una sola (móvil),
     decidido automáticamente según el tamaño de la pantalla.
   - Pase de página con animación (se desactiva si el usuario
     prefiere menos movimiento).
   - Navegación con: flechas, clic en los laterales, teclado
     (← →, AvPág/RePág, Inicio/Fin) y deslizar el dedo.
   - Recuerda el último capítulo y página visitados.
   =========================================================== */

(function () {
  "use strict";

  // --- Referencias al DOM ---
  const els = {
    title:        document.getElementById("comicTitle"),
    select:       document.getElementById("chapterSelect"),
    counter:      document.getElementById("pageCounter"),
    stage:        document.getElementById("stage"),
    reader:       document.getElementById("reader"),
    zonePrev:     document.getElementById("zonePrev"),
    zoneNext:     document.getElementById("zoneNext"),
    arrowPrev:    document.getElementById("arrowPrev"),
    arrowNext:    document.getElementById("arrowNext"),
    fullscreen:   document.getElementById("fullscreenBtn"),
    overlay:      document.getElementById("overlay"),
    overlayText:  document.getElementById("overlayText"),
  };

  // --- Estado ---
  const state = {
    chapterIndex: 0,   // capítulo actual
    spreadIndex: 0,    // índice dentro de la lista de "vistas" (1 o 2 páginas)
    isDouble: false,   // ¿modo doble página?
    spreads: [],       // lista de vistas: cada una es un array de URLs
  };

  const STORAGE_KEY = "comic-progress-v2";
  const rtl = COMIC.readingDirection === "rtl";

  // ---------------------------------------------------------
  // Construcción de las "vistas" (spreads)
  // En modo doble agrupamos las páginas de dos en dos.
  // Si firstPageAlone = true, la portada va sola.
  // ---------------------------------------------------------
  function buildSpreads(pages, isDouble) {
    if (!isDouble) return pages.map((p) => [p]);

    const spreads = [];
    let i = 0;
    if (COMIC.firstPageAlone && pages.length > 0) {
      spreads.push([pages[0]]);
      i = 1;
    }
    for (; i < pages.length; i += 2) {
      const pair = pages.slice(i, i + 2);
      spreads.push(pair);
    }
    return spreads;
  }

  // ¿Debe usarse modo doble? Hay sitio para dos páginas si la
  // ventana es ancha y está en horizontal (apaisada).
  function computeIsDouble() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return w >= 900 && w > h; // ancha y apaisada
  }

  // Devuelve el número de página "humano" (1..N) de una vista
  function firstPageNumberOfSpread(spreadIdx) {
    let count = 0;
    for (let s = 0; s < spreadIdx; s++) count += state.spreads[s].length;
    return count + 1;
  }

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------
  let turnTimer = null;

  function render(direction) {
    const spread = state.spreads[state.spreadIndex];
    if (!spread) return;

    // Orden de las páginas (manga = derecha a izquierda)
    const ordered = rtl ? spread.slice().reverse() : spread;

    els.stage.innerHTML = "";
    els.stage.classList.toggle("stage--double", spread.length === 2);

    ordered.forEach((src) => {
      const img = document.createElement("img");
      img.className = "page-img";
      img.alt = "Página del cómic";
      img.draggable = false;
      img.decoding = "async";
      img.src = src;
      img.addEventListener("error", () => onImageError(img, src));
      els.stage.appendChild(img);
    });

    // Animación de pase
    if (direction) {
      els.stage.classList.remove("is-turning-next", "is-turning-prev");
      // forzamos reflow para reiniciar la animación
      void els.stage.offsetWidth;
      els.stage.classList.add(direction === "next" ? "is-turning-next" : "is-turning-prev");
      clearTimeout(turnTimer);
      turnTimer = setTimeout(() => {
        els.stage.classList.remove("is-turning-next", "is-turning-prev");
      }, 400);
    }

    updateUI();
    preloadAround();
  }

  function onImageError(img, src) {
    // Si falta una imagen, mostramos un aviso encima de ella.
    img.alt = "No se pudo cargar: " + src;
    img.style.minWidth = "200px";
    img.style.minHeight = "300px";
    img.src =
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='850'>
           <rect width='100%' height='100%' fill='#1a1a24'/>
           <text x='50%' y='46%' fill='#e23' font-family='sans-serif' font-size='28' text-anchor='middle'>Imagen no encontrada</text>
           <text x='50%' y='53%' fill='#9a9aae' font-family='monospace' font-size='18' text-anchor='middle'>${src}</text>
         </svg>`
      );
  }

  function updateUI() {
    const chapter = COMIC.chapters[state.chapterIndex];
    const total = chapter.pages.length;
    const spread = state.spreads[state.spreadIndex];
    const first = firstPageNumberOfSpread(state.spreadIndex);
    const last = first + spread.length - 1;

    els.counter.textContent =
      (spread.length === 2 ? `${first}–${last}` : `${first}`) + ` / ${total}`;

    const atStart = state.spreadIndex <= 0;
    const atEnd = state.spreadIndex >= state.spreads.length - 1;
    els.arrowPrev.disabled = atStart && state.chapterIndex === 0;
    els.arrowNext.disabled = atEnd && state.chapterIndex === COMIC.chapters.length - 1;
  }

  // Precarga las imágenes de las vistas vecinas para que el pase
  // de página sea instantáneo.
  function preloadAround() {
    const neighbors = [state.spreadIndex - 1, state.spreadIndex + 1];
    neighbors.forEach((idx) => {
      const s = state.spreads[idx];
      if (!s) return;
      s.forEach((src) => { const im = new Image(); im.src = src; });
    });
  }

  // ---------------------------------------------------------
  // Navegación
  // ---------------------------------------------------------
  function next() {
    if (state.spreadIndex < state.spreads.length - 1) {
      state.spreadIndex++;
      render("next");
      save();
    } else if (state.chapterIndex < COMIC.chapters.length - 1) {
      loadChapter(state.chapterIndex + 1, 0, "next");
    }
  }

  function prev() {
    if (state.spreadIndex > 0) {
      state.spreadIndex--;
      render("prev");
      save();
    } else if (state.chapterIndex > 0) {
      // vamos al final del capítulo anterior
      loadChapter(state.chapterIndex - 1, "last", "prev");
    }
  }

  function goToStart() { state.spreadIndex = 0; render(); save(); }
  function goToEnd() { state.spreadIndex = state.spreads.length - 1; render(); save(); }

  // ---------------------------------------------------------
  // Carga de capítulo
  // ---------------------------------------------------------
  function loadChapter(index, spreadPos, direction) {
    state.chapterIndex = index;
    state.isDouble = computeIsDouble();
    const chapter = COMIC.chapters[index];
    state.spreads = buildSpreads(chapter.pages, state.isDouble);

    if (spreadPos === "last") state.spreadIndex = state.spreads.length - 1;
    else state.spreadIndex = Math.min(spreadPos || 0, state.spreads.length - 1);

    els.select.value = String(index);
    render(direction);
    save();
  }

  // Recalcula las vistas cuando cambia el tamaño (móvil <-> escritorio)
  // intentando conservar la página que se estaba leyendo.
  function recomputeMode() {
    const shouldDouble = computeIsDouble();
    if (shouldDouble === state.isDouble) return;

    const currentPage = firstPageNumberOfSpread(state.spreadIndex); // 1..N
    state.isDouble = shouldDouble;
    const chapter = COMIC.chapters[state.chapterIndex];
    state.spreads = buildSpreads(chapter.pages, shouldDouble);

    // localizar la vista que contiene esa página
    let acc = 0, target = 0;
    for (let s = 0; s < state.spreads.length; s++) {
      const len = state.spreads[s].length;
      if (currentPage <= acc + len) { target = s; break; }
      acc += len;
    }
    state.spreadIndex = target;
    render();
  }

  // ---------------------------------------------------------
  // Persistencia (recordar dónde se quedó)
  // ---------------------------------------------------------
  function save() {
    try {
      const page = firstPageNumberOfSpread(state.spreadIndex);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        chapter: COMIC.chapters[state.chapterIndex].id,
        page: page,
      }));
    } catch (e) { /* almacenamiento no disponible */ }
  }

  function restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      const idx = COMIC.chapters.findIndex((c) => c.id === data.chapter);
      if (idx < 0) return null;
      return { chapterIndex: idx, page: data.page || 1 };
    } catch (e) { return null; }
  }

  // ---------------------------------------------------------
  // Pantalla completa
  // ---------------------------------------------------------
	function toggleFullscreen() {
	  const isMobile = window.matchMedia("(max-width: 768px)").matches;

	  if (isMobile) {
		document.body.classList.toggle("is-reader-fullscreen");
		return;
	  }

	  if (!document.fullscreenElement) {
		els.reader.requestFullscreen?.().catch(() => {});
	  } else {
		document.exitFullscreen?.();
	  }
	}

  // ---------------------------------------------------------
  // Gestos táctiles (deslizar)
  // ---------------------------------------------------------
  function setupSwipe() {
    let startX = 0, startY = 0, tracking = false;
    const THRESHOLD = 45;

    els.reader.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) { tracking = false; return; }
      tracking = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    els.reader.addEventListener("touchend", (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) < THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      // deslizar a la izquierda = avanzar (invertido en manga)
      const forward = rtl ? dx > 0 : dx < 0;
      forward ? next() : prev();
    }, { passive: true });
  }

  // ---------------------------------------------------------
  // Eventos
  // ---------------------------------------------------------
  function bindEvents() {
    els.arrowNext.addEventListener("click", next);
    els.arrowPrev.addEventListener("click", prev);
    els.zoneNext.addEventListener("click", next);
    els.zonePrev.addEventListener("click", prev);
    els.fullscreen.addEventListener("click", toggleFullscreen);
	document.addEventListener("fullscreenchange", () => {
  document.body.classList.toggle("is-reader-fullscreen", !!document.fullscreenElement);
});

    els.select.addEventListener("change", (e) => {
      loadChapter(parseInt(e.target.value, 10), 0);
    });

    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowRight": rtl ? prev() : next(); break;
        case "ArrowLeft":  rtl ? next() : prev(); break;
        case "PageDown": case " ": next(); e.preventDefault(); break;
        case "PageUp": prev(); break;
        case "Home": goToStart(); break;
        case "End": goToEnd(); break;
        case "f": case "F": toggleFullscreen(); break;
      }
    });

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(recomputeMode, 150);
    });
  }

  // ---------------------------------------------------------
  // Arranque
  // ---------------------------------------------------------
  function init() {
    if (typeof COMIC === "undefined" || !COMIC.chapters || COMIC.chapters.length === 0) {
      els.overlay.hidden = false;
      els.overlayText.textContent = "No hay capítulos configurados. Edita js/chapters.js.";
      return;
    }

    document.title = COMIC.title;
    els.title.textContent = COMIC.title;

    // Rellenar el selector de capítulos
    COMIC.chapters.forEach((ch, i) => {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = ch.title || ("Capítulo " + (i + 1));
      els.select.appendChild(opt);
    });

    bindEvents();
    setupSwipe();

    // ¿Retomar donde se quedó?
    const saved = restore();
    if (saved) {
      state.isDouble = computeIsDouble();
      state.spreads = buildSpreads(COMIC.chapters[saved.chapterIndex].pages, state.isDouble);
      // localizar la vista que contiene esa página
      let acc = 0, target = 0;
      for (let s = 0; s < state.spreads.length; s++) {
        const len = state.spreads[s].length;
        if (saved.page <= acc + len) { target = s; break; }
        acc += len;
      }
      state.chapterIndex = saved.chapterIndex;
      state.spreadIndex = target;
      els.select.value = String(saved.chapterIndex);
      render();
    } else {
      loadChapter(0, 0);
    }
  }

  init();
})();
