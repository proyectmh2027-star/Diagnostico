(function () {
  var TIPO = document.body.getAttribute('data-tipo'), E = window.ESQUEMAS[TIPO], COL = window.COLONIAS || [];
  var resp = {}, ubic = {}, preguntas = [];
  var LS_APL = 'mh_aplicador', LS_SEC = 'mh_seccion', LS_PEND = 'mh_pendientes_' + TIPO;
  var $ = function (id) { return document.getElementById(id); };

  // ---------- utilidades ----------
  var slug = window.slug;
  function el(tag, attrs, hijos) {
    var n = document.createElement(tag);
    for (var k in (attrs || {})) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (hijos || []).forEach(function (h) { if (h) n.appendChild(h); });
    return n;
  }
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function folio() {
    var d = new Date(), p = function (x) { return String(x).padStart(2, '0'); };
    var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = '';
    for (var i = 0; i < 4; i++) r += abc[Math.floor(Math.random() * abc.length)];
    return (TIPO === 'familia' ? 'F' : 'C') + '-' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + r;
  }

  // ---------- colonia por GPS ----------
  function enAnillo(x, y, a) {
    var dentro = false;
    for (var i = 0, j = a.length - 1; i < a.length; j = i++) {
      var xi = a[i][0], yi = a[i][1], xj = a[j][0], yj = a[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) dentro = !dentro;
    }
    return dentro;
  }
  function coloniaEn(lng, lat) {
    for (var c = 0; c < COL.length; c++) {
      var k = COL[c], b = k.b;
      if (lng < b[0] || lng > b[2] || lat < b[1] || lat > b[3]) continue;
      for (var p = 0; p < k.g.length; p++) {
        var poly = k.g[p];
        if (!enAnillo(lng, lat, poly[0])) continue;
        var hueco = false;
        for (var h = 1; h < poly.length; h++) if (enAnillo(lng, lat, poly[h])) { hueco = true; break; }
        if (!hueco) return k;
      }
    }
    return null;
  }
  function fijarColonia(k, modo) {
    ubic.colonia = k.n; ubic.colonia_id = k.id; ubic.cp = k.cp; ubic.distrito_local = k.dl; ubic.deteccion_colonia = modo;
    $('coloniaNom').textContent = k.n;
    $('coloniaMeta').textContent = 'CP ' + k.cp + ' · Distrito local ' + k.dl + (modo === 'gps' ? ' · detectada por GPS' : ' · elegida a mano');
    $('coloniaCaja').classList.add('ok');
    $('buscador').hidden = true;
    avance();
  }
  function detectar() {
    $('coloniaNom').textContent = 'Buscando ubicación…';
    $('coloniaMeta').textContent = 'Esto tarda unos segundos.';
    $('coloniaCaja').classList.remove('ok');
    if (!navigator.geolocation) return sinGps('Este teléfono no comparte ubicación. Elige la colonia de la lista.');
    navigator.geolocation.getCurrentPosition(function (pos) {
      ubic.lat = +pos.coords.latitude.toFixed(6); ubic.lng = +pos.coords.longitude.toFixed(6);
      ubic.precision_m = Math.round(pos.coords.accuracy);
      var k = coloniaEn(ubic.lng, ubic.lat);
      if (k) fijarColonia(k, 'gps');
      else sinGps('La ubicación cae fuera de las colonias de Monterrey. Elige la colonia de la lista.');
    }, function () {
      sinGps('No se obtuvo la ubicación. Elige la colonia de la lista.');
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  }
  function sinGps(msg) {
    $('coloniaNom').textContent = 'Sin colonia';
    $('coloniaMeta').textContent = msg;
    abrirBuscador();
  }
  function abrirBuscador() { $('buscador').hidden = false; $('busca').focus(); filtrar(); }
  function filtrar() {
    var t = slug($('busca').value || ''), box = $('resultados');
    box.innerHTML = '';
    if (t.length < 2) return;
    COL.filter(function (k) { return slug(k.n).indexOf(t) !== -1; }).slice(0, 8).forEach(function (k) {
      box.appendChild(el('button', { type: 'button', onclick: function () { fijarColonia(k, 'manual'); } },
        [document.createTextNode(k.n + ' '), el('small', { text: 'CP ' + k.cp + ' · DL ' + k.dl })]));
    });
    if (!box.children.length) box.appendChild(el('small', { text: 'Sin coincidencias.' }));
  }

  // ---------- render de preguntas ----------
  function opciones(q, multiple, max) {
    var cont = el('div', { class: 'ops' }), otroInput = null;
    q.opciones.forEach(function (o) {
      var b = el('button', { type: 'button', class: 'op', 'aria-pressed': 'false', text: o });
      b.onclick = function () {
        if (!multiple) {
          cont.querySelectorAll('.op').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
        } else {
          var on = b.getAttribute('aria-pressed') === 'true';
          var sel = cont.querySelectorAll('.op[aria-pressed=true]').length;
          if (!on && max && sel >= max) return;
          b.setAttribute('aria-pressed', on ? 'false' : 'true');
        }
        leer();
      };
      cont.appendChild(b);
    });
    var wrap = el('div', {}, [cont]);
    if (q.opciones.indexOf('Otro') !== -1) {
      otroInput = el('input', { type: 'text', class: 'otro', placeholder: '¿Cuál?', hidden: '' });
      otroInput.oninput = leer;
      wrap.appendChild(otroInput);
    }
    function valor(o) { return o === 'Otro' && otroInput && otroInput.value.trim() ? 'Otro: ' + otroInput.value.trim() : o; }
    function leer() {
      var sel = [].map.call(cont.querySelectorAll('.op[aria-pressed=true]'), function (x) { return x.textContent; });
      if (otroInput) otroInput.hidden = sel.indexOf('Otro') === -1;
      if (multiple) resp[q.id] = sel.length ? sel.map(valor) : undefined;
      else resp[q.id] = sel.length ? valor(sel[0]) : undefined;
      cambio();
    }
    return wrap;
  }

  function top3(q) {
    var orden = [], cont = el('div', { class: 'ops' }), otroInput = null;
    var botones = q.opciones.map(function (o) {
      var b = el('button', { type: 'button', class: 'op', 'aria-pressed': 'false' });
      b.onclick = function () {
        var i = orden.indexOf(o);
        if (i !== -1) orden.splice(i, 1); else if (orden.length < 3) orden.push(o); else return;
        pintar();
      };
      cont.appendChild(b);
      return { o: o, b: b };
    });
    function pintar() {
      botones.forEach(function (x) {
        var i = orden.indexOf(x.o);
        x.b.innerHTML = '';
        if (i !== -1) x.b.appendChild(el('span', { class: 'rk', text: String(i + 1) }));
        x.b.appendChild(document.createTextNode(x.o));
        x.b.setAttribute('aria-pressed', i !== -1 ? 'true' : 'false');
      });
      if (otroInput) otroInput.hidden = orden.indexOf('Otro') === -1;
      for (var k = 0; k < 3; k++) {
        var v = orden[k];
        if (v === 'Otro' && otroInput.value.trim()) v = 'Otro: ' + otroInput.value.trim();
        resp[q.id + '_' + (k + 1)] = v;
      }
      cambio();
    }
    var wrap = el('div', {}, [cont]);
    if (q.opciones.indexOf('Otro') !== -1) {
      otroInput = el('input', { type: 'text', class: 'otro', placeholder: '¿Cuál?', hidden: '' });
      otroInput.oninput = pintar;
      wrap.appendChild(otroInput);
    }
    pintar();
    return wrap;
  }

  function conteo(q) {
    return el('div', { class: 'tabla' }, q.filas.map(function (f) {
      var clave = q.id + '_' + slug(f), n = 0, out = el('output', { text: '0' });
      function set(v) { n = Math.max(0, v); out.textContent = n; resp[clave] = n; cambio(); }
      return el('div', { class: 'fila-cnt' }, [
        el('div', { class: 'nombre', text: f }),
        el('div', { class: 'paso' }, [
          el('button', { type: 'button', 'aria-label': 'Menos ' + f, text: '−', onclick: function () { set(n - 1); } }),
          out,
          el('button', { type: 'button', 'aria-label': 'Más ' + f, text: '+', onclick: function () { set(n + 1); } })
        ])
      ]);
    }));
  }

  function escala(q) {
    return el('div', { class: 'tabla' }, q.filas.map(function (f) {
      var clave = q.id + '_' + slug(f), ops = el('div', { class: 'ops' });
      q.escala.forEach(function (v) {
        var b = el('button', { type: 'button', class: 'op', 'aria-pressed': 'false', text: v });
        b.onclick = function () {
          var on = b.getAttribute('aria-pressed') === 'true';
          ops.querySelectorAll('.op').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          if (!on) b.setAttribute('aria-pressed', 'true');
          resp[clave] = on ? undefined : v; cambio();
        };
        ops.appendChild(b);
      });
      return el('div', { class: 'fila-esc' }, [el('div', { class: 'nombre', text: f }), ops]);
    }));
  }

  function campo(q) {
    if (q.tipo === 'uno') return opciones(q, false);
    if (q.tipo === 'varios') return opciones(q, true, q.max);
    if (q.tipo === 'top3') return top3(q);
    if (q.tipo === 'conteo') return conteo(q);
    if (q.tipo === 'escala') return escala(q);
    if (q.tipo === 'contacto') {
      var nom = el('input', { type: 'text', placeholder: 'Nombre', autocomplete: 'off' });
      var tel = el('input', { type: 'tel', placeholder: 'Teléfono a 10 dígitos', inputmode: 'tel', style: 'margin-top:8px' });
      var up = function () { resp.contacto = { nombre: nom.value.trim(), telefono: tel.value.replace(/\D/g, '') }; cambio(); };
      nom.oninput = up; tel.oninput = up;
      return el('div', {}, [nom, tel]);
    }
    var i = q.tipo === 'abierta' ? el('textarea', {}) :
            el('input', q.tipo === 'numero' ? { type: 'number', inputmode: 'numeric', min: '0' } : { type: 'text' });
    i.oninput = function () { var v = i.value.trim(); resp[q.id] = v === '' ? undefined : (q.tipo === 'numero' ? Number(v) : v); cambio(); };
    return i;
  }

  function bloque(q) {
    var etiqueta = el('span', { class: 'et' }, [
      q.n ? el('span', { class: 'num', text: q.n + '.' }) : null, document.createTextNode(q.label)]);
    var div = el('div', { class: 'q' }, [etiqueta, campo(q)]);
    preguntas.push({ q: q, div: div });
    return div;
  }

  function render() {
    $('barraTitulo').textContent = E.titulo;
    $('titulo').textContent = E.titulo;
    $('subtitulo').textContent = E.subtitulo;
    document.title = E.titulo;
    E.extrasTerritorio.forEach(function (q) { $('extras').appendChild(bloque(q)); });
    E.secciones.forEach(function (s, i) {
      $('secciones').appendChild(el('h2', {}, [el('span', { text: String(i + 1) }), document.createTextNode(s.titulo)]));
      s.preguntas.forEach(function (q) { $('secciones').appendChild(bloque(q)); });
    });
  }

  // ---------- estado ----------
  function visible(q) { return !q.si || resp[q.si.id] === q.si.valor; }
  function respondida(q) {
    if (q.tipo === 'top3') return !!resp[q.id + '_1'];
    if (q.tipo === 'conteo' || q.tipo === 'escala') return q.filas.some(function (f) { return resp[q.id + '_' + slug(f)] !== undefined; });
    if (q.tipo === 'contacto') return !!(resp.contacto && (resp.contacto.nombre || resp.contacto.telefono));
    return resp[q.id] !== undefined;
  }
  function cambio() {
    preguntas.forEach(function (p) { p.div.hidden = !visible(p.q); });
    avance();
  }
  function avance() {
    var vis = preguntas.filter(function (p) { return visible(p.q); });
    var hechas = vis.filter(function (p) { return respondida(p.q); }).length;
    $('barraAvance').textContent = hechas + ' de ' + vis.length;
    $('barraProgreso').style.width = (vis.length ? 100 * hechas / vis.length : 0) + '%';
  }

  // ---------- envío y cola sin señal ----------
  function pendientes() { try { return JSON.parse(ls(LS_PEND) || '[]'); } catch (e) { return []; } }
  function guardarPend(l) { ls(LS_PEND, JSON.stringify(l)); pintarPend(); }
  function pintarPend() {
    var n = pendientes().length;
    $('pendientes').textContent = n ? n + (n === 1 ? ' respuesta' : ' respuestas') + ' sin enviar' : '';
  }
  // POST como text/plain para evitar la verificación CORS previa; sin cookies de Google,
  // así no aparece el error de varias cuentas.
  function enviar(datos) {
    return fetch(window.MH_API, {
      method: 'POST', credentials: 'omit', redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ tipo: TIPO, columnas: window.encabezados(TIPO), datos: datos })
    }).then(function (r) { return r.json(); }).then(function (r) {
      if (!r.ok) { var e = new Error(r.error || 'No se guardó'); e.rechazo = true; throw e; }
      return r;
    });
  }
  function vaciarCola() {
    var l = pendientes();
    if (!l.length || !navigator.onLine) return;
    var d = l[0];
    enviar(d).then(function () {
      guardarPend(pendientes().filter(function (x) { return x.folio !== d.folio; }));
      vaciarCola();
    }).catch(function (e) {
      if (e && e.rechazo) {                     // el servidor la rechazó: no reintentar para siempre
        guardarPend(pendientes().filter(function (x) { return x.folio !== d.folio; }));
        vaciarCola();
      }
    });
  }

  function armar() {
    var d = { folio: folio(), capturado: new Date().toLocaleString('sv-SE'),
              aplicador: $('aplicador').value.trim(), seccion_electoral: $('seccion').value.trim(),
              consentimiento: 'Sí · aviso 2026-10' };
    for (var k in ubic) d[k] = ubic[k];
    var ocultas = {};
    preguntas.forEach(function (p) { if (!visible(p.q)) ocultas[p.q.id] = true; });
    for (var r in resp) {
      if (resp[r] === undefined) continue;
      if (ocultas[r] || (r === 'contacto' && ocultas.contacto)) continue;
      d[r] = resp[r];
    }
    return d;
  }

  function validar() {
    var faltan = [];
    if (!$('consentimiento').checked) faltan.push('el consentimiento');
    if (!$('aplicador').value.trim()) faltan.push('quién aplica');
    if (!ubic.colonia) faltan.push('la colonia');
    return faltan;
  }

  function alEnviar() {
    var err = document.querySelector('.error'); if (err) err.remove();
    var faltan = validar();
    if (faltan.length) {
      $('btnEnviar').parentNode.parentNode.insertBefore(
        el('div', { class: 'error', style: 'max-width:640px;margin:0 auto 8px', text: 'Falta ' + faltan.join(', ') + '.' }),
        $('btnEnviar').parentNode);
      return;
    }
    ls(LS_APL, $('aplicador').value.trim());
    ls(LS_SEC, $('seccion').value.trim());
    var d = armar(), b = $('btnEnviar');
    b.disabled = true; b.textContent = 'Guardando…';
    enviar(d).then(function (r) { listo(r.folio, false); })
      .catch(function (e) {
        if (e && e.rechazo) {
          b.disabled = false; b.textContent = 'Guardar respuesta';
          $('btnEnviar').parentNode.parentNode.insertBefore(
            el('div', { class: 'error', style: 'max-width:640px;margin:0 auto 8px', text: 'El Sheet rechazó la respuesta: ' + e.message }),
            $('btnEnviar').parentNode);
          return;
        }
        var l = pendientes(); l.push(d); guardarPend(l);
        listo(d.folio, true);
      });
  }

  function listo(f, enCola) {
    document.querySelector('.pie').hidden = true;
    var m = $('app'); m.innerHTML = '';
    m.appendChild(el('div', { class: 'listo' }, [
      el('p', { class: 'sub', text: enCola ? 'Sin señal: la respuesta quedó guardada en este teléfono y se enviará sola al recuperar conexión.' : 'Respuesta guardada en el Sheet.' }),
      el('div', { class: 'folio', text: f }),
      el('p', { class: 'sub', text: 'Anota este folio si la persona pide seguimiento.' }),
      el('button', { type: 'button', class: 'btn', style: 'width:100%', text: 'Nueva encuesta', onclick: function () { location.reload(); } })
    ]));
    window.scrollTo(0, 0);
  }

  // ---------- inicio ----------
  render();
  $('aplicador').value = ls(LS_APL) || '';
  $('seccion').value = ls(LS_SEC) || '';
  $('btnGps').onclick = detectar;
  $('btnBuscar').onclick = abrirBuscador;
  $('busca').oninput = filtrar;
  $('btnEnviar').onclick = alEnviar;
  window.addEventListener('online', vaciarCola);
  cambio(); pintarPend(); vaciarCola(); detectar();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js').catch(function () {});
})();
