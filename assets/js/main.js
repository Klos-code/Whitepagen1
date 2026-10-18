/* Ativo Sport GT — carrito, menú y aviso de cookies */
(function () {
  'use strict';

  var ROOT = document.documentElement.getAttribute('data-root') || '';
  var CART_KEY = 'asgt_cart';
  var CONSENT_KEY = 'asgt_cookies';
  var SHIPPING_FEE = 30;
  var FREE_SHIPPING_FROM = 300;

  var PRODUCTS = {
    'rodillera-compresion': {
      name: 'Rodillera Deportiva de Compresión',
      price: 149,
      img: 'assets/img/rodillera.svg',
      url: 'products/rodillera-compresion.html'
    },
    'plantillas-deportivas': {
      name: 'Plantillas Ortopédicas Deportivas',
      price: 129,
      img: 'assets/img/plantillas.svg',
      url: 'products/plantillas-deportivas.html'
    },
    'kinesiotape': {
      name: 'Cinta Kinesiológica (Kinesiotape)',
      price: 89,
      img: 'assets/img/kinesiotape.svg',
      url: 'products/kinesiotape.html'
    },
    'tobillera-ajustable': {
      name: 'Soporte de Tobillo Ajustable',
      price: 119,
      img: 'assets/img/tobillera.svg',
      url: 'products/tobillera-ajustable.html'
    }
  };

  function money(n) { return 'Q' + n.toFixed(2); }

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* almacenamiento no disponible */ }
  }

  function readCart() {
    try {
      var data = JSON.parse(storageGet(CART_KEY) || '[]');
      return Array.isArray(data) ? data.filter(function (i) { return PRODUCTS[i.id]; }) : [];
    } catch (e) { return []; }
  }
  function writeCart(cart) {
    storageSet(CART_KEY, JSON.stringify(cart));
    updateCount();
  }

  function addToCart(id, variant, qty) {
    var cart = readCart();
    var found = cart.filter(function (i) { return i.id === id && i.variant === variant; })[0];
    if (found) { found.qty = Math.min(found.qty + qty, 20); }
    else { cart.push({ id: id, variant: variant, qty: qty }); }
    writeCart(cart);
  }

  function updateCount() {
    var total = readCart().reduce(function (s, i) { return s + i.qty; }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = total; });
  }

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Botones "Agregar al carrito" en tarjetas ---------- */
  document.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      addToCart(btn.getAttribute('data-add'), btn.getAttribute('data-variant') || '', 1);
      var original = btn.textContent;
      btn.textContent = 'Agregado ✓';
      btn.disabled = true;
      setTimeout(function () { btn.textContent = original; btn.disabled = false; }, 1600);
    });
  });

  /* ---------- Selector de cantidad ---------- */
  function bindQty(wrapper, onChange) {
    var input = wrapper.querySelector('input');
    wrapper.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = parseInt(input.value, 10) || 1;
        v += b.getAttribute('data-step') === '+' ? 1 : -1;
        input.value = Math.max(1, Math.min(20, v));
        if (onChange) onChange(parseInt(input.value, 10));
      });
    });
    input.addEventListener('change', function () {
      var v = parseInt(input.value, 10) || 1;
      input.value = Math.max(1, Math.min(20, v));
      if (onChange) onChange(parseInt(input.value, 10));
    });
  }

  /* ---------- Ficha de producto ---------- */
  var buyForm = document.getElementById('buy-form');
  if (buyForm) {
    var qtyBox = buyForm.querySelector('.qty');
    if (qtyBox) bindQty(qtyBox);
    buyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var id = buyForm.getAttribute('data-product');
      var variantSel = buyForm.querySelector('select[name="variante"]');
      if (variantSel && !variantSel.value) {
        variantSel.focus();
        variantSel.setCustomValidity('Por favor seleccione una opción.');
        variantSel.reportValidity();
        return;
      }
      var variant = variantSel ? variantSel.value : '';
      var qty = parseInt(buyForm.querySelector('input[name="cantidad"]').value, 10) || 1;
      addToCart(id, variant, qty);
      var msg = document.getElementById('added-msg');
      if (msg) { msg.classList.add('show'); msg.focus(); }
    });
    var vs = buyForm.querySelector('select[name="variante"]');
    if (vs) vs.addEventListener('change', function () { vs.setCustomValidity(''); });
  }

  /* ---------- Página del carrito ---------- */
  var cartRoot = document.getElementById('cart-root');
  if (cartRoot) {
    var list = document.getElementById('cart-list');
    var emptyBox = document.getElementById('cart-empty');
    var filled = document.getElementById('cart-filled');
    var orderField = document.getElementById('order-summary');

    var renderCart = function () {
      var cart = readCart();
      if (!cart.length) {
        emptyBox.hidden = false; filled.hidden = true; return;
      }
      emptyBox.hidden = true; filled.hidden = false;
      list.innerHTML = '';
      var subtotal = 0;
      var lines = [];
      cart.forEach(function (item, idx) {
        var p = PRODUCTS[item.id];
        var lineTotal = p.price * item.qty;
        subtotal += lineTotal;
        lines.push(item.qty + ' x ' + p.name + (item.variant ? ' (' + item.variant + ')' : '') + ' = ' + money(lineTotal));
        var row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML =
          '<img src="' + ROOT + p.img + '" alt="" width="96" height="96">' +
          '<div><h3><a href="' + ROOT + p.url + '"></a></h3>' +
          '<div class="meta"></div>' +
          '<div class="cart-controls"><div class="qty" aria-label="Cantidad">' +
          '<button type="button" data-step="-" aria-label="Quitar uno">−</button>' +
          '<input type="number" min="1" max="20" inputmode="numeric" aria-label="Cantidad">' +
          '<button type="button" data-step="+" aria-label="Agregar uno">+</button></div>' +
          '<button type="button" class="remove">Eliminar</button></div></div>' +
          '<div class="line-total"></div>';
        row.querySelector('h3 a').textContent = p.name;
        row.querySelector('.meta').textContent = (item.variant ? item.variant + ' · ' : '') + money(p.price) + ' c/u';
        row.querySelector('.line-total').textContent = money(lineTotal);
        row.querySelector('.qty input').value = item.qty;
        bindQty(row.querySelector('.qty'), function (q) {
          var c = readCart(); c[idx].qty = q; writeCart(c); renderCart();
        });
        row.querySelector('.remove').addEventListener('click', function () {
          var c = readCart(); c.splice(idx, 1); writeCart(c); renderCart();
        });
        list.appendChild(row);
      });
      var shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
      document.getElementById('sum-subtotal').textContent = money(subtotal);
      document.getElementById('sum-shipping').textContent = shipping ? money(shipping) : 'Gratis';
      document.getElementById('sum-total').textContent = money(subtotal + shipping);
      var missing = FREE_SHIPPING_FROM - subtotal;
      document.getElementById('free-ship-hint').textContent = missing > 0
        ? 'Le faltan ' + money(missing) + ' para obtener envío gratis.'
        : 'Su pedido tiene envío gratis.';
      lines.push('Subtotal: ' + money(subtotal));
      lines.push('Envío: ' + (shipping ? money(shipping) : 'Gratis'));
      lines.push('TOTAL A PAGAR CONTRA ENTREGA: ' + money(subtotal + shipping));
      if (orderField) orderField.value = lines.join('\n');
    };
    renderCart();

    var checkout = document.getElementById('checkout-form');
    if (checkout) {
      checkout.addEventListener('submit', function (e) {
        if (!readCart().length) { e.preventDefault(); return; }
        renderCart();
        // El carrito se vacía en la página de confirmación (gracias.html).
      });
    }
  }

  if (document.body.hasAttribute('data-clear-cart')) {
    writeCart([]);
  }

  updateCount();

  /* ---------- Aviso de cookies ---------- */
  var bar = document.getElementById('cookie-bar');
  function loadTracking() {
    // Aquí se carga el Meta Pixel u otra analítica SOLO después del consentimiento.
    // Ejemplo: insertar el código del píxel con su ID cuando esté disponible.
  }
  if (bar) {
    var consent = storageGet(CONSENT_KEY);
    if (consent === 'all') loadTracking();
    if (!consent) bar.classList.add('show');
    bar.querySelectorAll('[data-consent]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-consent');
        storageSet(CONSENT_KEY, v);
        bar.classList.remove('show');
        if (v === 'all') loadTracking();
      });
    });
  }
  document.querySelectorAll('[data-cookie-settings]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (bar) bar.classList.add('show');
    });
  });
})();
