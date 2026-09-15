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
