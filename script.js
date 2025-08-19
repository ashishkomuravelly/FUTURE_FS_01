document.addEventListener('DOMContentLoaded', () => {
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle (light/dark)
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const root = document.documentElement;

  function setTheme(mode) {
    if (mode === 'light') {
      root.style.setProperty('--bg', '#f7f8fc');
      root.style.setProperty('--fg', '#ffffff');
      root.style.setProperty('--text', '#0b1020');
      root.style.setProperty('--muted', '#475569');
      themeIcon && (themeIcon.textContent = '🌞');
    } else {
      root.style.setProperty('--bg', '#0b1020');
      root.style.setProperty('--fg', '#0f172a');
      root.style.setProperty('--text', '#e5e7eb');
      root.style.setProperty('--muted', '#a1a1aa');
      themeIcon && (themeIcon.textContent = '🌙');
    }
    localStorage.setItem('theme', mode);
  }
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const next = (localStorage.getItem('theme') || 'dark') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(`Switched to ${next} mode`);
  });

  // Mobile menu
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  mobileBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });
  document.querySelectorAll('#mobileMenu a').forEach(a => {
    a.addEventListener('click', () => mobileMenu?.classList.add('hidden'));
  });

  // Filter projects
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  function setActive(btn) {
    filterButtons.forEach(b => {
      if (b === btn) {
        b.classList.remove('glass');
        b.classList.add('bg-gradient-to-r','from-[var(--brand2)]','to-[var(--brand3)]','text-slate-900');
      } else {
        b.classList.add('glass');
        b.classList.remove('bg-gradient-to-r','from-[var(--brand2)]','to-[var(--brand3)]','text-slate-900');
      }
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-filter');
      setActive(btn);
      projectCards.forEach(card => {
        const tags = (card.getAttribute('data-tags') || '').split(' ');
        const show = tag === 'all' || tags.includes(tag);
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // Project modal
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const closeModal = document.getElementById('closeModal');

  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      modalTitle.textContent = btn.dataset.title || 'Project';
      modalDesc.textContent = btn.dataset.desc || '';
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });

  function hideModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  closeModal?.addEventListener('click', hideModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal || (e.target.classList && e.target.classList.contains('bg-black/60'))) hideModal();
  });

  // Resume download (generates a simple TXT)
  const downloadResumeBtn = document.getElementById('downloadResume');
  downloadResumeBtn?.addEventListener('click', () => {
    const content = `Ashish Komuravelly
Role: Frontend Developer

Summary:
Crafting clean, accessible, and delightful web experiences.

Skills:
- HTML, CSS, JavaScript
- UI/UX, Accessibility
- Node.js, MySQL (basic)

Experience:
- Company A — Frontend Developer (2022–Present)
- Company B — Web Designer (2020–2022)

Links:
- GitHub: https://github.com/yourname
- Website: https://yourdomain.com
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'YourName-Resume.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Resume downloaded');
  });

  // Contact form demo: save to localStorage
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  function getMessages() {
    try { return JSON.parse(localStorage.getItem('messages') || '[]'); }
    catch { return []; }
  }
  function saveMessages(list) {
    localStorage.setItem('messages', JSON.stringify(list));
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();
    if (!name || !email || !message) {
      showToast('Please fill all fields');
      return;
    }
    const messages = getMessages();
    messages.push({ name, email, message, date: new Date().toISOString() });
    saveMessages(messages);
    form.reset();
    showToast('Message saved (demo)');
    if (formNote) formNote.textContent = 'Saved locally. Export messages or connect a backend for real delivery.';
  });

  // mailto fallback
  const mailtoBtn = document.getElementById('mailtoBtn');
  mailtoBtn?.addEventListener('click', (e) => {
    // Allow default mailto to work, but enrich subject/body from form fields
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();
    const subject = encodeURIComponent(`Hello from ${name || 'Your Website'}`);
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    mailtoBtn.href = `mailto:ashishkomuravelly9@gmail.com?subject=${subject}&body=${body}`;
  });

  // Export / Clear messages
  const exportBtn = document.getElementById('exportMessages');
  const clearBtn = document.getElementById('clearMessages');

  exportBtn?.addEventListener('click', () => {
    const messages = getMessages();
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'messages-demo.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Exported messages');
  });

  clearBtn?.addEventListener('click', () => {
    localStorage.removeItem('messages');
    showToast('Cleared messages');
  });

  // Blog & backend info
  const blogInfo = document.getElementById('blogInfo');
  blogInfo?.addEventListener('click', () => {
    alert(
`Backend & Blog integration:
- Contact: Create an API endpoint in Node.js to receive form data and send email.
- Blog: Expose posts from a database (MySQL) as JSON and fetch them here to display.
I can provide a step-by-step when you’re ready.`
    );
  });

  // Toast helper
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer;
  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 2200);
  }

  // Expose toast to other handlers
  window.showToast = showToast;
});
