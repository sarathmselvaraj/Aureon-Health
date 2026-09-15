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
