// ===== DATA =====
const producers = [
  // Cafe
  { name: 'Don Manuel - Cafe de Altura', type: 'cafe', rating: 4.9, distance: '1.2 km', digital: true, offset: [0.008, -0.005] },
  { name: 'Finca Santa Elena - Cafe', type: 'cafe', rating: 4.7, distance: '3.1 km', digital: true, offset: [-0.012, 0.006] },
  { name: 'Cafe Don Pedro Ixchel', type: 'cafe', rating: 4.5, distance: '4.8 km', digital: false, offset: [0.015, 0.011] },
  { name: 'Finca La Montana - Cafe', type: 'cafe', rating: 4.6, distance: '4.2 km', digital: false, offset: [-0.007, -0.008] },
  { name: 'Cafe Organico Los Altos', type: 'cafe', rating: 4.8, distance: '2.5 km', digital: true, offset: [0.004, -0.014] },
  { name: 'Finca El Cipres - Cafe', type: 'cafe', rating: 4.3, distance: '5.5 km', digital: false, offset: [-0.016, -0.003] },
  // Cacao
  { name: 'Finca Don Jose - Cacao', type: 'cacao', rating: 4.8, distance: '2.1 km', digital: true, offset: [0.006, 0.009] },
  { name: 'Cacao Fino La Cumbre', type: 'cacao', rating: 4.4, distance: '5.0 km', digital: false, offset: [-0.009, 0.004] },
  { name: 'Chocolates Doña Lupita', type: 'cacao', rating: 4.6, distance: '3.7 km', digital: true, offset: [0.013, -0.008] },
  { name: 'Cacao Ancestral Lenca', type: 'cacao', rating: 4.7, distance: '2.9 km', digital: true, offset: [-0.005, -0.013] },
  { name: 'Finca Rio Cacao', type: 'cacao', rating: 4.2, distance: '6.1 km', digital: false, offset: [0.018, 0.005] },
  // Comedores
  { name: 'Comedor Dona Rosa', type: 'comedor', rating: 4.7, distance: '3.5 km', digital: false, offset: [-0.004, 0.007] },
  { name: 'Comedor Dona Maria', type: 'comedor', rating: 4.5, distance: '2.8 km', digital: true, offset: [0.003, -0.01] },
  { name: 'Baleadas Tia Carmen', type: 'comedor', rating: 4.9, distance: '1.5 km', digital: true, offset: [-0.002, 0.012] },
  { name: 'Comedor El Rincon Lenca', type: 'comedor', rating: 4.3, distance: '4.0 km', digital: false, offset: [0.011, 0.014] },
  { name: 'Pupuseria Dona Santos', type: 'comedor', rating: 4.6, distance: '3.3 km', digital: true, offset: [-0.014, -0.006] },
  { name: 'Comedor La Milpa', type: 'comedor', rating: 4.4, distance: '5.2 km', digital: false, offset: [0.009, -0.016] },
  { name: 'Antojitos Copanecos', type: 'comedor', rating: 4.1, distance: '6.0 km', digital: false, offset: [-0.011, 0.015] },
];

const markerColors = {
  cafe: '#6F4E37',
  cacao: '#8B4513',
  comedor: '#D4A24E',
};

const pagosData = [
  {
    name: 'Don Manuel - Cafe de Altura', sub: 'Tour + Degustacion', total: 385,
    items: [
      { desc: 'Tour cafe (2 pers.)', price: 200 },
      { desc: 'Degustacion premium', price: 50 },
      { desc: '2 Tazas de cafe', price: 60 },
      { desc: 'Pan de casa (2)', price: 40 },
      { desc: 'Baleada sencilla', price: 35 },
    ]
  },
  {
    name: 'Chocolates Dona Lupita', sub: 'Taller de chocolate', total: 250,
    items: [
      { desc: 'Taller chocolate (2 pers.)', price: 150 },
      { desc: 'Caja bombones artesanales', price: 60 },
      { desc: 'Bebida de cacao', price: 40 },
    ]
  },
  {
    name: 'Baleadas Tia Carmen', sub: 'Almuerzo familiar', total: 180,
    items: [
      { desc: 'Baleada especial x3', price: 90 },
      { desc: 'Tajadas con carne', price: 45 },
      { desc: 'Jugos naturales x3', price: 45 },
    ]
  },
  {
    name: 'Miel Los Pinos', sub: 'Compra de productos', total: 320,
    items: [
      { desc: 'Miel organica 500ml', price: 120 },
      { desc: 'Miel con panela 350ml', price: 85 },
      { desc: 'Cera de abeja natural', price: 65 },
      { desc: 'Polen granulado', price: 50 },
    ]
  },
  {
    name: 'Finca Santa Elena', sub: 'Tour de cafe + bolsa 1lb', total: 450,
    items: [
      { desc: 'Tour completo (2 pers.)', price: 250 },
      { desc: 'Bolsa cafe 1lb tostado', price: 120 },
      { desc: 'Degustacion 3 variedades', price: 80 },
    ]
  }
];

