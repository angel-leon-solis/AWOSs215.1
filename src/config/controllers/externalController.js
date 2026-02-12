const pool = require('../config/db');

const poblarProductos = async (request, response) => {
    try {
        
        const apiFetch = await fetch('https://fakestoreapi.com/products');
        const products = await apiFetch.json();

        let inserciones = 0;

        for (const product of products) {

           
            const { title, price, description, image, category } = product;

            const stock = Math.floor(Math.random() * 50) + 1;

            let categoriaId;

            
            const categoriaExistente = await pool.query(
                'SELECT id FROM categoria WHERE nombre = $1',
                [category]
            );

            if (categoriaExistente.rows.length > 0) {
                categoriaId = categoriaExistente.rows[0].id;
            } else {
                const nuevaCategoria = await pool.query(
                    'INSERT INTO categoria (nombre) VALUES ($1) RETURNING id',
                    [category]
                );
                categoriaId = nuevaCategoria.rows[0].id;
            }

            
            const query = `
                INSERT INTO productos
                (nombre, precio, stock, descripcion, imagen_url, id_categoria)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;

            await pool.query(query, [
                title,
                price,
                stock,
                description,
                image,
                categoriaId
            ]);

            inserciones++;
        }

        response.status(200).json({
            mensaje: "Carga masiva exitosa",
            cantidad: inserciones
        });

    } catch (error) {
        console.error("Error:", error);
        response.status(500).json({ error: error.message });
    }
};

module.exports = { poblarProductos };