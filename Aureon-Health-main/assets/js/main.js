/* ==========================================================================
   VitaHarbor Insurance Brokerage - Main JavaScript & Global Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme State Initialization (Dark Mode / Light Mode)
  const savedTheme = localStorage.getItem('surebridge_theme') || 'light';
  applyTheme(savedTheme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('surebridge_theme', newTheme);
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body?.classList.toggle('dark-mode', theme === 'dark');
    const icons = document.querySelectorAll('.theme-toggle-btn i');
    icons.forEach(icon => {
      if (theme === 'dark') {
        icon.className = 'bi bi-sun-fill text-warning';
      } else {
        icon.className = 'bi bi-moon-stars-fill';
      }
    });
    document.querySelectorAll('.theme-toggle-label').forEach(lbl => {
      lbl.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    });
  }

  // 2. RTL & LTR Layout Functions
  const savedRTL = localStorage.getItem('surebridge_rtl') === 'true';
  applyRTL(savedRTL);

  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      applyRTL(!isRTL);
      localStorage.setItem('surebridge_rtl', !isRTL);
    });
  });

  const ltrBtns = document.querySelectorAll('.btn-ltr');
  ltrBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyRTL(false);
      localStorage.setItem('surebridge_rtl', false);
    });
  });

  const rtlBtns = document.querySelectorAll('.btn-rtl');
  rtlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyRTL(true);
      localStorage.setItem('surebridge_rtl', true);
    });
  });

  function applyRTL(isRTL) {
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
      document.querySelectorAll('.rtl-status-label').forEach(el => el.textContent = 'LTR');
      document.querySelectorAll('.btn-rtl').forEach(btn => btn.classList.add('active'));
      document.querySelectorAll('.btn-ltr').forEach(btn => btn.classList.remove('active'));
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.querySelectorAll('.rtl-status-label').forEach(el => el.textContent = 'RTL');
      document.querySelectorAll('.btn-ltr').forEach(btn => btn.classList.add('active'));
      document.querySelectorAll('.btn-rtl').forEach(btn => btn.classList.remove('active'));
    }
  }

  // 3. Navbar Scroll Elevation
  const navbar = document.querySelector('.navbar-surebridge, .navbar-vitaharbor');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 4. Dashboard drawer is handled centrally by aureon-production.js.

  // 4b. FAQ Knowledge Base Live Search Filter
  const faqSearchInput = document.getElementById('faq-search-input');
  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (!term || text.includes(term)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 5. Generic Form Validation Handler
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach(form => {
    if (form.matches('[data-vh-login-form], [data-vh-register-form]')) return;
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        showToast('Success!', 'Your request has been submitted successfully.');
        form.reset();
        form.classList.remove('was-validated');
        return;
      }
      form.classList.add('was-validated');
    }, false);
  });

  function showToast(title, message) {
    let toastContainer = document.getElementById('surebridge-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'surebridge-toast-container';
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      toastContainer.style.zIndex = '1090';
      document.body.appendChild(toastContainer);
    }

    const toastId = 'toast-' + Date.now();
    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <strong>${title}</strong> — ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
    toast.show();
  }
});
