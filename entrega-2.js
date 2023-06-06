const express = require('express');
const mongoose = require('mongoose');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();


mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a la base de datos establecida');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });


app.use(express.json());


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
