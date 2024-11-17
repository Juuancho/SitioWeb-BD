document.addEventListener('DOMContentLoaded', () => {
    const teacherSelect = document.getElementById('teacher-select');
    const enrollmentsTableBody = document.getElementById('enrollments-table').querySelector('tbody');
  
    // Cargar profesores en el dropdown
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
  