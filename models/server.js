const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categoria: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
        };

        // Conexión a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parse del body
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.buscar, require('../routes/buscar'));
        this.app.use(this.path.categoria, require('../routes/categorias'));
        this.app.use(this.path.productos, require('../routes/productos'));
        this.app.use(this.path.usuarios, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () =>
            console.log('Servidor corriendo en el puerto:', this.port)
        );
    }
}

module.exports = Server;
