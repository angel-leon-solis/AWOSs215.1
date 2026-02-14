const require=('../config/db');

const buscarproductos = async (req, res) => {
    try{
        const termino = req.params.termino;
        const query =` SELECT P.*, c.nombre as categoria from productos p 
        join categoria c in p.id_categoria`
    }
}