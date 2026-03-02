const field=document.getElementById('particles');
if(field){for(let i=0;i<12;i++){const p=document.createElement('div');p.className='void-particle';p.style.left=`${Math.random()*100}%`;p.style.bottom='0';p.style.width=p.style.height=`${1+Math.random()*1.5}px`;const dur=9+Math.random()*8;const delay=-(Math.random()*dur);const dx=(Math.random()-.5)*60;p.style.setProperty('--dur',`${dur}s`);p.style.setProperty('--delay',`${delay}s`);p.style.setProperty('--dx',`${dx}px`);field.appendChild(p);}}
const revealEls=document.querySelectorAll('.feat-card,.sec-row,.st,.section-title,.section-sub');
revealEls.forEach(el=>el.classList.add('reveal'));
const observer=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*40);observer.unobserve(e.target);}});},{threshold:.1});
revealEls.forEach(el=>observer.observe(el));
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{nav.style.background=window.scrollY>20?'rgba(10,10,15,.95)':'rgba(10,10,15,.8)';},{passive:true});
