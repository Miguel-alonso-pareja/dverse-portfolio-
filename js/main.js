// M. Alonso portfolio — shared interactions
(function(){
  // Theme: persisted in-memory only (no localStorage per spec), default dark,
  // but respects prefers-color-scheme on first load.
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');

  function applyTheme(t){
    root.setAttribute('data-theme', t);
    if(toggle) toggle.textContent = t === 'light' ? '☾' : '☀';
  }
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(prefersLight ? 'light' : 'dark');

  if(toggle){
    toggle.addEventListener('click', function(){
      const cur = root.getAttribute('data-theme');
      applyTheme(cur === 'light' ? 'dark' : 'light');
    });
  }

  // Cursor glow
  const glow = document.getElementById('glow');
  if(glow){
    window.addEventListener('pointermove', function(e){
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    }, {passive:true});
  }

  // Nav scroll state
  const nav = document.querySelector('.nav');
  if(nav){
    window.addEventListener('scroll', function(){
      nav.classList.toggle('scrolled', window.scrollY > 8);
    }, {passive:true});
  }

  // Mobile menu
  const menuBtn = document.querySelector('.menu-toggle');
  if(menuBtn && nav){
    function closeMenu(){
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
    }
    menuBtn.addEventListener('click', function(){
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('.links a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
    window.addEventListener('resize', function(){
      if(window.innerWidth > 720) closeMenu();
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  // Skill bars fill on view
  const skillFills = document.querySelectorAll('.skill .fill');
  if(skillFills.length){
    const io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          const target = entry.target.getAttribute('data-fill') || '0%';
          entry.target.style.width = target;
          io2.unobserve(entry.target);
        }
      });
    }, {threshold: 0.3});
    skillFills.forEach(function(el){ io2.observe(el); });
  }

  // Work-list hover thumbnails (desktop pointer only)
  const workRows = document.querySelectorAll('.work-row[data-thumb]');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(canHover && workRows.length){
    const thumb = document.createElement('div');
    thumb.className = 'work-thumb';
    thumb.setAttribute('aria-hidden', 'true');
    const img = document.createElement('img');
    img.alt = '';
    thumb.appendChild(img);
    document.body.appendChild(thumb);

    const w = 220, h = 132, gap = 20, pad = 16;
    let fadeTimer;
    workRows.forEach(function(row){
      const src = row.getAttribute('data-thumb');
      const preload = new Image();
      preload.src = src;
      row.addEventListener('pointerenter', function(){
        img.src = src;
        thumb.classList.remove('is-visible');
        clearTimeout(fadeTimer);
        fadeTimer = setTimeout(function(){
          thumb.classList.add('is-visible');
        }, 20);
      });
      row.addEventListener('pointerleave', function(){
        clearTimeout(fadeTimer);
        thumb.classList.remove('is-visible');
      });
      row.addEventListener('pointermove', function(e){
        let x = e.clientX + gap;
        let y = e.clientY - h * 0.7;
        if(x + w > window.innerWidth - pad) x = e.clientX - gap - w;
        if(y < pad) y = pad;
        if(y + h > window.innerHeight - pad) y = window.innerHeight - h - pad;
        thumb.style.left = x + 'px';
        thumb.style.top = y + 'px';
      });
    });
  }
  const clock = document.getElementById('local-time');
  if(clock){
    function tick(){
      const now = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit'
      });
      clock.textContent = now + ' CET · Barcelona';
    }
    tick();
    setInterval(tick, 30000);
  }
})();
