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
