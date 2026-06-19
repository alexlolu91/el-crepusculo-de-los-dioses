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
      title: "Capítulo 2 — Liberando al Dragón",
      pages: [
	    "pages/cap-02/00.png",
        "pages/cap-02/01.png",
		"pages/cap-02/02.png",
		"pages/cap-02/03.png",
		"pages/cap-02/04.png",
        "pages/cap-02/05.png",
		"pages/cap-02/06.png",
		"pages/cap-02/07.png",
		"pages/cap-02/08.png",
		"pages/cap-02/09.png",
		"pages/cap-02/10.png",
		"pages/cap-02/11.png",
		"pages/cap-02/12.png",
		"pages/cap-02/13.png",
		"pages/cap-02/14.png",
		"pages/cap-02/15.png",
		"pages/cap-02/16.png",
		"pages/cap-02/17.png",
        "pages/cap-02/18.png",
		"pages/cap-02/19.png",
        "pages/cap-02/20.png",		
        "pages/cap-02/21.png"
      ]
    },
	    {
      id: "cap-03",
      title: "Capítulo 3 — Son solo negocios",
      pages: [
	    "pages/cap-03/00.png",
        "pages/cap-03/01.png",
		"pages/cap-03/02.png",
		"pages/cap-03/03.png",
		"pages/cap-03/04.png",
        "pages/cap-03/05.png",
		"pages/cap-03/06.png",
		"pages/cap-03/07.png",
		"pages/cap-03/08.png",
		"pages/cap-03/09.png",
		"pages/cap-03/10.png",
		"pages/cap-03/11.png",
		"pages/cap-03/12.png",
		"pages/cap-03/13.png",
		"pages/cap-03/14.png",
		"pages/cap-03/15.png",
		"pages/cap-03/16.png",
		"pages/cap-03/17.png",
        "pages/cap-03/18.png",
		"pages/cap-03/19.png",
        "pages/cap-03/20.png",		
		"pages/cap-03/21.png",
        "pages/cap-03/22.png",
        "pages/cap-03/23.png"
      ]
    }
  ]
};
