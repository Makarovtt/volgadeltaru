const header = document.querySelector('.site-header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const toTop = document.getElementById('toTop');
const heroImg = document.querySelector('.hero__img');
const mapHero = document.querySelector('.map-hero');
const mapEl = document.getElementById('groundsMap');
const mapShield = document.getElementById('mapShield');
const mapZoomIn = document.getElementById('mapZoomIn');
const mapZoomOut = document.getElementById('mapZoomOut');

let groundsMap = null;

const groundsBorder = [
    [45.9060, 48.3155],
    [45.8850, 48.3030],
    [45.8580, 48.2890],
    [45.8320, 48.2810],
    [45.8060, 48.2820],
    [45.7860, 48.2900],
    [45.7680, 48.2960],
    [45.7525, 48.2985],
    [45.7494, 48.3081],
    [45.7425, 48.3171],
    [45.7306, 48.3248],
    [45.7021, 48.3390],
    [45.6894, 48.3555],
    [45.6754, 48.3804],
    [45.6678, 48.3857],
    [45.6594, 48.3871],
    [45.6519, 48.3915],
    [45.6461, 48.4052],
    [45.6414, 48.4119],
    [45.6375, 48.4233],
    [45.6284, 48.4343],
    [45.6232, 48.4374],
    [45.6059, 48.4416],
    [45.5927, 48.4280],
    [45.5890, 48.4215],
    [45.5180, 48.5508],
    [45.5810, 48.5254],
    [45.5870, 48.5226],
    [45.5937, 48.5193],
    [45.5987, 48.5169],
    [45.6043, 48.5145],
    [45.6102, 48.5118],
    [45.6369, 48.4991],
    [45.6598, 48.4883],
    [45.6786, 48.4793],
    [45.6966, 48.4706],
    [45.7086, 48.4678],
    [45.7193, 48.4649],
    [45.7281, 48.4625],
    [45.7314, 48.4618],
    [45.7327, 48.4616],
    [45.7346, 48.4620],
    [45.7354, 48.4621],
    [45.7430, 48.4577],
    [45.7588, 48.4483],
    [45.7618, 48.4467],
    [45.7627, 48.4461],
    [45.7701, 48.4415],
    [45.7716, 48.4407],
    [45.7726, 48.4399],
    [45.7739, 48.4389],
    [45.7759, 48.4383],
    [45.8371, 48.4016],
    [45.8383, 48.4010],
    [45.8620, 48.3780],
    [45.8840, 48.3480]
];

if (mapEl && window.L) {
    groundsMap = L.map(mapEl, {
        zoomControl: false,
        scrollWheelZoom: false,
        minZoom: 7,
        maxZoom: 16
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 17,
        attribution: 'Esri, Maxar, Earthstar Geographics'
    }).addTo(groundsMap);

    L.polygon(groundsBorder, {
        color: '#e5382a',
        weight: 3,
        fillColor: '#e5382a',
        fillOpacity: 0.14
    }).addTo(groundsMap);

    const bounds = L.latLngBounds(groundsBorder);
    groundsMap.fitBounds(bounds.pad(0.06));
    const zoom = groundsMap.getZoom() - 2;
    const centerPx = groundsMap.project(bounds.getCenter(), zoom);
    const shifted = groundsMap.unproject([centerPx.x - mapEl.clientWidth * 0.15, centerPx.y], zoom);
    groundsMap.setView(shifted, zoom);

    const dotIcon = L.divIcon({ className: 'map-dot', iconSize: [14, 14], iconAnchor: [7, 7] });
    const label = (pos, text, direction = 'right') =>
        L.marker(pos, { icon: dotIcon })
            .bindTooltip(text, { permanent: true, direction, className: 'map-label', offset: direction === 'left' ? [-8, 0] : [8, 0] })
            .addTo(groundsMap);

    label([45.9181, 48.3069], 'с. Каралат', 'left');
    label([45.9060, 48.3155], 'Точка № 1 — исток Рытого Колочного канала');
    label([45.7569, 48.4485], 'Турбаза «Волга-Дельта»');
    label([45.6650, 48.3800], 'о. Галкин');
    label([45.5180, 48.5508], 'Точка № 2 — Каспийское море');
}

const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-visible', y > 800);
    if (heroImg && y < window.innerHeight) {
        heroImg.style.transform = `translateY(${y * 0.25}px)`;
    }
    if (mapEl) {
        const r = mapHero.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
            const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
            mapEl.style.transform = `translateY(${progress * -70}px)`;
        }
    }
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (mapShield) {
    mapShield.addEventListener('click', () => {
        mapHero.classList.add('is-active');
        groundsMap?.scrollWheelZoom.enable();
    });
    mapHero.addEventListener('mouseleave', () => {
        mapHero.classList.remove('is-active');
        groundsMap?.scrollWheelZoom.disable();
    });
}

