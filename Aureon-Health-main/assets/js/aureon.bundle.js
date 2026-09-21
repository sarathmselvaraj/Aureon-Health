/* ===== main.js ===== */
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


/* ===== calculator.js ===== */
document.addEventListener('DOMContentLoaded',()=>{const form=document.getElementById('insurance-calculator-form');if(!form)return;const age=document.getElementById('calc-age'),income=document.getElementById('calc-income'),deps=document.getElementById('calc-dependents'),term=document.getElementById('calc-duration'),coverage=document.getElementById('calc-result-coverage'),premium=document.getElementById('calc-result-premium'),plan=document.getElementById('calc-result-plan');const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);function run(){const a=Number(age?.value)||32,i=Number(income?.value)||1200000,d=Number(deps?.value)||2,t=Number(term?.value)||20;let cover=Math.max(2500000,i*(10+d*1.5));cover=Math.round(cover/100000)*100000;const ageFactor=Math.max(.85,1+(a-30)*.025),termFactor=t===30?1.16:t===10?.82:1;let monthly=Math.max(650,(cover/100000)*10.5*ageFactor*termFactor);monthly=Math.round(monthly/50)*50;if(coverage)coverage.textContent=money(cover);if(premium)premium.textContent=money(monthly)+'/mo';if(plan)plan.textContent=d>=3||i>2000000?'FamilyShield Premier':a<40?'SecureLife Term 20':'HealthCare Choice PPO';}[age,income,deps,term].forEach(x=>{x?.addEventListener('input',run);x?.addEventListener('change',run)});run();});

/* ===== compare.js ===== */
document.addEventListener('DOMContentLoaded',()=>{const selected=new Set(),checks=[...document.querySelectorAll('.plan-compare-checkbox')],bar=document.getElementById('compare-floating-bar'),count=document.getElementById('compare-count'),compareBtn=document.getElementById('btn-open-compare'),cells=[...document.querySelectorAll('[data-compare-plan]')],type=document.getElementById('filter-insurance-type'),carrier=document.getElementById('filter-carrier'),price=document.getElementById('filter-max-price'),priceText=document.getElementById('price-range-value'),container=document.getElementById('plans-container'),cards=[...document.querySelectorAll('.plan-card-item')];let search=document.getElementById('plan-search'),sort=document.getElementById('sort-plans'),result=document.getElementById('plan-result-count');const side=type?.closest('.surebridge-card');if(side&&!search){const box=document.createElement('div');box.className='mb-4';box.innerHTML='<label class="form-label small fw-bold" for="plan-search">Search Plans</label><input class="form-control" id="plan-search" placeholder="Search plan, benefit or insurer"><label class="form-label small fw-bold mt-3" for="sort-plans">Sort Plans</label><select class="form-select" id="sort-plans"><option value="default">Recommended</option><option value="price-asc">Premium: Low to High</option><option value="price-desc">Premium: High to Low</option><option value="name">Plan Name A–Z</option></select><div class="aureon-result-count mt-2" id="plan-result-count"></div>';side.querySelector('.mb-4')?.insertAdjacentElement('beforebegin',box);search=box.querySelector('#plan-search');sort=box.querySelector('#sort-plans');result=box.querySelector('#plan-result-count');}const paint=()=>cells.forEach(c=>{const pick=selected.has(c.dataset.comparePlan);c.classList.toggle('is-selected',pick);c.classList.toggle('is-muted',selected.size>0&&!pick)});const updateBar=()=>{bar?.classList.toggle('d-none',selected.size===0);if(count)count.textContent=selected.size;paint()};checks.forEach(ch=>ch.addEventListener('change',e=>{const id=e.target.dataset.planId||e.target.value;if(e.target.checked){if(selected.size>=4){e.target.checked=false;return}selected.add(id)}else selected.delete(id);updateBar()}));compareBtn?.addEventListener('click',()=>{paint();document.getElementById('compare-plans')?.scrollIntoView({behavior:'smooth',block:'start'})});function apply(){const t=type?.value||'all',c=carrier?.value||'all',max=Number(price?.value||5000),q=(search?.value||'').trim().toLowerCase();let shown=0;cards.forEach(card=>{const ok=(t==='all'||card.dataset.type===t)&&(c==='all'||card.dataset.carrier===c)&&Number(card.dataset.price||0)<=max&&(!q||card.textContent.toLowerCase().includes(q));card.hidden=!ok;if(ok)shown++});const mode=sort?.value||'default';const ordered=[...cards].sort((a,b)=>mode==='price-asc'?Number(a.dataset.price)-Number(b.dataset.price):mode==='price-desc'?Number(b.dataset.price)-Number(a.dataset.price):mode==='name'?(a.querySelector('h4')?.textContent||'').localeCompare(b.querySelector('h4')?.textContent||''):cards.indexOf(a)-cards.indexOf(b));ordered.forEach(c=>container?.appendChild(c));if(priceText)priceText.textContent='₹'+new Intl.NumberFormat('en-IN').format(max)+'/mo';if(result)result.textContent=shown+' plan'+(shown===1?'':'s')+' shown';} [type,carrier,sort].forEach(x=>x?.addEventListener('change',apply));price?.addEventListener('input',apply);search?.addEventListener('input',apply);document.getElementById('reset-plan-filters')?.addEventListener('click',()=>{if(type)type.value='all';if(carrier)carrier.value='all';if(price)price.value='4000';if(search)search.value='';if(sort)sort.value='default';checks.forEach(x=>x.checked=false);selected.clear();updateBar();apply()});apply();});

/* ===== vitaharbor-blog.js ===== */
(function(){
  document.addEventListener('DOMContentLoaded',()=>{
    const cards=[...document.querySelectorAll('.blog-grid-item')]; if(!cards.length)return;
    cards.forEach((c,i)=>c.dataset.originalOrder=String(i));
    const buttons=[...document.querySelectorAll('#blogCategoryFilters [data-filter]')]; let active='all',query='';
    let box=document.querySelector('#blogSearchInput');
    if(!box){const tools=document.createElement('div');tools.className='aureon-tool-row';tools.innerHTML='<input id="blogSearchInput" class="form-control" placeholder="Search articles by title or topic" aria-label="Search articles"><select id="blogSort" class="form-select" aria-label="Sort articles"><option value="latest">Latest first</option><option value="title">Title A–Z</option></select>';document.querySelector('#blogCategoryFilters')?.insertAdjacentElement('afterend',tools);box=tools.querySelector('#blogSearchInput')}
    const sort=document.querySelector('#blogSort'); let out=document.querySelector('#blogResultCount');
    if(!out){out=document.createElement('p');out.id='blogResultCount';out.className='aureon-result-count';(box?.closest('.aureon-tool-row')||box)?.insertAdjacentElement('afterend',out)}
    function run(){
      let shown=0; cards.forEach(c=>{const cat=c.dataset.category||'',text=c.textContent.toLowerCase(),ok=(active==='all'||cat===active)&&(!query||text.includes(query));c.hidden=!ok;c.classList.toggle('blog-item-hidden',!ok);if(ok)shown++});
      out.textContent=shown+' article'+(shown===1?'':'s')+' shown';
      const grid=document.querySelector('#blogCardsGrid'); if(grid){const gridCards=[...grid.querySelectorAll('.blog-grid-item')];gridCards.sort((a,b)=>sort?.value==='title'?(a.querySelector('h4,h3,h2')?.textContent||'').localeCompare(b.querySelector('h4,h3,h2')?.textContent||''):Number(a.dataset.originalOrder)-Number(b.dataset.originalOrder)).forEach(x=>grid.appendChild(x));}
    }
    buttons.forEach(b=>b.addEventListener('click',()=>{active=b.dataset.filter;buttons.forEach(x=>x.classList.toggle('active',x===b));run()}));
    box?.addEventListener('input',()=>{query=box.value.trim().toLowerCase();run()}); sort?.addEventListener('change',run); run();
  });
})();


