document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('studentSearch');
  const studentList = document.getElementById('studentList');
  const table = studentList ? studentList.closest('table') : null;

  // Live search filter
  if (searchInput && studentList) {
    searchInput.addEventListener('input', function () {
      const filter = searchInput.value.toLowerCase();
      const rows = studentList.getElementsByTagName('tr');

      Array.from(rows).forEach(row => {
        const nameCell = row.getElementsByTagName('td')[0];
        if (nameCell) {
          const nameText = nameCell.textContent || nameCell.innerText;
          if (nameText.toLowerCase().indexOf(filter) > -1) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
      });
    });
  }

  // Table sorting
  if (table) {
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
      header.style.cursor = 'pointer';
      header.addEventListener('click', () => {
        sortTableByColumn(table, index);
      });
    });
  }

  function sortTableByColumn(table, columnIndex) {
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAscending = table.getAttribute('data-sort-dir') === 'asc';
    rows.sort((a, b) => {
      const aText = a.cells[columnIndex].textContent.trim();
      const bText = b.cells[columnIndex].textContent.trim();
      return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });
    rows.forEach(row => tbody.appendChild(row));
    table.setAttribute('data-sort-dir', isAscending ? 'desc' : 'asc');
  }

  // Pagination (simple)
  const rowsPerPage = 10;
  if (table && studentList) {
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.querySelectorAll('tr'));
    if (rows.length > rowsPerPage) {
      let currentPage = 1;
      const totalPages = Math.ceil(rows.length / rowsPerPage);

      function renderPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        rows.forEach((row, index) => {
          row.style.display = (index >= start && index < end) ? '' : 'none';
        });
        pageInfo.textContent = `Page ${page} of ${totalPages}`;
        prevBtn.disabled = page === 1;
        nextBtn.disabled = page === totalPages;
      }

      const paginationControls = document.createElement('div');
      paginationControls.className = 'pagination-controls d-flex justify-content-center align-items-center gap-3 mt-3';

      const prevBtn = document.createElement('button');
      prevBtn.textContent = 'Previous';
      prevBtn.className = 'btn btn-secondary btn-sm';
      prevBtn.disabled = true;
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderPage(currentPage);
        }
      });

      const nextBtn = document.createElement('button');
      nextBtn.textContent = 'Next';
      nextBtn.className = 'btn btn-secondary btn-sm';
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderPage(currentPage);
        }
      });

      const pageInfo = document.createElement('span');
      pageInfo.className = 'page-info';

      paginationControls.appendChild(prevBtn);
      paginationControls.appendChild(pageInfo);
      paginationControls.appendChild(nextBtn);

      table.parentNode.insertBefore(paginationControls, table.nextSibling);

      renderPage(currentPage);
    }
  }

  // 1. Client-side Form Validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function (event) {
      let valid = true;
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          valid = false;
          input.classList.add('is-invalid');
          if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('invalid-feedback')) {
            const error = document.createElement('div');
            error.className = 'invalid-feedback';
            error.textContent = 'This field is required.';
            input.parentNode.insertBefore(error, input.nextSibling);
          }
        } else {
          input.classList.remove('is-invalid');
          if (input.nextElementSibling && input.nextElementSibling.classList.contains('invalid-feedback')) {
            input.nextElementSibling.remove();
          }
        }
      });
      if (!valid) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  });

  // 2. Dynamic Form Behavior (example: show/hide based on checkbox)
  const toggleCheckbox = document.getElementById('id_is_tahfeez');
  if (toggleCheckbox) {
    const tahfeezSection = document.querySelector('.tahfeez-section');
    function toggleTahfeezSection() {
      if (toggleCheckbox.checked) {
        tahfeezSection.style.display = 'block';
      } else {
        tahfeezSection.style.display = 'none';
      }
    }
    toggleCheckbox.addEventListener('change', toggleTahfeezSection);
    toggleTahfeezSection();
  }

  // 3. Dashboard Charts (using Chart.js)
  if (typeof Chart !== 'undefined') {
    const ctx = document.getElementById('dashboardChart');
    if (ctx) {
      const admittedCount = parseInt(ctx.dataset.admitted) || 0;
      const enrolledCount = parseInt(ctx.dataset.enrolled) || 0;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Admitted Students', 'Enrolled Students'],
          datasets: [{
            label: 'Count',
            data: [admittedCount, enrolledCount],
            backgroundColor: ['#16213e', '#1a1a2e']
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              precision: 0
            }
          }
        }
      });
    }
  }

  // 4. Toast Notifications (Bootstrap 5)
  const toastElList = [].slice.call(document.querySelectorAll('.toast'));
  toastElList.forEach(function (toastEl) {
    new bootstrap.Toast(toastEl).show();
  });

  // 5. Smooth Scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 6. Accessibility: Add ARIA roles to nav and main if missing
  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
});
