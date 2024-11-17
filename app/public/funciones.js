console.log("Anthony");

async function fetchData(url, tableBodyId) {
    const response = await fetch(url);
    const data = await response.json();
    const tableBody = document.getElementById(tableBodyId);

    data.forEach((row) => {
      const tr = document.createElement('tr');
      Object.keys(row).forEach((key) => {
        const td = document.createElement('td');
        td.textContent = row[key];
        td.id = `${tableBodyId}-${key}-${row.id}`; // IDs únicos por tabla y campo
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  }

  window.onload = function() {
    fetchData('/students', 'students-table-body');
    fetchData('/teachers', 'teachers-table-body');
    fetchData('/courses', 'courses-table-body');
  };
 

  ///new
  document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const nav = document.querySelector('nav');
  
    menuIcon.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  });