/* ===== vault.js ===== */
/* Aureon Health — Document Vault demo interactions */
document.addEventListener('DOMContentLoaded', () => {
  const uploadZone = document.getElementById('vault-upload-zone');
  const fileInput = document.getElementById('vault-file-input');
  const fileListContainer = document.getElementById('vault-file-list');
  const notify=(m,t='success',title='Done')=>window.AureonUI?.notify?.(m,t,{title});

  if (uploadZone && fileInput) {
    uploadZone.setAttribute('role','button'); uploadZone.setAttribute('tabindex','0');
    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fileInput.click();}});
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      files.forEach(file => addFileToVault(file.name, (file.size / 1024).toFixed(1) + ' KB'));
      if(files.length) notify(`${files.length} document${files.length>1?'s':''} added to the demo vault.`, 'success', 'Upload complete');
      fileInput.value='';
    });
  }

  function safeName(v){return String(v||'document').replace(/[<>]/g,'');}
  function downloadMetadata(name,size){
    const blob=new Blob([`Aureon Health Demo Vault\nDocument: ${name}\nSize: ${size}\nAdded: ${new Date().toLocaleString()}\n\nDemo metadata receipt only — no original file bytes are stored.`],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${name.replace(/\.[^.]+$/,'')||'document'}-vault-receipt.txt`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
  }
  function addFileToVault(name, size) {
    if (!fileListContainer) return;
    const newCard = document.createElement('div');
    newCard.className = 'col-md-6 mb-3';
    const n=safeName(name),z=safeName(size);
    newCard.innerHTML = `
      <div class="file-vault-card">
        <div class="d-flex align-items-center gap-3 min-w-0">
          <div class="bg-primary text-white p-3 rounded-3"><i class="bi bi-file-earmark-pdf fs-4"></i></div>
          <div class="min-w-0"><h6 class="mb-0 text-truncate" style="max-width:180px;">${n}</h6><small class="text-muted">${z} • Just uploaded</small></div>
        </div>
        <div class="dropdown">
          <button class="btn btn-sm btn-light border" type="button" data-bs-toggle="dropdown" aria-label="Document actions"><i class="bi bi-three-dots-vertical"></i></button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="dropdown-item" type="button" data-vault-download><i class="bi bi-download me-2"></i>Download receipt</button></li>
            <li><button class="dropdown-item text-danger" type="button" data-vault-delete><i class="bi bi-trash me-2"></i>Delete</button></li>
          </ul>
        </div>
      </div>`;
    newCard.querySelector('[data-vault-download]')?.addEventListener('click',()=>{downloadMetadata(n,z);notify('Demo vault receipt downloaded.','success','Download ready');});
    newCard.querySelector('[data-vault-delete]')?.addEventListener('click',()=>{newCard.remove();notify(`${n} was removed from the demo vault.`, 'success', 'Document removed');});
    fileListContainer.prepend(newCard);
  }
});


/* ===== trackers.js ===== */
/* ==========================================================================
   SureBridge Insurance Brokerage - Claims & Application Trackers Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Claim Tracker Lookup Simulation
  const claimSearchForm = document.getElementById('claim-tracker-form');
  const claimStatusOutput = document.getElementById('claim-status-result');

  if (claimSearchForm && claimStatusOutput) {
    claimSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const claimId = document.getElementById('claim-id-input').value.trim();

      if (!claimId) {
        window.AureonUI?.notify?.('Enter a valid Claim ID (for example CLM-9842).','warning',{title:'Claim ID required'});
        return;
      }

      // Demo Output State Rendering
      claimStatusOutput.innerHTML = `
        <div class="alert alert-info border-0 shadow-sm mt-4 p-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="mb-0 text-primary"><i class="bi bi-shield-check me-2"></i> Claim #${claimId} Status: <span class="badge bg-warning text-dark">Under Review</span></h5>
            <span class="text-muted small">Updated: Today, 09:30 AM</span>
          </div>
          <p class="mb-3">Your claim submission for <strong>Medical Reimbursement - General Health</strong> is currently being evaluated by Northstar Life underwriting team.</p>
          <div class="progress mb-3" style="height: 10px;">
            <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style="width: 50%;"></div>
          </div>
          <div class="d-flex justify-content-between small text-muted">
            <span>Submitted</span>
            <strong class="text-dark">Reviewing Docs</strong>
            <span>Insurer Assessment</span>
            <span>Payout</span>
          </div>
        </div>
      `;
    });
  }
});


/* ===== charts.js ===== */
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


/* ===== vitaharbor-store.js ===== */
(function(){
  const KEY='sanjeevisure_demo_state_v1',AUTH='sanjeevisure_auth_v1';
  const seed={version:2,clients:[{id:'CL-1001',name:'Arjun Mehta',email:'arjun@aureonhealth.demo',phone:'+91 98765 43210',state:'Karnataka',joined:'2026-07-12'}],quotes:[{id:'QT-101',carrier:'SurakshaLife Demo',plan:'Secure Term 25',type:'Life',coverage:10000000,premium:1250,rating:'A+',recommended:true},{id:'QT-102',carrier:'BharatCare Demo',plan:'Family Health Plus',type:'Health',coverage:1000000,premium:1850,rating:'A',recommended:false},{id:'QT-103',carrier:'ArogyaPlus Demo',plan:'Essential Health 10L',type:'Health',coverage:1000000,premium:1499,rating:'A+',recommended:false}],applications:[{id:'APP-77341',clientId:'CL-1001',plan:'Family Health Plus',carrier:'BharatCare Demo',submitted:'2026-09-09',status:'Under Review',progress:68}],policies:[{id:'POL-88412',clientId:'CL-1001',carrier:'SurakshaLife Demo',plan:'Secure Term 25',coverage:10000000,premium:1250,renewal:'2026-10-15',status:'Active'},{id:'POL-99105',clientId:'CL-1001',carrier:'BharatCare Demo',plan:'Family Health Plus',coverage:1000000,premium:1850,renewal:'2026-11-10',status:'Active'}],claims:[{id:'CLM-22018',clientId:'CL-1001',policyId:'POL-99105',type:'Medical reimbursement',amount:18000,status:'Under Review',updated:'2026-09-10'}],reminders:[{id:'REM-1',clientId:'CL-1001',title:'Family Health Plus premium',date:'2026-10-10',amount:1850,enabled:true}],payments:[{id:'PAY-1',clientId:'CL-1001',policyId:'POL-88412',amount:1250,date:'2026-09-01',status:'Paid'}],documents:[{id:'DOC-1',clientId:'CL-1001',name:'Term-Life-Policy-Summary.pdf',type:'Policy',added:'2026-07-15'},{id:'DOC-2',clientId:'CL-1001',name:'Family-Shield-ID-Card.pdf',type:'ID Card',added:'2026-08-01'}],messages:[{id:'MSG-1',clientId:'CL-1001',subject:'Welcome to Aureon Health',body:'Your client portal is ready.',date:'2026-09-01',read:true}],orders:[{id:'ORD-1',clientId:'CL-1001',kind:'Enrollment Intent',item:'Secure Term 25',amount:1250,status:'Open',date:'2026-09-10'}]};
  const clone=o=>JSON.parse(JSON.stringify(o)); function reset(){const s=clone(seed);localStorage.setItem(KEY,JSON.stringify(s));return s} function read(){try{const x=JSON.parse(localStorage.getItem(KEY));return x&&x.version===2?x:reset()}catch(e){return reset()}} function write(s){localStorage.setItem(KEY,JSON.stringify(s));window.dispatchEvent(new CustomEvent('vitaharbor:state',{detail:clone(s)}));return s} function mutate(fn){const s=read();fn(s);return write(s)} function uid(p){return p+'-'+String(Date.now()).slice(-6)} function auth(){try{return JSON.parse(localStorage.getItem(AUTH))}catch(e){return null}} function clientId(s){s=s||read();const a=auth();const c=a&&a.role==='client'?s.clients.find(x=>String(x.email).toLowerCase()===String(a.email).toLowerCase()):null;return c?.id||'CL-1001'}
  function login(role,email,name){role=role||'client';email=email||'arjun@aureonhealth.demo';name=name||(role==='admin'?'System Admin':'Arjun Mehta');if(role==='client'){const s=read();let c=s.clients.find(x=>String(x.email).toLowerCase()===String(email).toLowerCase());if(!c){c={id:uid('CL'),name,email,phone:'',state:'',joined:new Date().toISOString().slice(0,10)};s.clients.unshift(c);write(s)}else if(name&&c.name!==name){c.name=name;write(s)}}const a={role,email,name,at:new Date().toISOString()};localStorage.setItem(AUTH,JSON.stringify(a));window.dispatchEvent(new CustomEvent('vitaharbor:auth',{detail:a}));return a} function logout(){localStorage.removeItem(AUTH);window.dispatchEvent(new CustomEvent('vitaharbor:auth',{detail:null}))}
  window.VitaHarborStore={KEY,AUTH,seed:clone(seed),get:read,set:write,reset,mutate,uid,login,logout,auth,clientId,
    startApplication(quoteId){return mutate(s=>{const q=s.quotes.find(x=>x.id===quoteId);if(!q)return;const cid=clientId(s);s.applications.unshift({id:uid('APP'),clientId:cid,plan:q.plan,carrier:q.carrier,submitted:new Date().toISOString().slice(0,10),status:'Submitted',progress:20});s.orders.unshift({id:uid('ORD'),clientId:cid,kind:'Enrollment Intent',item:q.plan,amount:q.premium,status:'Open',date:new Date().toISOString().slice(0,10)})})},
    addClaim(data){return mutate(s=>s.claims.unshift(Object.assign({id:uid('CLM'),clientId:clientId(s),status:'Submitted',updated:new Date().toISOString().slice(0,10)},data)))},addReminder(data){return mutate(s=>s.reminders.unshift(Object.assign({id:uid('REM'),clientId:clientId(s),enabled:true},data)))},addPayment(data){return mutate(s=>s.payments.unshift(Object.assign({id:uid('PAY'),clientId:clientId(s),status:'Paid',date:new Date().toISOString().slice(0,10)},data)))},addDocument(data){return mutate(s=>s.documents.unshift(Object.assign({id:uid('DOC'),clientId:clientId(s),added:new Date().toISOString().slice(0,10)},data)))},updateApplication(id,patch){return mutate(s=>{const x=s.applications.find(i=>i.id===id);if(x)Object.assign(x,patch)})},updateClaim(id,patch){return mutate(s=>{const x=s.claims.find(i=>i.id===id);if(x)Object.assign(x,patch)})}}
  window.addEventListener('storage',e=>{if(e.key===KEY)window.dispatchEvent(new CustomEvent('vitaharbor:state',{detail:read()}));if(e.key===AUTH)window.dispatchEvent(new CustomEvent('vitaharbor:auth',{detail:auth()}))});
})();

/* ===== vitaharbor-auth.js ===== */
(function(){
  'use strict';
  function rootPrefix(){
    const p=location.pathname.replace(/\\/g,'/');
    if(p.includes('/pages/')||p.includes('/dashboard/')||p.includes('/admin/')) return '../';
    return '';
  }
  function storeReady(){ return !!(window.VitaHarborStore && typeof VitaHarborStore.login==='function'); }
  let selectedRole='client';
  const CRED_KEY='aureon_demo_credentials_v1';
  const DEMO_ADMIN={email:'admin@aureonhealth.demo',password:'Admin@123'};
  const DEMO_CLIENT={email:'arjun@aureonhealth.demo',password:'Client@123'};
  const encodeCredential=value=>{try{return btoa(unescape(encodeURIComponent(String(value||''))))}catch(_){return String(value||'')}};
  function readCredentials(){try{return JSON.parse(localStorage.getItem(CRED_KEY))||{}}catch(_){return {}}}
  function saveClientCredential(email,password){const all=readCredentials();all[String(email).toLowerCase()]={password:encodeCredential(password),createdAt:new Date().toISOString()};localStorage.setItem(CRED_KEY,JSON.stringify(all));}
  function validClientCredential(email,password){const key=String(email||'').toLowerCase();if(key===DEMO_CLIENT.email)return String(password)===DEMO_CLIENT.password;const record=readCredentials()[key];return !!record&&record.password===encodeCredential(password);}
  function validAdminCredential(email,password){return String(email||'').toLowerCase()===DEMO_ADMIN.email&&String(password)===DEMO_ADMIN.password;}
  function roleFromUI(form){ const hidden=form?.querySelector('input[name="role"]'); return (hidden?.value||selectedRole)==='admin'?'admin':'client'; }
  function showMessage(form,type,message){
    const box=form && form.querySelector('[data-vh-auth-message]');
    if(!box) return;
    box.className='vh-auth-message show '+type;
    box.textContent=message;
  }
  function friendlyName(email){
    const raw=String(email||'Client').split('@')[0].replace(/[._-]+/g,' ').trim();
    return raw ? raw.replace(/\b\w/g,c=>c.toUpperCase()) : 'Client';
  }
  function isAdminPath(){ return location.pathname.replace(/\\/g,'/').includes('/admin/'); }
  function isPortalPath(){ const p=location.pathname.replace(/\\/g,'/'); return p.includes('/dashboard/')||p.includes('/admin/'); }
  function ensurePublicProfileDropdown(){
    document.querySelectorAll('a[data-vh-profile-link]').forEach(anchor=>{
      if(anchor.closest('.vh-profile-dropdown')) return;
      const wrap=document.createElement('div');
      wrap.className='dropdown vh-auth-user d-none vh-profile-dropdown';
      wrap.innerHTML=`<button class="btn-nav-primary vh-profile-menu-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Open profile menu"><i class="bi bi-person-circle"></i><span>Profile</span><i class="bi bi-chevron-down vh-profile-chevron" aria-hidden="true"></i></button><ul class="dropdown-menu dropdown-menu-end shadow vh-profile-menu"><li><a class="dropdown-item" data-vh-dashboard-link href="${rootPrefix()}dashboard/index.html"><i class="bi bi-grid me-2"></i>Dashboard</a></li><li><a class="dropdown-item" data-vh-profile-menu-link href="${rootPrefix()}dashboard/profile.html"><i class="bi bi-person-gear me-2"></i>My Profile</a></li><li><hr class="dropdown-divider"></li><li><button class="dropdown-item text-danger" data-vh-signout type="button"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</button></li></ul>`;
      anchor.replaceWith(wrap);
    });
  }
  function ensureDashboardAccountMenu(){
    const topbar=document.querySelector('.aureon-portal-page .dashboard-topbar');
    if(!topbar) return;
    const admin=isAdminPath();
    const title=topbar.querySelector('h4');
    let left=title?.parentElement;
    if(!left||left===topbar){
      left=document.createElement('div');
      left.className='d-flex align-items-center gap-3 vh-dashboard-left-actions';
      if(title){topbar.insertBefore(left,title);left.appendChild(title);}else topbar.prepend(left);
    }else left.classList.add('vh-dashboard-left-actions');
    if(!left.querySelector('.dashboard-sidebar-toggle')){
      left.insertAdjacentHTML('afterbegin','<button class="btn btn-light d-xl-none dashboard-sidebar-toggle" type="button" aria-label="Open dashboard menu" title="Open menu"><i class="bi bi-list fs-4"></i></button>');
    }
    if(!left.querySelector('.vh-back-site')){
      left.insertAdjacentHTML('beforeend','<a class="btn btn-outline-primary btn-sm vh-back-site" href="../index.html"><i class="bi bi-arrow-left me-1"></i> Back to Website</a>');
    }
    let right=[...topbar.children].find(el=>el!==left&&el.tagName==='DIV');
    if(!right){right=document.createElement('div');right.className='d-flex align-items-center gap-2 vh-dashboard-right-actions';topbar.appendChild(right);}else right.classList.add('vh-dashboard-right-actions');
    if(topbar.querySelector('.vh-dashboard-account-dropdown')) return;
    const old=topbar.querySelector('.border-start.ps-3');
    const menu=document.createElement('div');
    menu.className='dropdown vh-dashboard-account-dropdown';
    menu.innerHTML=`<button class="vh-dashboard-account-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Open account menu"><span class="vh-account-avatar"><i class="bi ${admin?'bi-shield-lock-fill':'bi-person-fill'}"></i></span><span class="vh-account-copy"><strong data-vh-user-name>${admin?'System Admin':'Client'}</strong><small data-vh-account-role>${admin?'Administrator':'Policyholder'}</small></span><i class="bi bi-chevron-down ms-auto"></i></button><ul class="dropdown-menu dropdown-menu-end shadow vh-dashboard-account-menu"><li><a class="dropdown-item" data-vh-dashboard-overview href="index.html"><i class="bi bi-grid me-2"></i>${admin?'Admin Dashboard':'Dashboard Overview'}</a></li><li><a class="dropdown-item" data-vh-dashboard-profile href="${admin?'settings.html':'profile.html'}"><i class="bi ${admin?'bi-sliders':'bi-person-gear'} me-2"></i>${admin?'Settings':'My Profile'}</a></li><li><a class="dropdown-item" href="../index.html"><i class="bi bi-arrow-left-circle me-2"></i>Back to Website</a></li><li><hr class="dropdown-divider"></li><li><button class="dropdown-item text-danger" data-vh-signout type="button"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</button></li></ul>`;
    if(old) old.replaceWith(menu); else right.appendChild(menu);
  }
  function ensureDashboardQuickbar(){
    if(!isPortalPath()||document.querySelector('.vh-dashboard-quickbar')) return;
    const admin=isAdminPath();
    const bar=document.createElement('nav');
    bar.className='vh-dashboard-quickbar';
    bar.setAttribute('aria-label','Quick dashboard navigation');
    bar.innerHTML=`<button data-vh-go-back type="button"><i class="bi bi-arrow-left"></i><span>Back</span></button><a href="index.html"><i class="bi bi-grid"></i><span>Dashboard</span></a><a href="${admin?'settings.html':'profile.html'}"><i class="bi ${admin?'bi-sliders':'bi-person'}"></i><span>${admin?'Settings':'Profile'}</span></a><button data-vh-signout type="button"><i class="bi bi-box-arrow-right"></i><span>Logout</span></button>`;
    document.body.appendChild(bar);
  }
  function sync(){
    ensurePublicProfileDropdown();
    ensureDashboardAccountMenu();
    ensureDashboardQuickbar();
    const a=storeReady()?VitaHarborStore.auth():null;
    document.querySelectorAll('.vh-auth-guest').forEach(el=>el.classList.toggle('d-none',!!a));
    document.querySelectorAll('.vh-auth-user').forEach(el=>el.classList.toggle('d-none',!a));
    const dashboardHref=rootPrefix()+(a&&a.role==='admin'?'admin/index.html':'dashboard/index.html');
    const profileHref=rootPrefix()+(a&&a.role==='admin'?'admin/settings.html':'dashboard/profile.html');
    document.querySelectorAll('[data-vh-dashboard-link]').forEach(el=>{el.href=dashboardHref; el.setAttribute('aria-label',a&&a.role==='admin'?'Open admin dashboard':'Open client dashboard');});
    document.querySelectorAll('[data-vh-profile-menu-link]').forEach(el=>{el.href=profileHref; el.setAttribute('aria-label',a&&a.role==='admin'?'Open admin settings':'Open client profile');});
    document.querySelectorAll('[data-vh-user-name]').forEach(el=>el.textContent=a?.name||(isAdminPath()?'System Admin':'Client'));
    document.querySelectorAll('[data-vh-account-role]').forEach(el=>el.textContent=(a?.role==='admin'||isAdminPath())?'Administrator':'Policyholder');
  }
  function go(url){ if(window.__VH_TEST_MODE__){ window.__vhTestRedirect=url; window.dispatchEvent(new CustomEvent('vitaharbor:test-redirect',{detail:url})); return; } location.assign(url); }
  function redirect(role){
    const dest=rootPrefix()+(role==='admin'?'admin/index.html':'dashboard/index.html');
    go(dest);
  }
  document.addEventListener('click',e=>{
    const back=e.target.closest('[data-vh-go-back]');
    if(back){ if(history.length>1) history.back(); else go(rootPrefix()+'index.html'); return; }
    const b=e.target.closest('[data-vh-signout]');
    if(!b)return;
    if(storeReady()) VitaHarborStore.logout();
    sync();
    go(rootPrefix()+'index.html');
  });
  document.addEventListener('DOMContentLoaded',()=>{
    sync();
    document.querySelectorAll('[data-toggle-password]').forEach(b=>b.addEventListener('click',()=>{
      const group=b.closest('.input-group');
      const i=group?group.querySelector('input[type="password"],input[type="text"]'):document.querySelector('#login-password');
      if(!i)return;
      i.type=i.type==='password'?'text':'password';
      const icon=b.querySelector('i');
      if(icon) icon.className=i.type==='password'?'bi bi-eye':'bi bi-eye-slash';
      b.setAttribute('aria-label',i.type==='password'?'Show password':'Hide password');
    }));

    document.querySelectorAll('[data-vh-role-toggle]').forEach(toggle=>{
      const input=toggle.querySelector('input[name="role"]');
      const help=toggle.querySelector('[data-vh-role-help]');
      const heading=document.querySelector('[data-vh-login-heading]');
      toggle.querySelectorAll('[data-role]').forEach(btn=>btn.addEventListener('click',()=>{
        const role=btn.dataset.role==='admin'?'admin':'client'; selectedRole=role;
        if(input) input.value=role;
        toggle.querySelectorAll('[data-role]').forEach(x=>x.classList.toggle('active',x===btn));
        if(help) help.textContent=role==='admin'?'Review applications, claims, clients and platform activity.':'Manage policies, claims, reminders and documents.';
        if(heading) heading.textContent=role==='admin'?'Welcome Back, Admin':'Welcome Back, Client';
      }));
    });

    const requestedRole=new URLSearchParams(location.search).get('role');
    if(requestedRole==='admin'||requestedRole==='client'){
      selectedRole=requestedRole;
      const t=document.querySelector('[data-vh-role-toggle]');
      const input=t?.querySelector('input[name="role"]'); if(input) input.value=requestedRole;
      t?.querySelectorAll('[data-role]').forEach(x=>x.classList.toggle('active',x.dataset.role===requestedRole));
      const help=t?.querySelector('[data-vh-role-help]'); if(help) help.textContent=requestedRole==='admin'?'Review applications, claims, clients and platform activity.':'Manage policies, claims, reminders and documents.';
      const heading=document.querySelector('[data-vh-login-heading]'); if(heading) heading.textContent=requestedRole==='admin'?'Welcome Back, Admin':'Welcome Back, Client';
    }

    const login=document.querySelector('[data-vh-login-form]');
    if(login) login.addEventListener('submit',e=>{
      e.preventDefault();
      login.classList.add('was-validated');
      if(!login.checkValidity()){
        showMessage(login,'error','Please enter a valid email address and password.');
        return;
      }
      if(!storeReady()){
        showMessage(login,'error','Portal storage could not be loaded. Please refresh and try again.');
        return;
      }
      try{
        const fd=new FormData(login);
        const role=roleFromUI(login);
        const email=String(fd.get('email')||'').trim();
        const password=String(fd.get('password')||'');
        const valid=role==='admin'?validAdminCredential(email,password):validClientCredential(email,password);
        if(!valid){showMessage(login,'error',role==='admin'?'Admin email or password is incorrect.':'Email or password is incorrect. Register first if you do not have a demo client account.');return;}
        VitaHarborStore.login(role,email,role==='admin'?'System Admin':friendlyName(email));
        showMessage(login,'success',role==='admin'?'Admin access confirmed. Opening console…':'Sign in successful. Opening your portal…');
        setTimeout(()=>redirect(role),180);
      }catch(err){
        showMessage(login,'error','Sign in could not be completed. Please try again.');
      }
    });

    const reg=document.querySelector('[data-vh-register-form]');
    if(reg) reg.addEventListener('submit',e=>{
      e.preventDefault();
      reg.classList.add('was-validated');
      if(!reg.checkValidity()){
        showMessage(reg,'error','Complete the required fields, use at least 8 password characters, and accept the terms.');
        return;
      }
      if(!storeReady()){
        showMessage(reg,'error','Portal storage could not be loaded. Please refresh and try again.');
        return;
      }
      try{
        const fd=new FormData(reg);
        const email=String(fd.get('email')||'').trim();
        const name=String(fd.get('name')||friendlyName(email)).trim();
        const password=String(fd.get('password')||'');
        const confirmPassword=String(fd.get('confirmPassword')||'');
        if(password!==confirmPassword){showMessage(reg,'error','Passwords do not match. Re-enter the same password in both fields.');return;}
        if(email.toLowerCase()===DEMO_ADMIN.email){showMessage(reg,'error','That email is reserved for the demo administrator. Use a different client email.');return;}
        // Add/update the demo client record so dashboard/profile data reflects the registered user.
        VitaHarborStore.mutate(s=>{
          const existing=s.clients.find(c=>String(c.email).toLowerCase()===email.toLowerCase());
          const record={id:existing?.id||VitaHarborStore.uid('CL'),name,email,phone:String(fd.get('phone')||''),state:existing?.state||'',joined:new Date().toISOString().slice(0,10)};
          if(existing) Object.assign(existing,record); else s.clients.unshift(record);
        });
        saveClientCredential(email,password);
        VitaHarborStore.login('client',email,name||'New Client');
        showMessage(reg,'success','Account created securely for this browser. Opening your client portal…');
        setTimeout(()=>redirect('client'),180);
      }catch(err){
        showMessage(reg,'error','Account creation could not be completed. Please try again.');
      }
    });

    document.querySelectorAll('[data-vh-social]').forEach(b=>b.addEventListener('click',()=>{
      if(!storeReady()) return;
      const provider=b.getAttribute('data-vh-social')||'social';
      if(selectedRole==='admin'){const form=b.closest('form');showMessage(form,'error','Administrator access requires the admin email and password. Social demo sign-in is client-only.');return;}
      const email=provider+'@aureonhealth.demo';
      // Social demo users receive a browser-local client record without exposing admin access.
      VitaHarborStore.login('client',email,provider==='apple'?'Apple Demo Client':'Google Demo Client');
      redirect('client');
    }));
  });
  window.addEventListener('vitaharbor:auth',sync);
  window.addEventListener('storage',e=>{if(e.key===(window.VitaHarborStore?.AUTH||'sanjeevisure_auth_v1'))sync();});
})();


/* ===== aureon-production.js ===== */
(function(){
  'use strict';
  const ready=(fn)=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();
  ready(()=>{
    // Newsletter: persistent, validated, no fake page navigation.
    document.querySelectorAll('[data-aureon-newsletter]').forEach(form=>{
      const input=form.querySelector('input[type="email"]'); const status=form.querySelector('.newsletter-status');
      form.addEventListener('submit',e=>{e.preventDefault(); if(!input||!input.checkValidity()){input?.classList.add('is-invalid'); if(status)status.textContent='Enter a valid email address.'; return;} input.classList.remove('is-invalid'); const email=input.value.trim(); localStorage.setItem('aureon_newsletter_email',email); if(status)status.textContent='Subscribed successfully — updates will be sent to '+email+'.'; form.reset();});
    });
    // Center real CTA-only rows, but never navs/forms/table action cells.
    document.querySelectorAll('main a.btn, main button.btn, section a.btn, section button.btn').forEach(btn=>{
      if(btn.closest('form,.navbar,.aureon-footer,.dashboard-sidebar,.dashboard-topbar,table'))return;
      const p=btn.parentElement;if(!p)return; const direct=[...p.children];
      const ctas=direct.filter(x=>x.matches('a.btn,button.btn,a[class*="btn-"]'));
      const nonCta=direct.filter(x=>!x.matches('a.btn,button.btn,a[class*="btn-"]') && !x.matches('br'));
      if(ctas.length && nonCta.length===0)p.classList.add('aureon-cta-row');
      if(p.classList.contains('d-flex') && ctas.length>=2 && nonCta.length===0)p.classList.add('aureon-cta-row');
      if(ctas.length===1 && !p.classList.contains('d-flex') && !btn.classList.contains('w-100') && !btn.hasAttribute('data-aureon-share')) btn.classList.add('aureon-cta-single');
    });
    // Real social share actions for article buttons that were previously placeholder # links.
    document.querySelectorAll('[data-aureon-share]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const u=encodeURIComponent(location.href),t=encodeURIComponent(document.title);const map={facebook:'https://www.facebook.com/sharer/sharer.php?u='+u,x:'https://twitter.com/intent/tweet?url='+u+'&text='+t,linkedin:'https://www.linkedin.com/sharing/share-offsite/?url='+u};const target=map[a.dataset.aureonShare];if(target)window.open(target,'_blank','noopener,noreferrer,width=720,height=620');}));
    // Mobile/tablet navigation behaves like a fixed app drawer and never pushes content.
    const publicNav=document.querySelector('body > .navbar-vitaharbor, body > .navbar-surebridge');
    if(publicNav){
      document.body.classList.add('has-public-navbar');
      const syncNavHeight=()=>{
        const h=Math.max(64,Math.ceil(publicNav.getBoundingClientRect().height));
        document.documentElement.style.setProperty('--aureon-public-nav-h',h+'px');
        document.documentElement.style.setProperty('--aureon-mobile-nav-h',h+'px');
        if(innerWidth>=1200) document.body.classList.remove('mobile-nav-open');
      };
      syncNavHeight(); window.addEventListener('resize',syncNavHeight,{passive:true});
      if(window.ResizeObserver)new ResizeObserver(syncNavHeight).observe(publicNav);
    }
    document.querySelectorAll('.navbar-collapse').forEach(collapse=>{
      collapse.addEventListener('show.bs.collapse',()=>{if(innerWidth<1200)document.body.classList.add('mobile-nav-open')});
      collapse.addEventListener('hidden.bs.collapse',()=>document.body.classList.remove('mobile-nav-open'));
      collapse.querySelectorAll('a.nav-link:not(.dropdown-toggle), .dropdown-item').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<1200&&window.bootstrap){const inst=bootstrap.Collapse.getOrCreateInstance(collapse,{toggle:false});inst.hide();}}));
    });
    // Dashboard mobile drawer with backdrop and ESC handling.
    const sidebar=document.querySelector('.dashboard-sidebar'); const toggle=document.querySelector('.dashboard-sidebar-toggle');
    if(sidebar&&toggle){let backdrop=document.querySelector('.dashboard-sidebar-backdrop');if(!backdrop){backdrop=document.createElement('div');backdrop.className='dashboard-sidebar-backdrop';document.body.appendChild(backdrop);} const close=()=>{sidebar.classList.remove('show-sidebar');backdrop.classList.remove('show');document.body.classList.remove('sidebar-open')}; const open=()=>{sidebar.classList.add('show-sidebar');backdrop.classList.add('show');document.body.classList.add('sidebar-open')}; toggle.addEventListener('click',()=>sidebar.classList.contains('show-sidebar')?close():open());backdrop.addEventListener('click',close);sidebar.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<1200)close()}));document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});}
    // Portal tables become labelled mobile cards instead of forcing beginners to
    // discover horizontal scrolling on a phone.
    if(document.body.classList.contains('aureon-portal-page')){
      document.querySelectorAll('.dashboard-content table').forEach(table=>{
        const heads=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
        table.querySelectorAll('tbody tr').forEach(row=>{
          [...row.children].forEach((cell,i)=>{if(cell.tagName==='TD'&&!cell.dataset.label)cell.dataset.label=heads[i]||'Detail';});
        });
      });
    }
    // Lazy-load non-critical images while keeping the hero eager.
    document.querySelectorAll('img:not(.brand-logo-mark)').forEach(img=>{if(!img.closest('.hero-section-main')){img.loading=img.loading||'lazy';img.decoding='async';}});
  });
})();


/* ===== aureon-universal-master.js ===== */
(function(){
  'use strict';
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function feedbackRoot(){let r=document.getElementById('aureon-action-feedback');if(!r){r=document.createElement('div');r.id='aureon-action-feedback';r.setAttribute('aria-live','polite');document.body.appendChild(r);}return r;}
  function notify(message,type='success',options={}){
    const root=feedbackRoot(), item=document.createElement('div');
    item.className='aureon-feedback '+type;
    const title=options.title||(type==='error'?'Action needs attention':type==='warning'?'Please check':'Done');
    const icon=type==='error'?'bi-exclamation-triangle-fill':type==='warning'?'bi-info-circle-fill':'bi-check-circle-fill';
    const actions=(options.actions||[]).map(a=>a.href?`<a class="btn btn-sm ${a.className||'btn-outline-primary'}" href="${esc(a.href)}">${esc(a.label)}</a>`:`<button class="btn btn-sm ${a.className||'btn-outline-primary'}" type="button" data-aum-action="${esc(a.action||'close')}">${esc(a.label)}</button>`).join('');
    item.innerHTML=`<div class="aum-icon"><i class="bi ${icon}"></i></div><div><strong>${esc(title)}</strong><p>${esc(message)}</p></div><button class="btn-close" type="button" aria-label="Close"></button>${actions?`<div class="aureon-feedback-actions">${actions}</div>`:''}`;
    root.appendChild(item);
    const remove=()=>{item.remove();}; item.querySelector('.btn-close')?.addEventListener('click',remove);
    item.querySelectorAll('[data-aum-action="close"]').forEach(b=>b.addEventListener('click',remove));
    const timer=setTimeout(remove,options.duration||5200); item.addEventListener('mouseenter',()=>clearTimeout(timer),{once:true});
    return item;
  }
  window.AureonUI=Object.assign(window.AureonUI||{},{notify});

  function addBackToTop(){
    if(document.querySelector('.aureon-back-top'))return;
    const b=document.createElement('button');b.type='button';b.className='aureon-back-top';b.setAttribute('aria-label','Back to top');b.title='Back to top';b.innerHTML='<i class="bi bi-arrow-up"></i>';document.body.appendChild(b);
    const sync=()=>b.classList.toggle('show',scrollY>650);addEventListener('scroll',sync,{passive:true});sync();b.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
  }

  function receiptDownload(data){
    const lines=[
      'Aureon Health — Demo Payment Receipt',
      '------------------------------------',
      `Payment ID: ${data.id||'DEMO'}`,
      `Policy: ${data.policyId||'-'}`,
      `Amount: ${data.amount||'-'}`,
      `Method: ${data.method||'Demo payment'}`,
      `Date: ${data.date||new Date().toISOString().slice(0,10)}`,
      'Status: Paid',
      '',
      'Demo only — no real payment gateway was used.'
    ];
    const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`Aureon-Receipt-${data.id||Date.now()}.txt`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
  }

  function wireReceipts(){
    document.addEventListener('click',e=>{const b=e.target.closest('[data-aureon-receipt]');if(!b)return;e.preventDefault();const id=b.dataset.aureonReceipt||'DEMO';let payment=null;try{payment=window.VitaHarborStore?.get?.().payments?.find(x=>String(x.id)===String(id));}catch(_){}payment=payment||{id,policyId:b.dataset.policy||'-',amount:b.dataset.amount||'-',method:b.dataset.method||'Demo'};receiptDownload(payment);notify('Your demo receipt has been downloaded.','success',{title:'Receipt ready'});});
  }

  function wirePaymentModes(){
    document.addEventListener('change',e=>{const radio=e.target.closest('input[name="paymentMethod"]');if(!radio)return;const form=radio.closest('form');form?.querySelectorAll('.aureon-pay-method').forEach(x=>x.classList.toggle('active',x.contains(radio)&&radio.checked));form?.querySelectorAll('[data-payment-fields]').forEach(x=>x.hidden=x.dataset.paymentFields!==radio.value);});
  }

  function wireInbox(){
    const messages=[
      {name:'Sophia Williams',email:'sophia@example.com',subject:'Question about Term 20 child rider rates',body:'Hello, I would like to check if child riders can be added to the SecureLife Term 20 policy after issuance, or if it must be selected at initial underwriting?',source:'Public Contact Form'},
      {name:'Ethan Parker',email:'ethan@example.com',subject:'Group Benefits Consultation for 25 Employees',body:'We are looking to switch our company health plan before Q4 enrollment and would like a comparison of available group options.',source:'Public Contact Form'}
    ];
    document.querySelectorAll('[data-aureon-message]').forEach(btn=>btn.addEventListener('click',()=>{
      const m=messages[Number(btn.dataset.aureonMessage)||0]||messages[0];document.querySelectorAll('[data-aureon-message]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
      const name=document.querySelector('[data-aureon-message-name]'),meta=document.querySelector('[data-aureon-message-meta]'),body=document.querySelector('[data-aureon-message-body]'),subject=document.querySelector('[data-aureon-message-subject]');if(name)name.textContent=m.name;if(meta)meta.textContent=`${m.email} • Lead Source: ${m.source}`;if(body)body.textContent='“'+m.body+'”';if(subject)subject.textContent=m.subject;
    }));
  }

  function wireInboxSearch(){
    const input=document.querySelector('[data-aureon-inbox-search]'); if(!input)return;
    input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();document.querySelectorAll('[data-aureon-message]').forEach(item=>{item.hidden=!!q&&!item.textContent.toLowerCase().includes(q);});});
  }

  function wireStaticDemoPay(){
    document.querySelectorAll('[data-aureon-static-pay]').forEach(btn=>btn.addEventListener('click',()=>{
      notify('Demo payment recorded. Open the Payments section to use Cash, Card or UPI modes.','success',{title:'Payment simulated',actions:[{label:'Open Payments',href:'payments.html',className:'btn-primary'}]});
    }));
  }

  function wireSafeFormFeedback(){
    // Existing auth/dashboard handlers own their forms. This only covers plain static forms.
    document.querySelectorAll('form:not([data-vh-login-form]):not([data-vh-register-form]):not([data-vh-claim]):not([data-vh-reminder]):not([data-vh-payment]):not([data-vh-document]):not([data-vh-profile]):not([data-aureon-newsletter])').forEach(form=>{
      if(form.dataset.aumFeedbackWired==='1')return;form.dataset.aumFeedbackWired='1';
      if(form.classList.contains('needs-validation'))return; // main.js already owns these.
      if(!form.querySelector('button[type="submit"],input[type="submit"]'))return;
      form.addEventListener('submit',e=>{if(!form.checkValidity()){e.preventDefault();form.classList.add('was-validated');notify('Please complete the required fields before continuing.','warning',{title:'Check the form'});}});
    });
  }

  function wireStaticAdminActions(){
    document.querySelectorAll('[data-aureon-static-admin-action]').forEach(btn=>btn.addEventListener('click',()=>notify('Demo admin action recorded. The realtime admin console uses shared browser state.','success',{title:'Admin action complete'})));
  }

  function auditButtonDefaults(){
    document.querySelectorAll('button:not([type])').forEach(b=>{if(!b.closest('form'))b.type='button';});
    document.querySelectorAll('button[aria-label=""],a[aria-label=""]').forEach(el=>el.removeAttribute('aria-label'));
  }

  ready(()=>{addBackToTop();wireReceipts();wirePaymentModes();wireInbox();wireInboxSearch();wireStaticDemoPay();wireStaticAdminActions();wireSafeFormFeedback();auditButtonDefaults();});
})();


/* ===== aureon-storyvault-mobile.js ===== */
(function(){
  'use strict';
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();
  const prefix=()=>{const p=location.pathname.replace(/\\/g,'/');return (p.includes('/pages/')||p.includes('/dashboard/')||p.includes('/admin/'))?'../':'';};

  function setupPublicNav(){
    document.querySelectorAll('.has-public-navbar .navbar-vitaharbor,.has-public-navbar .navbar-surebridge').forEach(nav=>{
      nav.classList.add('svm-public-nav');
      const shell=nav.querySelector(':scope > .container-fluid')||nav.querySelector('.container-fluid');
      const brand=nav.querySelector('.navbar-brand-logo');
      const toggler=nav.querySelector('.navbar-toggler');
      const collapse=nav.querySelector('.navbar-collapse');
      if(!shell||!toggler||!collapse)return;

      // Match StoryVault's mobile top row: brand + theme + direction + hamburger.
      let tools=shell.querySelector('.svm-mobile-tools');
      if(!tools){
        tools=document.createElement('div');
        tools.className='svm-mobile-tools d-lg-none';
        tools.innerHTML='<button class="svm-mobile-tool svm-mobile-theme" type="button" aria-label="Toggle dark or light mode" title="Toggle dark/light mode"><i class="bi bi-moon-stars-fill"></i></button><button class="svm-mobile-tool svm-mobile-dir" type="button" aria-label="Toggle LTR or RTL layout" title="Toggle LTR/RTL layout"><i class="bi bi-arrow-left-right"></i></button>';
        shell.insertBefore(tools,toggler);
        tools.querySelector('.svm-mobile-theme').addEventListener('click',()=>nav.querySelector('.nav-theme-btn')?.click());
        tools.querySelector('.svm-mobile-dir').addEventListener('click',()=>{
          const group=nav.querySelector('.nav-direction-group');
          if(!group)return;
          const rtl=document.documentElement.dir==='rtl';
          group.querySelector(rtl?'.btn-ltr':'.btn-rtl')?.click();
        });
      }
      toggler.innerHTML='<i class="bi bi-list" aria-hidden="true"></i>';
      toggler.setAttribute('aria-label','Open navigation menu');

      const syncToolIcons=()=>{
        const dark=(document.documentElement.getAttribute('data-theme')==='dark')||document.body.classList.contains('dark-mode');
        const icon=tools.querySelector('.svm-mobile-theme i');if(icon)icon.className=dark?'bi bi-sun-fill':'bi bi-moon-stars-fill';
        const dirIcon=tools.querySelector('.svm-mobile-dir i');if(dirIcon)dirIcon.className='bi bi-arrow-left-right';
      };
      syncToolIcons();
      new MutationObserver(syncToolIcons).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','dir']});

      // Same no-layout-shift behavior as StoryVault.
      collapse.addEventListener('show.bs.collapse',()=>document.body.classList.add('svm-mobile-menu-open'));
      collapse.addEventListener('hidden.bs.collapse',()=>document.body.classList.remove('svm-mobile-menu-open'));

      // Signed-in StoryVault-style compact profile quick action beside hamburger.
      const syncProfileQuick=()=>{
        const profileWrap=nav.querySelector('.vh-profile-dropdown:not(.d-none)');
        let quick=shell.querySelector('.svm-mobile-profile-quick');
        if(profileWrap){
          if(!quick){
            quick=document.createElement('a');quick.className='svm-mobile-profile-quick d-lg-none';quick.innerHTML='<i class="bi bi-person-circle" aria-hidden="true"></i>';quick.title='Open profile';quick.setAttribute('aria-label','Open profile');
            shell.insertBefore(quick,tools);
          }
          const link=profileWrap.querySelector('[data-vh-profile-menu-link]')||profileWrap.querySelector('a');
          quick.href=link?.href||prefix()+'dashboard/profile.html';quick.hidden=false;
        }else if(quick){quick.hidden=true;}
      };
      syncProfileQuick();
      const actions=nav.querySelector('.nav-actions-container');if(actions)new MutationObserver(syncProfileQuick).observe(actions,{subtree:true,attributes:true,attributeFilter:['class','href']});
      window.addEventListener('storage',syncProfileQuick);
    });
  }

  function setupPortal(){
    if(!document.body.classList.contains('aureon-portal-page'))return;
    const sidebar=document.querySelector('.dashboard-sidebar');
    if(sidebar){
      const header=sidebar.querySelector('.dashboard-sidebar-header')||sidebar.firstElementChild;
      if(header&&!header.querySelector('.svm-portal-drawer-close')){
        const close=document.createElement('button');close.type='button';close.className='svm-portal-drawer-close d-lg-none';close.setAttribute('aria-label','Close dashboard menu');close.title='Close menu';close.innerHTML='<i class="bi bi-x-lg"></i>';header.appendChild(close);
        close.addEventListener('click',()=>{sidebar.classList.remove('show-sidebar');document.querySelector('.dashboard-sidebar-backdrop')?.classList.remove('show');document.body.classList.remove('sidebar-open');});
      }
    }

    // Rebuild the existing quickbar into the same five-button StoryVault dock.
    const bar=document.querySelector('.vh-dashboard-quickbar');
    if(bar){
      const admin=location.pathname.includes('/admin/');
      bar.innerHTML=`<button data-vh-go-back type="button"><i class="bi bi-arrow-left"></i><span>Back</span></button><a href="../index.html"><i class="bi bi-house"></i><span>Home</span></a><a class="svm-dock-primary" href="index.html"><i class="bi bi-grid-fill"></i><span>Dashboard</span></a><a href="${admin?'settings.html':'profile.html'}"><i class="bi ${admin?'bi-sliders':'bi-person'}"></i><span>${admin?'Settings':'Profile'}</span></a><button data-vh-signout type="button"><i class="bi bi-box-arrow-right"></i><span>Logout</span></button>`;
    }

    // Attach labels to cells so phone tables become readable StoryVault-style cards.
    document.querySelectorAll('.table-responsive table').forEach(table=>{
      const headers=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
      table.querySelectorAll('tbody tr').forEach(row=>{[...row.children].forEach((cell,i)=>{if(!cell.dataset.label)cell.dataset.label=headers[i]||`Field ${i+1}`;});});
    });
  }

  ready(()=>{setupPublicNav();setupPortal();});
})();


/* ===== aureon-high-priority-v2.js ===== */
/* Aureon Health — High Priority Manual QA Fixes */
(function(){
  'use strict';
  const EMAIL_RE=/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,63})+$/;
  const NAME_RE=/^[A-Za-z][A-Za-z .'-]{1,79}$/;
  const digits=v=>String(v||'').replace(/\D/g,'');

  function mark(input, ok, message){
    if(!input)return;
    input.setCustomValidity(ok?'':message);
    input.classList.toggle('is-invalid',!ok && input.value.trim()!=='');
    input.classList.toggle('is-valid',ok && input.value.trim()!=='');
    const fb=input.parentElement?.querySelector('.invalid-feedback');
    if(fb && !ok) fb.textContent=message;
  }

  function wireContact(){
    const form=document.querySelector('[data-aureon-contact-form]');
    if(!form)return;
    const name=form.querySelector('[name="fullName"]');
    const email=form.querySelector('[name="email"]');
    const phone=form.querySelector('[name="phone"]');
    const validateName=()=>{
      const v=(name?.value||'').trim();
      const letters=v.replace(/[^A-Za-z]/g,'').length;
      mark(name,NAME_RE.test(v)&&letters>=2,'Enter a valid name with at least 2 letters.');
    };
    const validateEmail=()=>{
      const v=(email?.value||'').trim();
      mark(email,EMAIL_RE.test(v),'Enter a complete email such as name@example.com.');
    };
    const validatePhone=()=>{
      if(!phone)return;
      const clean=digits(phone.value).slice(0,15);
      phone.value=clean;
      mark(phone,clean.length>=8&&clean.length<=15,'Enter an 8–15 digit phone number.');
    };
    ['input','blur','change'].forEach(evt=>{
      name?.addEventListener(evt,validateName);
      email?.addEventListener(evt,validateEmail);
      phone?.addEventListener(evt,validatePhone);
    });
    phone?.addEventListener('keypress',e=>{ if(!/[0-9]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); });
    form.addEventListener('submit',e=>{
      validateName();validateEmail();validatePhone();
      if(!form.checkValidity()){
        e.preventDefault();e.stopPropagation();
      }
      form.classList.add('was-validated');
    },true);
  }

  function wireGuideSearch(){
    document.querySelectorAll('.aureon-blog-detail input[placeholder="Search guides..."]').forEach(input=>{
      const group=input.closest('.input-group');
      const btn=group?.querySelector('button');
      let status=group?.nextElementSibling;
      if(!status || !status.classList.contains('aureon-guide-search-status')){
        status=document.createElement('div');
        status.className='aureon-guide-search-status';
        status.setAttribute('aria-live','polite');
        group?.insertAdjacentElement('afterend',status);
      }
      const go=()=>{
        const q=input.value.trim();
        if(q.length<2){status.textContent='Enter at least 2 characters to search guides.';input.focus();return;}
        status.textContent='Opening matching guides…';
        window.location.href='blog.html?q='+encodeURIComponent(q);
      };
      btn?.addEventListener('click',go);
      input.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); go(); } });
    });
    if(document.body.classList.contains('aureon-blog')){
      const q=new URLSearchParams(location.search).get('q');
      if(q){
        window.requestAnimationFrame(()=>{
          const box=document.getElementById('blogSearchInput');
          if(box){ box.value=q; box.dispatchEvent(new Event('input',{bubbles:true})); }
        });
      }
    }
  }

  function verifyRegisterMatch(){
    const form=document.querySelector('[data-vh-register-form], form[data-register-form], form');
    if(!document.body.classList.contains('aureon-register') && !/register\.html$/i.test(location.pathname)) return;
    const p=form?.querySelector('[name="password"]'), c=form?.querySelector('[name="confirmPassword"]');
    if(!form||!p||!c)return;
    const check=()=>{
      const ok=!c.value || p.value===c.value;
      c.setCustomValidity(ok?'':'Passwords do not match.');
      c.classList.toggle('is-invalid',!ok);
    };
    p.addEventListener('input',check); c.addEventListener('input',check); form.addEventListener('submit',check,true);
  }

  function normalizeCardContent(){
    document.querySelectorAll('.aureon-plans .feature-check-list li').forEach(li=>{ li.innerHTML=li.innerHTML.replace(/\s+/g,' ').trim(); });
    document.querySelectorAll('.aureon-about .aureon-review-card p').forEach(p=>{ p.style.flex='1 1 auto'; });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    wireContact();
    wireGuideSearch();
    verifyRegisterMatch();
    normalizeCardContent();
  });
})();
