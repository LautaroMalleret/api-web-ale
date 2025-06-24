const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const authMiddleware = require('../middleware/auth.middleware');


// GET todos los productos
// router.get('/', async (req, res) => {
//   const productos = await Producto.find();
//   res.json(productos);
// });
//FILTRO Y ORDENAMIENTO DE PRODUCTOS
// router.get('/', async (req, res) => {
//   try {
//     const { tipo, destacado, tipoPrenda, orden } = req.query;

//     const filtro = {};

//     if (tipo) filtro.tipo = tipo;
//     if (destacado) filtro.destacado = destacado === 'true';
//     if (tipoPrenda) filtro['ropa.tipoPrenda'] = tipoPrenda;

//     // Orden por precio
//     let ordenamiento = {};
//     if (orden === 'asc') ordenamiento.precio = 1;
//     else if (orden === 'desc') ordenamiento.precio = -1;

//     const productos = await Producto.find(filtro).sort(ordenamiento);
//     res.json(productos);
//   } catch (err) {
//     res.status(500).json({ mensaje: 'Error al obtener productos' });
//   }
// });



//////////////////////////
router.get('/', async (req, res) => {
  try {
    const { tipo, destacado, tipoPrenda, orden, nombre } = req.query;
    const filtro = {};

    if (tipo) filtro.tipo = tipo;
    if (destacado) filtro.destacado = destacado === 'true';
    if (tipoPrenda) filtro['ropa.tipoPrenda'] = tipoPrenda;
    if (nombre) filtro.nombre = { $regex: nombre, $options: 'i' }; // 👈 filtro por nombre, sin distinguir mayúsculas

    let ordenamiento = {};
    if (orden === 'asc') ordenamiento.precio = 1;
    else if (orden === 'desc') ordenamiento.precio = -1;

    const productos = await Producto.find(filtro).sort(ordenamiento);
    res.json(productos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
});

// GET producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al buscar el producto' });
  }
});


// POST nuevo producto
router.post('/', authMiddleware,async (req, res) => {
  const nuevoProducto = new Producto(req.body);
  await nuevoProducto.save();
  res.json(nuevoProducto);
});

// POST /api/productos/bulk
router.post('/bulk',authMiddleware, async (req, res) => {
  try {
    const productos = req.body; // Espera un array de productos
    if (!Array.isArray(productos)) {
      return res.status(400).json({ message: 'Se espera un array de productos' });
    }
    const result = await Producto.insertMany(productos);
    res.status(201).json({ message: 'Productos agregados', productos: result });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar productos', error });
  }
});


// DELETE producto por ID
router.delete('/:id', authMiddleware,async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
});

// Eliminar todos los productos (solo para pruebas)
router.delete('/', authMiddleware,async (req, res) => {
  try {
    await Producto.deleteMany({});
    res.status(200).json({ message: 'Todos los productos fueron eliminados' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar productos', error });
  }
});


// PUT (editar producto)
router.put('/:id', authMiddleware,async (req, res) => {
  const productoActualizado = await Producto.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(productoActualizado);
});

// PATCH /api/productos/:id
router.patch('/:id',authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // campos a modificar
    
    const productoActualizado = await Producto.findByIdAndUpdate(id, updates, {
      new: true,          // devuelve el documento actualizado
      runValidators: true // valida según el esquema
    });

    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(productoActualizado);

  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto', error });
  }
});

module.exports = router;
