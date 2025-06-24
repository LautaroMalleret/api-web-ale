const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['ropa', 'accesorio', 'calzado']
  },
  ropa: {
    type: new mongoose.Schema({
      talle: [{ type: String, required: true }],
      tipoPrenda: { type: String, required: true }
    },{ _id: false }),
    required: function () {
      return this.tipo === 'ropa';
    }
  },
  calzado: {
    type: new mongoose.Schema({
      talle: [{ type: Number, required: true }]
    }, { _id: false }),
    required: function () {
      return this.tipo === 'calzado';
    }
  },
  // imagenUrl: {
  imagenes:{
  // type: String,
    type: [String],
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  destacado: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Producto', ProductoSchema);
// Este modelo define la estructura de los productos en la base de datos MongoDB.
// Incluye validaciones para los campos requeridos y tipos de datos.
// El campo 'ropa' y 'calzado' son objetos anidados que contienen información específica para cada tipo de producto.
// El campo 'destacado' es un booleano que indica si el producto es destacado o no.
// El modelo se exporta para ser utilizado en las rutas de la API.