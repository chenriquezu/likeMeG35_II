const { Pool } = require('pg');
const dotenv = require('dotenv').config();


//Configuramos el entorno de conexion al servidor postgress
const conexion = new Pool({
    user: process.env.DBP_USER,
    host: process.env.DBP_SERVER,
    database: process.env.DBP_DATABASE,
    password: process.env.DBP_PASSWORD,
    port: process.env.DBP_PORT,
    allowExitOnIdle: true,
    max:20    


});

     //lee lo post de la base de datos
    const getPosts = async(req,res)=>{
          try {
                const result = await  conexion.query('Select * from posts order by id');
                const posts = result.rows;
                res.json(posts);   
            } catch (error) {
                res.status(500).json({ message: `Error al obtener los datos posts` });
            }

    }  
    //Insertamos un nuevo post en la BD
    const postPost = async(req,res)=>{
        const {titulo,url,descripcion} = req.body;
        const img = url;
        const likes = 0;
        try {
            const result = await conexion.query(
                'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING id',
                [titulo, img, descripcion, likes]
            );
            
            const postId = result.rows[0].id;
            res.json({ id: postId, titulo, img, descripcion, likes });
        } catch (error) {
            res.status(500).json({ message: `Error al obtener los posts ${process.env.DB_USER} ${process.env.DB_HOST} ${process.env.DB_NAME} ${process.env.DB_PORT}` });
        }
    }

    //actualizamos un posts
    const putPost = async(req,res)=> {
        const {id} = req.params;
        const conect = await conexion.connect();
       try {
        const result = await conect.query('UPDATE posts SET likes =  likes + 1 WHERE id = $1 RETURNING *', [id]);
        const updateresult = result.rows[0];
        res.json(updateresult);
       
       } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
       } finally {
        conect.release();
    }
 }

    //Eliminar un post existente
    const deletePosts =async(req,res)=>{
        const {id} = req.params;
       
        try {
           const conect = await conexion.connect();
           await conect.query('Delete From posts Where  id = $1', [id]);
           conect.release();
           res.sendStatus(204);
           } catch (error) {
             res.status(500).json({ message: `Error al Elimninar  los posts` });
           }
    }

 module.exports = {postPost,getPosts,deletePosts,putPost};