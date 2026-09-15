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
