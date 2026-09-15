/* ==========================================================================
   SureBridge Insurance Brokerage - Chart.js Initializer Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Chart === 'undefined') return;

  // 1. Admin Sales & Revenue Chart
  const adminRevenueCanvas = document.getElementById('adminRevenueChart');
  if (adminRevenueCanvas) {
    new Chart(adminRevenueCanvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          label: 'Premium Revenue ($)',
          data: [42000, 48000, 56000, 52000, 68000, 74000, 81000, 89000, 95000],
          borderColor: '#00D4B2',
          backgroundColor: 'rgba(0, 212, 178, 0.1)',
          fill: true,
          tension: 0.4
        }, {
          label: 'Claims Settled ($)',
          data: [12000, 15000, 18000, 14000, 22000, 19000, 25000, 21000, 28000],
          borderColor: '#EF4444',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // 2. Admin Policy Category Distribution Chart
  const adminCategoryCanvas = document.getElementById('adminCategoryChart');
  if (adminCategoryCanvas) {
    new Chart(adminCategoryCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Term Life', 'Health & Medical', 'Family Protection', 'Critical Illness', 'Group Corp'],
        datasets: [{
          data: [40, 28, 18, 9, 5],
          backgroundColor: ['#0A2540', '#00D4B2', '#3B82F6', '#F59E0B', '#64748B']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
});
