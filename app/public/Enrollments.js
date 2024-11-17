document.addEventListener('DOMContentLoaded', function() {
    const studentSelect = document.getElementById('student-select');
    const coursesSelect = document.getElementById('courses-select');
  
    // Obtener estudiantes desde el servidor
    fetch('/students')
      .then(response => response.json())
      .then(data => {
        data.forEach(student => {
          const option = document.createElement('option');
          option.value = student.id;
          option.textContent = `${student.first_name} ${student.last_name}`;
          studentSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error al cargar los estudiantes:', error);
      });
  
    // Obtener cursos desde el servidor
    fetch('/courses')
      .then(response => response.json())
      .then(data => {
        data.forEach(course => {
          const option = document.createElement('option');
          option.value = course.id;
          option.textContent = course.course_name;
          coursesSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error al cargar los cursos:', error);
      });
  
    // Manejar la matriculación
    document.getElementById('enrollment-form').addEventListener('submit', function(event) {
      event.preventDefault();
      
      const studentSelect = document.getElementById('student-select');
      const coursesSelect = document.getElementById('courses-select');

      const selectedStudentId = studentSelect.value;
      const selectedCourses = Array.from(coursesSelect.selectedOptions).map(option => option.value);
  
      if (!selectedStudentId || selectedCourses.length === 0) {
        alert('Debe seleccionar un estudiante y al menos un curso.');
        return;
      }
      
      const selectedStudentName = studentSelect.options[studentSelect.selectedIndex].textContent;
      const courseNames = selectedCourses.map(id => {
        const courseOption = Array.from(coursesSelect.options).find(option => option.value === id);
        return courseOption ? courseOption.textContent : '';
      }).join(', ');
  
      // Agregar la inscripción a la tabla de matrículas
      const enrollmentsTableBody = document.getElementById('enrollments-table-body');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${selectedStudentId}</td>
        <td>${selectedStudentName}</td>
        <td>${courseNames}</td>
      `;
      enrollmentsTableBody.appendChild(row);

      // Enviar la matrícula al servidor
      fetch('/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudentId,
          courses: selectedCourses,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Matriculación exitosa:', data);
        })
        .catch(error => {
          console.error('Error al matricular:', error);
        });
  
      // Limpiar el formulario
      studentSelect.value = '';
      coursesSelect.selectedIndex = -1;
    });
  });
  