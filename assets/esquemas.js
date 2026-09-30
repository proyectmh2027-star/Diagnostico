/**
 * Esquemas de los dos formularios. Es la única fuente: editar aquí cambia el formulario
 * y las columnas del Sheet (las columnas nuevas se agregan al final de la hoja).
 *
 * Tipos: uno | varios | top3 | numero | texto | abierta | conteo | escala | contacto
 * - opciones con "Otro" abren un campo de texto.
 * - "si": {id, valor} muestra la pregunta sólo si otra tiene ese valor.
 */
window.ESQUEMAS = {
  familia: {
    titulo: 'Necesidades de la familia',
    hoja: 'Familia',
    subtitulo: 'Una persona mayor de 18 años por hogar · 10–12 min',
    extrasTerritorio: [
      { id: 'calle_ref', label: 'Calle o manzana de referencia', tipo: 'texto' },
      { id: 'modalidad', label: 'Modalidad', tipo: 'uno', opciones: ['Cara a cara', 'WhatsApp', 'Teléfono'] }
    ],
    secciones: [
      { titulo: 'Composición del hogar', preguntas: [
        { id: 'p06_personas', n: 6, label: '¿Cuántas personas viven en este hogar?', tipo: 'numero' },
        { id: 'p07', n: 7, label: '¿Cuántas personas hay de cada edad?', tipo: 'conteo',
          filas: ['Menores de 6', '6 a 17', '18 a 29', '30 a 59', '60 o más'] },
        { id: 'p08_sexo', n: 8, label: 'Sexo de quien responde', tipo: 'uno', opciones: ['Mujer', 'Hombre', 'Prefiero no decir'] },
        { id: 'p08_edad', label: 'Edad de quien responde', tipo: 'numero' },
        { id: 'p09_ingreso', n: 9, label: '¿Quién aporta principalmente el ingreso?', tipo: 'uno',
          opciones: ['Quien responde', 'Pareja', 'Hijos/as', 'Varias personas', 'Otro'] },
        { id: 'p10_cuidados', n: 10, label: '¿Algún integrante requiere cuidados permanentes (adulto mayor, discapacidad o enfermedad)?', tipo: 'uno', opciones: ['Sí', 'No'] }
      ]},
      { titulo: 'Vivienda y servicios', preguntas: [
        { id: 'p11_vivienda', n: 11, label: 'La vivienda es', tipo: 'uno', opciones: ['Propia pagada', 'Propia pagándose', 'Rentada', 'Prestada', 'Otro'] },
        { id: 'p12_fallas', n: 12, label: 'En el último mes, ¿han tenido fallas en…?', tipo: 'varios',
          opciones: ['Agua', 'Luz', 'Drenaje', 'Recolección de basura', 'Internet', 'Ninguna'] },
        { id: 'p13_agua_frec', n: 13, label: 'Si falla el agua, ¿con qué frecuencia?', tipo: 'uno', opciones: ['Diario', 'Semanal', 'Mensual', 'Casi nunca'] },
        { id: 'p14_reparacion', n: 14, label: '¿La vivienda necesita alguna reparación importante?', tipo: 'varios',
          opciones: ['Techo', 'Muros', 'Piso', 'Instalaciones', 'No necesita'] }
      ]},
      { titulo: 'Economía y empleo', preguntas: [
        { id: 'p15_trabajan', n: 15, label: '¿Cuántas personas del hogar trabajan actualmente?', tipo: 'numero' },
        { id: 'p16_tipo_trabajo', n: 16, label: 'Tipo de trabajo principal', tipo: 'uno',
          opciones: ['Formal con prestaciones', 'Por su cuenta', 'Informal sin prestaciones', 'Hogar', 'Pensionado/a', 'Buscando empleo'] },
        { id: 'p17_alcanza', n: 17, label: 'En los últimos 3 meses, ¿al hogar le alcanzó para…?', tipo: 'uno',
          opciones: ['Todo y ahorrar', 'Lo básico', 'No siempre para comida', 'Tuvo que endeudarse'] },
        { id: 'p18_apoyo', n: 18, label: '¿Alguien del hogar recibe algún apoyo o programa social?', tipo: 'uno', opciones: ['Sí', 'No', 'No sabe'] },
        { id: 'p19_negocio', n: 19, label: '¿Algún integrante tiene un negocio o quiere emprender?', tipo: 'uno', opciones: ['Tiene negocio', 'Quiere emprender', 'No'] }
      ]},
      { titulo: 'Salud y cuidados', preguntas: [
        { id: 'p20_salud', n: 20, label: '¿Dónde se atienden cuando se enferman?', tipo: 'uno',
          opciones: ['IMSS/ISSSTE', 'Centro de salud', 'Consultorio de farmacia', 'Privado', 'No se atienden'] },
        { id: 'p21_tiempo_salud', n: 21, label: '¿Cuánto tardan en llegar a su servicio de salud?', tipo: 'uno', opciones: ['Menos de 15 min', '15–30 min', 'Más de 30 min'] },
        { id: 'p22_quien_cuida', n: 22, label: '¿Quién cuida a niñas, niños o personas mayores mientras otros trabajan?', tipo: 'uno',
          opciones: ['Familiar', 'Guardería/estancia', 'Nadie', 'No aplica'] }
      ]},
      { titulo: 'Educación y juventud', preguntas: [
        { id: 'p23_no_escuela', n: 23, label: '¿Hay menores en edad escolar que no asisten a la escuela?', tipo: 'uno', opciones: ['Sí', 'No', 'No aplica'] },
        { id: 'p24_jovenes', n: 24, label: '¿Qué les falta a las y los jóvenes del hogar? (hasta 2)', tipo: 'varios', max: 2,
          opciones: ['Empleo', 'Becas', 'Deporte', 'Cultura', 'Capacitación', 'Espacios seguros'] }
      ]},
      { titulo: 'Movilidad y seguridad', preguntas: [
        { id: 'p25_traslado', n: 25, label: 'Principal forma de traslado al trabajo o escuela', tipo: 'uno',
          opciones: ['Transporte público', 'Auto', 'Moto', 'Bici', 'A pie', 'Plataforma'] },
        { id: 'p26_tiempo_traslado', n: 26, label: 'Tiempo de traslado de ida', tipo: 'uno', opciones: ['Menos de 30 min', '30–60 min', '1–2 h', 'Más de 2 h'] },
        { id: 'p27_seguridad', n: 27, label: '¿Qué tan seguro se siente al caminar de noche por su calle?', tipo: 'uno',
          opciones: ['Muy seguro', 'Algo seguro', 'Poco seguro', 'Nada seguro'] }
      ]},
      { titulo: 'Prioridades del hogar', preguntas: [
        { id: 'p28_prioridad', n: 28, label: 'Las 3 necesidades más urgentes de su familia (toque en orden: 1, 2, 3)', tipo: 'top3',
          opciones: ['Agua', 'Empleo/ingresos', 'Salud', 'Seguridad', 'Vivienda', 'Transporte', 'Educación', 'Cuidados', 'Alimentación', 'Otro'] },
        { id: 'p29_una_cosa', n: 29, label: 'Si pudiera pedir una sola cosa para mejorar la vida de su familia, ¿qué sería?', tipo: 'abierta' },
        { id: 'p30_contacto', n: 30, label: '¿Le gustaría que le contactemos para dar seguimiento?', tipo: 'uno', opciones: ['Sí', 'No'] },
        { id: 'contacto', label: 'Nombre y teléfono (se guarda aparte)', tipo: 'contacto', si: { id: 'p30_contacto', valor: 'Sí' } }
      ]}
    ]
  },

  colonia: {
    titulo: 'Necesidades de la colonia',
    hoja: 'Colonia',
    subtitulo: 'Vecinas, vecinos, líderes y comercios · 8–10 min',
    extrasTerritorio: [],
    secciones: [
      { titulo: 'Quién responde', preguntas: [
        { id: 'p04_perfil', n: 4, label: 'Perfil de quien responde', tipo: 'uno',
          opciones: ['Vecino/a', 'Líder de manzana o comité', 'Comerciante local', 'Iglesia u organización', 'Otro'] },
        { id: 'p05_anios', n: 5, label: '¿Cuántos años lleva en la colonia?', tipo: 'uno', opciones: ['Menos de 2', '2–10', 'Más de 10'] }
      ]},
      { titulo: 'Servicios de la colonia', preguntas: [
        { id: 'p06', n: 6, label: 'Califique cada servicio (1 = muy malo, 5 = muy bueno)', tipo: 'escala',
          escala: ['1', '2', '3', '4', '5', 'No hay'],
          filas: ['Agua potable', 'Alumbrado público', 'Pavimento y baches', 'Drenaje y pluvial', 'Recolección de basura',
                  'Transporte público', 'Banquetas y cruces', 'Vigilancia', 'Parques y áreas verdes', 'Espacios deportivos'] }
      ]},
      { titulo: 'Problemas del entorno', preguntas: [
        { id: 'p07_problemas', n: 7, label: 'En el último año, ¿cuáles de estos problemas ha visto en la colonia?', tipo: 'varios',
          opciones: ['Robos a casa o auto', 'Asaltos', 'Venta de drogas', 'Pandillas', 'Baldíos o casas abandonadas', 'Basura en la calle',
                     'Inundaciones', 'Ruido', 'Perros en situación de calle', 'Tráfico o estacionamiento'] },
        { id: 'p08_punto', n: 8, label: '¿Hay algún punto específico que considere peligroso o problemático? (calle, esquina, parque)', tipo: 'abierta' },
        { id: 'p09_tendencia', n: 9, label: 'Ese problema, en el último año…', tipo: 'uno', opciones: ['Empeoró', 'Sigue igual', 'Mejoró'] }
      ]},
      { titulo: 'Equipamiento y espacio público', preguntas: [
        { id: 'p10_falta', n: 10, label: '¿Qué le hace falta a la colonia? (hasta 3)', tipo: 'varios', max: 3,
          opciones: ['Parque o plaza', 'Cancha', 'Centro comunitario', 'Guardería', 'Centro de salud', 'Biblioteca', 'Mercado', 'Ciclovía', 'Árboles y sombra', 'Otro'] },
        { id: 'p11_abandonado', n: 11, label: '¿Hay un centro comunitario o espacio público sin uso o abandonado?', tipo: 'uno', opciones: ['Sí', 'No'] },
        { id: 'p11_donde', label: '¿Dónde está?', tipo: 'texto', si: { id: 'p11_abandonado', valor: 'Sí' } },
        { id: 'p12_actividades', n: 12, label: '¿Qué actividades le gustaría que hubiera?', tipo: 'varios',
          opciones: ['Deporte', 'Cultura', 'Talleres de oficio', 'Adultos mayores', 'Niñez', 'Jóvenes', 'Ferias de empleo'] }
      ]},
      { titulo: 'Organización vecinal', preguntas: [
        { id: 'p13_comite', n: 13, label: '¿Existe comité de vecinos o junta de mejoras activa?', tipo: 'uno', opciones: ['Sí', 'No', 'No sabe'] },
        { id: 'p14_organizacion', n: 14, label: '¿Qué tanto se organizan las y los vecinos para resolver problemas?', tipo: 'uno', opciones: ['Mucho', 'Algo', 'Poco', 'Nada'] },
        { id: 'p15_acuden', n: 15, label: 'Cuando la colonia tiene un problema, ¿a quién acuden primero?', tipo: 'uno',
          opciones: ['Municipio (073 u oficina)', 'Líder vecinal', 'Regidor/a', 'Redes sociales', 'Nadie'] },
        { id: 'p16_atencion', n: 16, label: '¿Qué tan atendidas se sienten las necesidades de la colonia por el municipio?', tipo: 'uno',
          opciones: ['Muy atendidas', 'Algo', 'Poco', 'Nada'] },
        { id: 'p17_participaria', n: 17, label: '¿Participaría en reuniones o actividades para mejorar la colonia?', tipo: 'uno', opciones: ['Sí', 'Tal vez', 'No'] }
      ]},
      { titulo: 'Prioridades de la colonia', preguntas: [
        { id: 'p18_prioridad', n: 18, label: 'Los 3 problemas más urgentes de la colonia (toque en orden: 1, 2, 3)', tipo: 'top3',
          opciones: ['Agua', 'Seguridad', 'Calles y baches', 'Alumbrado', 'Inundaciones', 'Transporte', 'Espacios públicos', 'Basura', 'Empleo', 'Otro'] },
        { id: 'p19_una_obra', n: 19, label: 'Si el municipio pudiera hacer una sola obra o acción este año, ¿cuál debería ser?', tipo: 'abierta' },
        { id: 'p20_referido', n: 20, label: '¿Conoce a alguien en la colonia con quien deberíamos platicar?', tipo: 'uno', opciones: ['Sí', 'No'] },
        { id: 'contacto', label: 'Nombre y teléfono de esa persona, con su permiso (se guarda aparte)', tipo: 'contacto', si: { id: 'p20_referido', valor: 'Sí' } }
      ]},
      { titulo: 'Observación directa (la llena quien aplica)', preguntas: [
        { id: 'obs_manzana', label: '¿Qué observa al recorrer la manzana?', tipo: 'varios',
          opciones: ['Baches', 'Luminarias apagadas', 'Basura acumulada', 'Lotes baldíos', 'Banquetas dañadas', 'Grafiti', 'Encharcamientos'] }
      ]}
    ]
  }
};

/** Columnas comunes al inicio de cada hoja. */
window.COLUMNAS_BASE = ['folio', 'recibido', 'capturado', 'aplicador', 'seccion_electoral', 'colonia', 'colonia_id', 'cp',
                     'distrito_local', 'deteccion_colonia', 'lat', 'lng', 'precision_m'];

/** Encabezados de la hoja a partir del esquema. */
window.encabezados = function (tipo) {
  var e = window.ESQUEMAS[tipo], cols = window.COLUMNAS_BASE.slice();
  e.extrasTerritorio.forEach(function (q) { cols.push(q.id); });
  e.secciones.forEach(function (s) {
    s.preguntas.forEach(function (q) {
      if (q.tipo === 'contacto') return;             // va a la hoja Contactos
      if (q.tipo === 'top3') { cols.push(q.id + '_1', q.id + '_2', q.id + '_3'); return; }
      if (q.tipo === 'conteo' || q.tipo === 'escala') {
        q.filas.forEach(function (f) { cols.push(q.id + '_' + window.slug(f)); }); return;
      }
      cols.push(q.id);
    });
  });
  return cols;
};

window.slug = function (t) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
};
