import express from 'express';
import { createConnection } from 'mysql2/promise';

const app = express();
const port = 3000;

import path from "path";
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//configuracion
app.use(express.static(__dirname + "/public"));
app.use(express.json());

const db = await createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "SchoolSystem"
});

//rutas
app.get("/",(req,res)=>res.sendFile(__dirname + "/pages/inicio.html"));

app.get('/students', async (req, res) => {
  try {

    const [students] = await db.execute("SELECT id, first_name, last_name, email FROM students"); // Consultar a tu tabla
    res.send(students); // Enviar los datos obtenidos como respuesta
  } catch (error) {
    res.status(500).send('Error al obtener los datos');
  }
});

app.get('/teachers', async (req, res) => {

    try {
      const [teachers] = await db.execute("SELECT id, first_name, last_name, email FROM Teachers"); // Consultar a tu tabla
      res.send(teachers); // Enviar los datos obtenidos como respuesta
    } catch (error) {
      res.status(500).send('Error al obtener los datos');
    }
});

app.get('/courses', async (req, res) => {
    try {
  
      const [courses] = await db.execute("SELECT id, course_name, course_description, teacher_id FROM Courses"); // Consultar a tu tabla
      res.send(courses); // Enviar los datos obtenidos como respuesta
    } catch (error) {
      res.status(500).send('Error al obtener los datos');
    }
});

app.post('/enrollments', async (req, res) => {
    const { studentId, courses } = req.body;

    console.log('Datos recibidos en el servidor', { studentId, courses });


    if (!studentId || !courses || courses.length === 0) {
      return res.status(400).json({message:'Debe enviar un ID de estudiante y al menos un ID de curso.' });
    }

    //Insertamos los datos de la matricula en la base de datos
    const sql = 'INSERT INTO schoolsystem.Enrollments (student_id, course_id) VALUES ?';
    const values = courses.map(courseId => [studentId, courseId]);

    console.log('Consulta SQL preparada:', sql);
    console.log('Valores para insertar:', values);

    db.query(sql, [values], (error, result) => {
      if (error) {
        console.error('Error al insertar la matrícula:', error);
        return res.status(500).json({message:'Error al insertar la matrícula.' });
      }

      console.log('Inserción exitosa:', result);
      res.status(201).json({enrollmentId: result.insertId });
    });  
});

app.get('/teacherss', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT CONCAT(first_name, " ", last_name) AS full_name FROM Teachers');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener la lista de profesores:', error);
    res.status(500).json({ message: 'Error al obtener la lista de profesores' });
  }
});

//endpoint para consultar la vista de estudiantes en un curso
app.get('/enrollments/teacher/:teacher', async (req, res) => {
  const teacherName = req.params.teacher;
  try {
    const [rows] = await db.query(
      `SELECT * FROM enrolled_students_by_course WHERE Profesor = ?`,
      [teacherName]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al consultar la vista por profesor:', error);
    res.status(500).json({ message: 'Error al obtener los datos de matrícula' });
  }
});



app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