mapZoomIn?.addEventListener('click', () => groundsMap?.zoomIn());
mapZoomOut?.addEventListener('click', () => groundsMap?.zoomOut());



burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
});

nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const advSlider = document.getElementById('advSlider');
const advDots = document.getElementById('advDots');

if (advSlider && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const slides = [...advSlider.querySelectorAll('.adv__item')];
    const FLY_IN = 950;
    const HOLD = 3000;
    const FLY_OUT = 620;
    const OVERLAP = 250;
    let current = 0;
    let pending = null;
    let timer = null;
    let holding = false;

    const dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'adv__dot';
        dot.setAttribute('aria-label', `Преимущество ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        advDots.appendChild(dot);
        return dot;
    });

    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const easeIn = t => t * t * t;
    const easeOutBack = t => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);

    const animate = (duration, frame) => {
        const start = performance.now();
        const tick = now => {
            const p = Math.min((now - start) / duration, 1);
            frame(p);
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const flyIn = slide => animate(FLY_IN, p => {
        const e = easeOut(p);
        const x = -62 * (1 - e);
        const y = -70 * Math.sin(p * Math.PI) + 90 * (1 - e);
        const scale = 0.7 + 0.3 * easeOutBack(p);
        const rotate = -6 * (1 - e);
        const fade = Math.min(p / 0.3, 1);
        slide.style.opacity = fade;
        slide.style.filter = `blur(${(1 - Math.min(p / 0.35, 1)) * 6}px)`;
        slide.style.transform = `translate(${x}%, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
    });

    const flyOut = slide => animate(FLY_OUT, p => {
        const e = easeIn(p);
        const x = 120 * e;
        const y = 30 * Math.sin(p * Math.PI) - 95 * e;
        const scale = 1 - 0.3 * e;
        const skew = -16 * e;
        const fade = p < 0.35 ? 1 : 1 - (p - 0.35) / 0.65;
        slide.style.opacity = fade;
        slide.style.filter = `blur(${14 * e}px)`;
        slide.style.transform = `translate(${x}%, ${y}px) scale(${scale}) skewX(${skew}deg)`;
    });

    const enter = i => {
        current = i;
        holding = true;
        const slide = slides[i];
        slide.classList.add('is-active');
        dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
        flyIn(slide);
        if (!advSlider.matches(':hover')) {
            timer = setTimeout(leave, FLY_IN + HOLD);
        }
    };

    const leave = () => {
        holding = false;
        const slide = slides[current];
        slide.classList.remove('is-active');
        slide.classList.add('is-leaving');
        flyOut(slide);
        setTimeout(() => {
            slide.classList.remove('is-leaving');
            slide.removeAttribute('style');
        }, FLY_OUT);
        timer = setTimeout(() => {
            const next = pending ?? (current + 1) % slides.length;
            pending = null;
            enter(next);
        }, OVERLAP);
    };

    const goTo = i => {
        if (i === current) return;
        clearTimeout(timer);
        pending = i;
        if (holding) leave();
    };

    advSlider.addEventListener('mouseenter', () => {
        if (holding) clearTimeout(timer);
    });

    advSlider.addEventListener('mouseleave', () => {
        if (holding) {
            clearTimeout(timer);
            timer = setTimeout(leave, HOLD);
        }
    });

    enter(0);
}

const formatNumber = n => n.toLocaleString('ru-RU').replace(/,/g, ' ');

const animateCount = el => {
    const target = +el.dataset.count;
    const duration = 1600;
    const start = performance.now();
    const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = formatNumber(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
};

const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

const lightbox = document.getElementById('lightbox');
const lightboxTriggers = [...document.querySelectorAll('#village .village-hero, #village .village-shot')];

if (lightbox && lightboxTriggers.length) {
    const lightboxImg = lightbox.querySelector('.lightbox__img');
    const lightboxCaption = lightbox.querySelector('.lightbox__caption');
    let lightboxIndex = 0;

    const openLightbox = i => {
        lightboxIndex = (i + lightboxTriggers.length) % lightboxTriggers.length;
        const img = lightboxTriggers[lightboxIndex].querySelector('img');
        const caption = lightboxTriggers[lightboxIndex].querySelector('figcaption');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.innerText.trim() : '';
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    lightboxTriggers.forEach((el, i) => {
        el.addEventListener('click', () => openLightbox(i));
    });

    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', () => openLightbox(lightboxIndex - 1));
    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', () => openLightbox(lightboxIndex + 1));
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(lightboxIndex - 1);
        if (e.key === 'ArrowRight') openLightbox(lightboxIndex + 1);
    });
}
