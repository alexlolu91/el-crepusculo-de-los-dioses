/* ===========================================================
   CONFIGURACIÓN DEL CÓMIC
   -----------------------------------------------------------
   Este es el ÚNICO archivo que necesitas tocar para añadir
   tu cómic. No hace falta saber programar:

   1. Cambia el "title" por el nombre de tu cómic.
   2. Por cada capítulo, añade un bloque dentro de "chapters".
   3. En "pages" pones la lista de imágenes en orden.

   Las imágenes van dentro de la carpeta "pages/". Puedes usar
   .jpg, .png, .webp o .svg. Lo recomendable: .webp o .jpg.

   readingDirection:
      "ltr" = izquierda a derecha (cómic occidental)  ← por defecto
      "rtl" = derecha a izquierda (manga)

   firstPageAlone:
      true  = la portada se muestra sola (como un cómic real)
      false = se empareja desde la primera página
   =========================================================== */

const COMIC = {
  title: "El Crepúsculo de los Dioses",
  readingDirection: "ltr",
  firstPageAlone: true,

  chapters: [
    {
      id: "cap-01",
      title: "Capítulo 1 — Érase una vez",
      pages: [
        "pages/cap-01/1.png",
        "pages/cap-01/2.png",
        "pages/cap-01/3.png",
        "pages/cap-01/4.png",
        "pages/cap-01/5.png",
        "pages/cap-01/6.png",
        "pages/cap-01/7.png",
        "pages/cap-01/8.png",
        "pages/cap-01/9.png",
        "pages/cap-01/10.png",
        "pages/cap-01/11.png",
        "pages/cap-01/12.png",
        "pages/cap-01/13.png",
        "pages/cap-01/14.png",
        "pages/cap-01/15.png",
        "pages/cap-01/16.png",
        "pages/cap-01/17.png",
        "pages/cap-01/18.png",
        "pages/cap-01/19.png",
        "pages/cap-01/20.png",
        "pages/cap-01/21.png",
        "pages/cap-01/22.png",
        "pages/cap-01/23.png",
        "pages/cap-01/23.png",
        "pages/cap-01/24.png",
        "pages/cap-01/25.png",
        "pages/cap-01/26.png",
        "pages/cap-01/27.png",
        "pages/cap-01/28.png",
        "pages/cap-01/29.png",
        "pages/cap-01/30.png"
      ]
    },
    {
      id: "cap-02",
      title: "Capítulo 2 — Continuará...",
      pages: [
        "pages/cap-02/01.png",
        "pages/cap-02/02.svg",
        "pages/cap-02/03.svg",
        "pages/cap-02/04.svg",
        "pages/cap-02/05.svg"
      ]
    }
  ]
};
