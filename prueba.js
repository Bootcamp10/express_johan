const express = require('express');
const { Pool } = require('pg');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
require("dotenv").config()

const pool = new Pool({
    user: 'default',
    host: 'ep-orange-smoke-08960365.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 'bf3BTmnKYd4P',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

const API_KEY = process.env.API_KEY

const apikeyvalidation = (req, res, next) => {
    const userapikey = req.get('x-api-key');
    if (userapikey && userapikey === API_KEY) {
        next();
    } else {

        res.status(401).send('Invalid Api Key');
    }
};
app.use(apikeyvalidation);

app.get('/students', (req, res) => {
    const listUsersQuery = `SELECT * FROM students;`;

    pool.query(listUsersQuery)
        .then(data => {
            console.log("List students: ", data.rows);
            res.send(data.rows);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error al obtener estudiantes');
        });
});

app.post('/students', (req, res) => {
    const { id, name, lastname, notes } = req.body;
    const createQuery = `INSERT INTO students (id, name, lastname, notes) VALUES ($1, $2, $3, $4)`;
    
    pool.query(createQuery, [id, name, lastname, notes])
        .then(data => {
            console.log("Student inserted: ", data.rows);
            res.send('Estudiante insertado exitosamente');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error al insertar estudiante');
        });
});

// Actualizar un estudiante
app.put('/students/:id', (req, res) => {
    const { name, lastname, notes } = req.body;
    const updateQuery = `UPDATE students SET name=$1, lastname=$2, notes=$3 WHERE id=$4`;

    pool.query(updateQuery, [name, lastname, notes, req.params.id])
        .then(data => {
            console.log("Student updated: ", data.rows);
            res.send('Estudiante actualizado exitosamente');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error al actualizar estudiante');
        });
});

// Eliminar un estudiante
app.delete('/students/:id', (req, res) => {
    const deleteQuery = `DELETE FROM students WHERE id=$1`;

    pool.query(deleteQuery, [req.params.id])
        .then(data => {
            console.log("Student deleted: ", data.rows);
            res.send('Estudiante eliminado exitosamente');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error al eliminar estudiante');
        });
});

app.listen(PORT, () => {
    console.log('El servidor está ejecutándose en el puerto', PORT);
});
