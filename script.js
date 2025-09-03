 // ===== Utilities
    const $ = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
    const showToast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden'); setTimeout(()=> t.classList.add('hidden'), 2500); };

    // ===== Theme toggle with persistence
    const rootEl = document.documentElement;
    const userPref = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (userPref === 'dark' || (!userPref && systemDark)) rootEl.classList.add('dark');
    $('#themeToggle').addEventListener('click', () => {
      rootEl.classList.toggle('dark');
      const mode = rootEl.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('theme', mode);
      showToast(`Switched to ${mode} mode`);
    });

    // ===== Mobile menu
    const mobileBtn = $('#mobileBtn');
    const mobileMenu = $('#mobileMenu');
    mobileBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('hidden') === false;
      $('#menuIcon').classList.toggle('hidden', open);
      $('#closeIcon').classList.toggle('hidden', !open);
      mobileBtn.setAttribute('aria-expanded', String(open));
    });

    // ===== Counters (simple animate)
    const animateCounters = () => {
      $$('.[data-counter]');
    };
    const counters = $$('[data-counter]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target; const target = parseInt(el.getAttribute('data-counter'),10);
          let cur = 0; const step = Math.max(1, Math.floor(target/60));
          const timer = setInterval(()=>{ cur += step; if(cur>=target){cur=target; clearInterval(timer);} el.textContent = new Intl.NumberFormat().format(cur) + (target>1000?'+':''); }, 16);
          obs.unobserve(el);
        }
      });
    }, {threshold: 0.6});
    counters.forEach(c=>obs.observe(c));

    // ===== Tabs
    const tabs = $$('.spec-tab');
    const panels = $$('.spec-panel');
    tabs.forEach(btn => btn.addEventListener('click', () => {
      tabs.forEach(b=>b.classList.remove('active','bg-primary-600','text-white'));
      panels.forEach(p=>p.classList.add('hidden'));
      btn.classList.add('active','bg-primary-600','text-white');
      $('#' + btn.dataset.target).classList.remove('hidden');
    }));

    // ===== Doctor carousel buttons
    const carousel = $('#doctorCarousel');
    $('#docPrev').addEventListener('click', ()=> carousel.scrollBy({left: -320, behavior:'smooth'}));
    $('#docNext').addEventListener('click', ()=> carousel.scrollBy({left: 320, behavior:'smooth'}));

    // ===== Appointment form
    const form = $('#apptForm');
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = $('#fullName').value.trim();
      const phone = $('#phone').value.trim();
      const date = $('#date').value; const time = $('#time').value; const spec = $('#specialty').value;
      if(!/^(\+?\d{7,15})$/.test(phone)) { $('#formMsg').textContent = 'Please enter a valid phone number.'; $('#formMsg').className='mt-3 text-sm text-red-600'; return; }
      if (!spec) { $('#formMsg').textContent = 'Please select a specialty.'; $('#formMsg').className='mt-3 text-sm text-red-600'; return; }
      $('#formMsg').textContent = `Thanks ${name}! Your ${spec} appointment on ${date} at ${time} is pending confirmation.`;
      $('#formMsg').className = 'mt-3 text-sm text-green-600';
      showToast('Appointment request submitted');
      form.reset();
    });

    // ===== Newsletter & contact forms
    $('#newsForm').addEventListener('submit', e=>{ e.preventDefault(); $('#newsMsg').textContent='Thanks for subscribing!'; showToast('Subscribed successfully'); e.target.reset(); });
    $('#contactForm').addEventListener('submit', e=>{ e.preventDefault(); $('#contactMsg').textContent='We received your message. Our team will reach out soon.'; showToast('Message sent'); e.target.reset(); });

    // ===== Search mock
    $('#searchBtn').addEventListener('click', ()=> showToast('Search coming soon…'));

    // ===== Back to top
    const backTop = $('#backTop');
    window.addEventListener('scroll', ()=>{
      backTop.classList.toggle('hidden', window.scrollY < 400);
    });
    backTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

    // ===== Footer year
    $('#year').textContent = new Date().getFullYear();