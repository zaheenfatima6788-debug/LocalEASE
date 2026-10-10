(() => {
  const USERS_KEY = 'localease_demo_users_v1';
  const SESSION_KEY = 'localease_demo_session_v1';
  const NOTICE_KEY = 'localease_demo_notice_v1';
  const read = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const notice = (message, success = false, targetId = 'formNotice') => {
    const target = document.getElementById(targetId); if (!target) return;
    target.innerHTML = '';
    const box = document.createElement('div'); box.className = `notice${success ? ' success' : ''}`; box.textContent = message; target.appendChild(box);
  };
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const page = document.body.dataset.page;

  if (page === 'login') {
    let role = 'customer';
    document.querySelectorAll('[data-role]').forEach(button => button.addEventListener('click', () => {
      role = button.dataset.role;
      document.querySelectorAll('[data-role]').forEach(b => b.classList.toggle('active', b === button));
    }));
    document.getElementById('loginForm').addEventListener('submit', event => {
      event.preventDefault();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const user = read(USERS_KEY).find(item => item.email === email && item.role === role && item.password === password);
      if (!user) { notice('We could not find a matching demo account. Check your account type or register first.'); return; }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, role: user.role }));
      window.location.href = user.role === 'professional' ? 'dashboard.html' : 'index.html';
    });
  }

  if (page === 'register') {
    document.getElementById('registerForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form).entries());
      data.email = data.email.trim().toLowerCase();
      const users = read(USERS_KEY);
      if (users.some(user => user.email === data.email)) { notice('An account with this email already exists. Please log in instead.'); return; }
      const user = {
        role: 'professional', email: data.email, password: data.password,
        profile: { businessName: data.businessName.trim(), ownerName: data.ownerName.trim(), phone: data.phone.trim(), category: data.category, area: data.area.trim(), experience: Number(data.experience), price: Number(data.price), description: data.description.trim(), status: 'Pending review', createdAt: new Date().toISOString() }
      };
      users.push(user); save(USERS_KEY, users);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, role: user.role }));
      window.location.href = 'dashboard.html?registered=1';
    });
  }


  if (page === 'customer-register') {
    document.getElementById('customerRegisterForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form).entries());
      data.email = data.email.trim().toLowerCase();
      const users = read(USERS_KEY);
      if (users.some(user => user.email === data.email)) { notice('An account with this email already exists. Please log in instead.'); return; }
      const user = { role: 'customer', email: data.email, password: data.password, profile: { name: data.name.trim() } };
      users.push(user); save(USERS_KEY, users);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, role: user.role }));
      notice('Your customer demo account was created. Taking you to the homepage…', true);
      window.setTimeout(() => { window.location.href = 'index.html'; }, 700);
    });
  }

  if (page === 'dashboard') {
    let session = null;
    try { session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch {}
    const user = session && read(USERS_KEY).find(item => item.email === session.email && item.role === session.role);
    if (!user) {
      document.getElementById('welcomeTitle').textContent = 'Log in first.';
      document.getElementById('welcomeCopy').textContent = 'You need a demo account to view this dashboard.';
      document.getElementById('listingContent').textContent = 'No account is signed in. Log in as a professional to manage your listing.';
      document.getElementById('listingStat').textContent = '—';
      document.getElementById('profileStat').textContent = 'Signed out';
      document.getElementById('bookingStat').textContent = '—';
      const link = document.createElement('a'); link.className = 'primary'; link.href = 'login.html'; link.textContent = 'Go to login ↗'; document.querySelector('.bottom-actions').prepend(link);
    } else if (user.role !== 'professional') {
      window.location.href = 'index.html';
    } else {
      const p = user.profile || {};
      document.getElementById('welcomeTitle').textContent = `Hello, ${p.ownerName || 'professional'}.`;
      document.getElementById('welcomeCopy').textContent = 'Here is how your professional profile appears in this browser demo.';
      document.getElementById('accountStatus').textContent = 'PROFESSIONAL';
      document.getElementById('profileStat').textContent = p.status || 'Pending';
      document.getElementById('listingStat').textContent = '1';
      document.getElementById('bookingStat').textContent = '0';
      document.getElementById('listingContent').className = '';
      document.getElementById('listingContent').innerHTML = `<div class="listing-preview"><div><h3>${safe(p.businessName)}</h3><p><strong>${safe(p.category)}</strong> · ${safe(p.area)}<br>Starting at ₹${Number(p.price || 0).toLocaleString('en-IN')} · ${safe(p.experience)} year(s) of experience<br>${safe(p.description)}<br>Contact: ${safe(p.phone)} · ${safe(user.email)}</p></div><span class="status">${safe(p.status || 'Pending review')}</span></div><p class="file-hint">Your profile is saved locally and is not visible to other people or devices yet.</p>`;
      if (new URLSearchParams(location.search).get('registered')) notice('Your professional profile was created in this browser demo. Its status is Pending review.', true, 'dashboardNotice');
    }
    document.getElementById('logoutButton').addEventListener('click', () => { sessionStorage.removeItem(SESSION_KEY); window.location.href = 'login.html'; });
  }
})();
