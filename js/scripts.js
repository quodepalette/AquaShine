        /* Rain Drops  */
        const heroDrops = document.getElementById('heroDrops');
        for (let i = 0; i < 24; i++) {
            const drop = document.createElement('div');
            drop.className = 'drop';
            const h = 30 + Math.random() * 80;
            drop.style.cssText = `left:${Math.random() * 100}%;height:${h}px;animation-duration:${1.5 + Math.random() * 2.5}s;animation-delay:${Math.random() * 4}s;opacity:${0.2 + Math.random() * 0.5};`;
            heroDrops.appendChild(drop);
        }

        /*  Navbar  */
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
            const btt = document.getElementById('backToTop');
            if (window.scrollY > 400) btt.classList.add('visible');
            else btt.classList.remove('visible');
        });

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        /*  Scroll Reveal  */
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

        /*  Counter Animation  */
        function animateCounter(el, target, suffix = '') {
            let start = 0;
            const duration = 2000;
            const step = 20;
            const increment = target / (duration / step);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    start = target;
                    clearInterval(timer);
                }
                el.textContent = Math.floor(start).toLocaleString() + suffix;
            }, step);
        }

        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('[data-count]').forEach(el => {
                        const target = parseInt(el.getAttribute('data-count'));
                        const suffix = el.textContent.includes('%') ? '%' : (target > 999 ? '+' : '');
                        animateCounter(el, target, el.closest('.hero-stat').querySelector('.hero-stat-label').textContent.includes('Satisfaction') ? '%' : (target > 999 ? '+' : ''));
                    });
                    heroObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });
        const heroEl = document.querySelector('.hero-stats');
        if (heroEl) heroObserver.observe(heroEl);

        /*  Faq  */
        document.querySelectorAll('.faq-q').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.faq-item');
                const isOpen = item.classList.contains('open');
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
                if (!isOpen) item.classList.add('open');
            });
        });

        /*  Gallery Filter  */
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.opacity = '0';
                        item.style.display = 'block';
                        requestAnimationFrame(() => {
                            item.style.transition = 'opacity 0.4s ease';
                            item.style.opacity = '1';
                        });
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => { item.style.display = 'none'; }, 400);
                    }
                });
            });
        });

        /*  Lightbox  */
        const lightbox = document.getElementById('lightbox');
        const lbImg = document.getElementById('lbImg');
        let lbImages = [], lbIndex = 0;

        function buildLbImages() {
            lbImages = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'))
                .map(i => i.querySelector('img').src);
        }

        document.querySelectorAll('.gallery-item').forEach((item, idx) => {
            item.addEventListener('click', () => {
                buildLbImages();
                const src = item.querySelector('img').src;
                lbIndex = lbImages.indexOf(src);
                lbImg.src = src;
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });

        document.getElementById('lbClose').addEventListener('click', () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        });
        document.getElementById('lbPrev').addEventListener('click', () => {
            buildLbImages();
            lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
            lbImg.src = lbImages[lbIndex];
        });
        document.getElementById('lbNext').addEventListener('click', () => {
            buildLbImages();
            lbIndex = (lbIndex + 1) % lbImages.length;
            lbImg.src = lbImages[lbIndex];
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
            if (e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
            if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
        });

        /*  Contact Form  */
        document.getElementById('contactForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button[type=submit]');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            setTimeout(() => {
                btn.style.display = 'none';
                document.getElementById('formSuccess').style.display = 'block';
                this.reset();
            }, 1800);
        });

        /*  Newsletter Form  */
        document.getElementById('nlForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            btn.textContent = 'Subscribed!';
            btn.style.background = '#10B981';
            setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; this.reset(); }, 3000);
        });

        /*  Back To Top  */
        document.getElementById('backToTop').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        /*  Active Nav Link  */
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(s => {
                if (window.scrollY >= s.offsetTop - 100) current = s.id;
            });
            navLinks.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === '#' + current) a.classList.add('active');
            });
        });