const rutasData = [
  {
    title: 'Ruta del Cafe de Copan',
    badge: 'RUTA POPULAR',
    meta: '3h 30min · 5 paradas · 12 km',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&h=200&fit=crop',
    stops: [
      { name: 'Finca Don Pedro', desc: 'Cafe de altura, tour de secado y tostado artesanal', digital: true, tags: ['30 min', 'Cafe', 'Degustacion'] },
      { name: 'Comedor Dona Maria', desc: 'Baleadas, sopa de caracol y comida tipica lenca', digital: true, tags: ['45 min', 'Comida', 'Almuerzo'] },
      { name: 'Cafe Organico Los Altos', desc: 'Cafe de exportacion, vista panoramica al valle', digital: true, tags: ['35 min', 'Cafe', 'Mirador'] },
      { name: 'Finca Santa Elena', desc: 'Proceso completo del grano a la taza', digital: false, tags: ['40 min', 'Cafe', 'Tour'] },
      { name: 'Taller de Ceramica Lenca', desc: 'Artesanias pintadas a mano, tecnica ancestral', digital: false, tags: ['40 min', 'Artesania', 'Taller'] },
    ]
  },
  {
    title: 'Ruta del Cacao Lenca',
    badge: 'EXPERIENCIA UNICA',
    meta: '2h 45min · 4 paradas · 9 km',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500&h=200&fit=crop',
    stops: [
      { name: 'Finca Don Jose - Cacao', desc: 'Plantacion de cacao fino, proceso de fermentacion', digital: true, tags: ['40 min', 'Cacao', 'Tour'] },
      { name: 'Chocolates Dona Lupita', desc: 'Taller de chocolate artesanal desde el grano', digital: true, tags: ['35 min', 'Chocolate', 'Degustacion'] },
      { name: 'Cacao Ancestral Lenca', desc: 'Bebida ceremonial de cacao preparada al estilo lenca', digital: false, tags: ['30 min', 'Cacao', 'Cultural'] },
      { name: 'Finca Rio Cacao', desc: 'Recorrido por senderos junto al rio con cacao silvestre', digital: false, tags: ['40 min', 'Naturaleza', 'Cacao'] },
    ]
  },
  {
    title: 'Sabores de Copan Ruinas',
    badge: 'GASTRONOMICA',
    meta: '4h · 6 paradas · 8 km',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=200&fit=crop',
    stops: [
      { name: 'Baleadas Tia Carmen', desc: 'Las mejores baleadas de Copan con frijoles caseros', digital: true, tags: ['30 min', 'Baleadas', 'Desayuno'] },
      { name: 'Comedor Dona Rosa', desc: 'Sopa de mondongo y platillos tipicos hondurenos', digital: false, tags: ['45 min', 'Comida', 'Tipico'] },
      { name: 'Pupuseria Dona Santos', desc: 'Pupusas rellenas al estilo copaneco', digital: true, tags: ['25 min', 'Pupusas', 'Antojitos'] },
      { name: 'Comedor El Rincon Lenca', desc: 'Gastronomia lenca con ingredientes de la milpa', digital: false, tags: ['40 min', 'Lenca', 'Cultural'] },
      { name: 'Antojitos Copanecos', desc: 'Tamales, riguas y atol de elote recien hecho', digital: false, tags: ['30 min', 'Antojitos', 'Merienda'] },
      { name: 'Comedor La Milpa', desc: 'Tortillas de maiz hecho a mano y cafe de olla', digital: true, tags: ['35 min', 'Comida', 'Cafe'] },
    ]
  },
  {
    title: 'Ruta Artesanal y Natural',
    badge: 'ECO-TURISMO',
    meta: '3h · 4 paradas · 10 km',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&h=200&fit=crop',
    stops: [
      { name: 'Miel Los Pinos', desc: 'Apiario organico, extraccion de miel y cata', digital: false, tags: ['35 min', 'Miel', 'Naturaleza'] },
      { name: 'Taller Ceramica Lenca', desc: 'Piezas unicas pintadas con tecnicas ancestrales', digital: false, tags: ['45 min', 'Artesania', 'Taller'] },
      { name: 'Jardin Medicinal Dona Ana', desc: 'Plantas medicinales y remedios naturales lencas', digital: false, tags: ['30 min', 'Plantas', 'Cultural'] },
      { name: 'Mirador El Cerrito', desc: 'Vista panoramica del valle con sendero ecologico', digital: false, tags: ['40 min', 'Mirador', 'Senderismo'] },
    ]
  },
  {
    title: 'Ruta Completa del Valle',
    badge: 'TODO EN UNO',
    meta: '5h 30min · 8 paradas · 18 km',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=200&fit=crop',
    stops: [
      { name: 'Finca Don Pedro - Cafe', desc: 'Tour de cafe con degustacion premium', digital: true, tags: ['30 min', 'Cafe', 'Tour'] },
      { name: 'Finca Don Jose - Cacao', desc: 'Proceso completo del cacao fino de aroma', digital: true, tags: ['35 min', 'Cacao', 'Tour'] },
      { name: 'Baleadas Tia Carmen', desc: 'Desayuno tipico copaneco', digital: true, tags: ['25 min', 'Comida', 'Desayuno'] },
      { name: 'Taller Ceramica Lenca', desc: 'Artesania ancestral pintada a mano', digital: false, tags: ['40 min', 'Artesania', 'Taller'] },
      { name: 'Miel Los Pinos', desc: 'Apiario y cata de mieles organicas', digital: false, tags: ['30 min', 'Miel', 'Naturaleza'] },
      { name: 'Comedor Dona Rosa', desc: 'Almuerzo tipico con sopa y plato fuerte', digital: false, tags: ['45 min', 'Comida', 'Almuerzo'] },
      { name: 'Chocolates Dona Lupita', desc: 'Taller de chocolate artesanal', digital: true, tags: ['35 min', 'Chocolate', 'Degustacion'] },
      { name: 'Mirador El Cerrito', desc: 'Atardecer panoramico sobre el valle', digital: false, tags: ['30 min', 'Mirador', 'Cierre'] },
    ]
  }
];
