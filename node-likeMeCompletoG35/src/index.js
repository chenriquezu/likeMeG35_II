const express = require('express');
const cors = require('cors');

const dotenv  = require('dotenv').config();

const {postPost,getPosts,deletePosts,putPost} = require('./controllers/component')

//se define constante con el pueto a utilizar
const PORT = process.env.PORT;

//importamos los callbacks a utilizar

//Se instancia express para creación de lsa rutas solicitadas
const app = express();

//Habilitamos los cors para el middleware de los distintos dominios.
app.use(cors());

//se configuran las peticiones en json
app.use(express.json());

app.get('/posts',getPosts);
app.post('/posts',postPost);
app.delete('/posts/:id',deletePosts);
app.put('/posts/like/:id',putPost)

//se inicia el servidor
app.listen(PORT,()=>{
    console.log(`Servidor de Express escuchando en el puerto ${PORT}`);
})
