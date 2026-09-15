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
