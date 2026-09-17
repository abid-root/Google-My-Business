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

		document.querySelectorAll('.lead-form').forEach((form) => form.addEventListener('submit', async (event) => {
			event.preventDefault();
			const status = form.querySelector('.form-status');
			const submitButton = form.querySelector('button[type="submit"]');
			const data = new FormData(form);
			const business = (data.get('business') || '').trim();
			data.append('access_key', '5a5a484c-b2fe-42c8-a708-527e10a24043');
			data.append('subject', 'FlowSync - Free Google Profile Check: ' + business);
			data.append('from_name', 'FlowSync website');
			data.append('replyto', data.get('email') || '');
			if (submitButton) submitButton.disabled = true;
			if (status) status.textContent = 'Sending your request...';

			try {
				const response = await fetch('https://api.web3forms.com/submit', {
					method: 'POST',
					body: data,
				});
				const result = await response.json();
				if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
				form.reset();
				if (status) status.textContent = 'Thanks. Your request was sent successfully.';
			} catch (error) {
				if (status) status.textContent = 'Something went wrong. Please email abid.flowsync@gmail.com directly.';
			} finally {
				if (submitButton) submitButton.disabled = false;
			}
		}));
	});
})();