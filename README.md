# Ativo Sport GT

Static store site (GitHub Pages, domain from `CNAME`). Spanish (es-GT), prices in GTQ, cash on delivery.

## Structure
- `index.html` — home page (hero, benefits, products, how to order, about us)
- `products/` — catalog and product pages
- `carrito.html` — cart and order form → `gracias.html`
- `contacto.html` — contact form → `mensaje-enviado.html`
- `politica-de-privacidad.html`, `terminos-y-condiciones.html`, `politica-de-envios.html` — legal pages
- `assets/css/style.css`, `assets/js/main.js` (cart, menu, cookie banner), `assets/img/` (logo, illustrations)

## Before launch
- Forms are sent through formsubmit.co to `contacto@activosportgt.com`. The first submission sends an activation email to that address; click the link in it.
- Product prices are set in two places: the HTML pages and the `PRODUCTS` object in `assets/js/main.js`.
- Meta Pixel: insert its code into the `loadTracking()` function in `assets/js/main.js` (it loads only after consent).
- Replace the illustrations in `assets/img/` with real photos of your products when you have them.
