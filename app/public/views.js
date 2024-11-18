document.addEventListener('DOMContentLoaded', () => {
    const teacherSelect = document.getElementById('teacher-select');
    const enrollmentsTableBody = document.getElementById('enrollments-table').querySelector('tbody');
  
    fetch('/teacherss')
      .then(response => response.json())
      .then(data => {
        data.forEach(teacher => {
          const option = document.createElement('option');
          option.value = teacher.full_name;
          option.textContent = teacher.full_name;
          teacherSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error al cargar la lista de profesores:', error));
  
    // Consultar inscripciones por profesor
    document.getElementById('fetch-enrollments').addEventListener('click', () => {
      const selectedTeacher = teacherSelect.value;
  
      if (!selectedTeacher) {
        alert('Por favor selecciona un profesor.');
        return;
      }
  
      // Limpia la tabla antes de cargar nuevos datos
      enrollmentsTableBody.innerHTML = '';
  
      // Llama al endpoint con el nombre del profesor
      fetch(`/enrollments/teacher/${encodeURIComponent(selectedTeacher)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al consultar las inscripciones');
          }
          return response.json();
        })
        .then(data => {
          if (data.length === 0) {
            alert('No hay inscripciones para este profesor.');
            return;
          }
  
          // Agregar filas a la tabla con los datos recibidos
          data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${row.Curso}</td>
              <td>${row.Profesor}</td>
              <td>${row.Estudiante}</td>
              <td>${row.Fecha_Matricula}</td>
            `;
            enrollmentsTableBody.appendChild(tr);
          });
        })
        .catch(error => {
          console.error('Error:', error);
          alert('No se pudo obtener la información');
        });
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('student-count-table').querySelector('tbody');
  
    const loadStudentCount = () => {

      fetch('/courses/student-count')
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener los datos');
          }
          return response.json();
        })
        .then(data => {
          // Llenar la tabla con los resultados
          data.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${course.course_name}</td>
              <td>${course.total_students}</td>
            `;
            tableBody.appendChild(row);
          });
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Hubo un error al obtener los datos.');
        });
    };

    //Cargamos los datos al cargar la página
    loadStudentCount();
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const emptyCoursesTableBody = document.getElementById('empty-courses-table').querySelector('tbody');
  
    // Función para cargar los cursos vacíos
    const loadEmptyCourses = () => {
      fetch('/courses/empty')
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener los cursos vacíos');
          }
          return response.json();
        })
        .then(data => {
          emptyCoursesTableBody.innerHTML = '';
  
          // Mostramos los cursos vacíos
          if (data.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML= '<td colspan="2">Todos los cursos tienen estudiantes matriculados.</td>';
            emptyCoursesTableBody.appendChild(row);
          } else {
            data.forEach(course => {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${course.id}</td>
                <td>${course.course_name}</td>
              `;
            emptyCoursesTableBody.appendChild(row);
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Hubo un error al obtener los cursos vacíos.');
        });
    };
  
    loadEmptyCourses();
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const averageStudentsElement = document.getElementById('average-students');
  
    // Función para cargar el promedio de estudiantes por curso
    const loadAverageStudents = () => {
      fetch('/courses/average-students')
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener el promedio'); // Correct the misspelled word 'promedio'
          }
          return response.json();
        })
        .then(data => {
          const average = data.average;
          averageStudentsElement.textContent = `El promedio de estudiantes por curso es: ${average}`;
        })
        .catch(error => {
          console.error('Error:', error);
          averageStudentsElement.textContent = 'No se pudo calcular el promedio.';
        });
    };
  
    loadAverageStudents();
  });
  