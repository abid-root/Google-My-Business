(function () {
	const root = document.documentElement;
	const stored = localStorage.getItem('flowsync-theme');
	root.setAttribute('data-theme', stored || 'light');

	document.addEventListener('DOMContentLoaded', () => {
		const toggle = document.querySelector('[data-theme-toggle]');
		if (toggle) {
			toggle.addEventListener('click', () => {
				const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
				root.setAttribute('data-theme', next);
				localStorage.setItem('flowsync-theme', next);
			});
		}

		const hamburger = document.querySelector('[data-hamburger]');
		const menu = document.querySelector('[data-mobile-menu]');
		if (hamburger && menu) {
			hamburger.addEventListener('click', () => {
				const open = menu.classList.toggle('is-open');
				hamburger.setAttribute('aria-expanded', String(open));
				hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
			});
			menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
				menu.classList.remove('is-open');
				hamburger.setAttribute('aria-expanded', 'false');
			}));
		}

		const path = window.location.pathname.replace(/\/$/, '') || '/';
		document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((link) => {
			const href = link.getAttribute('href') || '';
			if (!href.startsWith('http') && !href.startsWith('mailto:')) {
				const target = new URL(href, window.location.href).pathname.replace(/\/$/, '') || '/';
				if (target === path) link.classList.add('active');
			}
		});

		document.querySelectorAll('.lead-form').forEach((form) => form.addEventListener('submit', (event) => {
			event.preventDefault();
			const data = new FormData(form);
			const business = (data.get('business') || '').trim();
			const website = (data.get('website') || '').trim();
			const message = (data.get('message') || '').trim();
			const email = (data.get('email') || '').trim();
			const subject = encodeURIComponent('FlowSync - Free Google Profile Check: ' + business);
			const body = encodeURIComponent('Business: ' + business + '\nWebsite / Google Profile: ' + website + '\nEmail: ' + email + '\n\nWhat to check:\n' + message);
			window.location.href = 'mailto:abid.flowsync@gmail.com?subject=' + subject + '&body=' + body;
			const status = form.querySelector('.form-status');
			if (status) status.textContent = 'Your email app should open with the request ready to send.';
		}));
	});
})();