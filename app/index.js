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

//consultar la vista de estudiantes en un curso
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

//Aquí podemos listar los estudiantes matriculados en cada curso
app.get('/courses/student-count', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.course_name, COUNT(e.student_id) AS total_students
      FROM Courses c
      LEFT JOIN Enrollments e ON c.id = e.course_id
      GROUP BY c.course_name;`
      );
    res.status(200).json(rows); // Enviar los datos obtenidos como respuesta
  } catch (error) {
    console.error('Error al consultar el conteo de estudiantes:', error);
    res.status(500).json({ message: 'Error al obtener el conteo de estudiantes' });
  }
});

//Subconsulta para mostrar cursos vacios o sin estudiantes sin matricular
app.get('/courses/empty', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, course_name 
      FROM Courses 
      WHERE id NOT IN (
          SELECT DISTINCT course_id 
          FROM Enrollments
      );
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al consultar cursos sin estudiantes:', error);
    res.status(500).json({ message: 'Error al obtener los cursos sin estudiantes.' });
  }
});

//consulta para promedio de estudiantes en todos los cursos
app.get('/courses/average-students', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT AVG(student_count) AS average_students_per_course
      FROM (
          SELECT COUNT(e.student_id) AS student_count
          FROM Courses c
          LEFT JOIN Enrollments e ON c.id = e.course_id
          GROUP BY c.id
      ) AS course_student_counts;
    `);

    const average = rows[0]?.average_students_per_course || 0;
    res.status(200).json({ average });
  } catch (error) {
    console.error('Error al calcular el promedio de estudiantes por curso:', error);
    res.status(500).json({ message: 'Error al calcular el promedio.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
