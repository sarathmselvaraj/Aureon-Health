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
