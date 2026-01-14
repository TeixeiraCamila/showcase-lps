// SCROLL ANIMATIONS
const scrollObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
			}
		});
	},
	{
		threshold: 0.1,
		// rootMargin: '0px 0px -50px 0px',
	}
);

document
	.querySelectorAll(
		'.scroll-fade-up, .scroll-fade-in, .scroll-slide-right, .scroll-slide-left, .scroll-scale'
	)
	.forEach((el) => {
		scrollObserver.observe(el);
	});



// ANIMAÇÕES ORIGINAIS
const observer = new IntersectionObserver((entries, obs) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const el = entry.target;

			// contador
			if (el.classList.contains('about__achievement-number')) {
				const targetNumber = +el.dataset.number;
				let current = 0;
				const increment = Math.ceil(targetNumber / 60);

				const counter = setInterval(() => {
					current += increment;
					if (current >= targetNumber) {
						el.innerHTML = `${targetNumber} <span>+</span>`;
						clearInterval(counter);
					} else {
						el.innerHTML = `${current} <span>+</span>`;
					}
				}, 100);
			}

			// digitação
			if (el.classList.contains('title--entry')) {
				const textNode = Array.from(el.childNodes).find(
					(n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== ''
				);
				if (textNode) {
					const fullText = textNode.textContent.trim();
					textNode.textContent = '';
					let i = 0;

					const type = setInterval(() => {
						textNode.textContent += fullText[i];
						i++;
						if (i >= fullText.length) clearInterval(type);
					}, 100);
				}
			}

			obs.unobserve(el);
		}
	});
});

const achievements = document.querySelectorAll('.about__achievement-number');
const titles = document.querySelectorAll('.title--entry');
[...achievements, ...titles].forEach((el) => observer.observe(el));

// SLIDER
const slider = document.querySelector('.project__slider');
const track = slider.querySelector('.project__slider-track');
const slides = slider.querySelectorAll('.project__slider-item');
const prevBtn = slider.querySelector('.project__slider-arrow--prev');
const nextBtn = slider.querySelector('.project__slider-arrow--next');

let index = 0;
let autoplay;

function updateSlider() {
	track.style.transform = `translateX(-${index * 100}%)`;

	slides.forEach((slide, i) => {
		slide.classList.toggle('project__slider-item--active', i === index);
	});
}

function nextSlide() {
	index = (index + 1) % slides.length;
	updateSlider();
}

function prevSlide() {
	index = (index - 1 + slides.length) % slides.length;
	updateSlider();
}

function startAutoplay() {
	autoplay = setInterval(nextSlide, 8000);
}

function stopAutoplay() {
	clearInterval(autoplay);
}

nextBtn.addEventListener('click', () => {
	nextSlide();
	stopAutoplay();
	startAutoplay();
});

prevBtn.addEventListener('click', () => {
	prevSlide();
	stopAutoplay();
	startAutoplay();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
	if (e.key === 'ArrowLeft') {
		prevSlide();
		stopAutoplay();
		startAutoplay();
	} else if (e.key === 'ArrowRight') {
		nextSlide();
		stopAutoplay();
		startAutoplay();
	}
});

slider.addEventListener('mouseenter', stopAutoplay);
slider.addEventListener('mouseleave', startAutoplay);

updateSlider();
startAutoplay();

// MENU MOBILE TOGGLE
document.addEventListener('DOMContentLoaded', () => {
	const burger = document.querySelector('.header__burger');
	if (!burger) return;

	// create mobile menu container from existing menu
	let mobileMenu = document.querySelector('.header__menu-mobile');
	const desktopMenu = document.querySelector('.header__menu');
	if (!mobileMenu) {
		mobileMenu = document.createElement('nav');
		mobileMenu.className = 'header__menu-mobile';
		mobileMenu.id = 'mobile-menu';
		mobileMenu.setAttribute('aria-label', 'Mobile navigation');
		const clone = desktopMenu ? desktopMenu.cloneNode(true) : null;
		if (clone) {
			clone.classList.remove('header__menu');
			mobileMenu.appendChild(clone);
		}
		document.querySelector('.header__container').appendChild(mobileMenu);
	}

	function toggleMenu() {
		const isOpen = mobileMenu.classList.contains('is-open');
		if (isOpen) {
			mobileMenu.classList.remove('is-open');
			burger.classList.remove('is-open');
			burger.setAttribute('aria-label', 'Open menu');
			burger.setAttribute('aria-expanded', 'false');
			// Aguarda a transição antes de ocultar
			setTimeout(() => {
				if (!mobileMenu.classList.contains('is-open')) {
					mobileMenu.style.display = 'none';
				}
			}, 300);
		} else {
			mobileMenu.style.display = 'block';
			// Force reflow para aplicar a transição
			mobileMenu.offsetHeight;
			mobileMenu.classList.add('is-open');
			burger.classList.add('is-open');
			burger.setAttribute('aria-label', 'Close menu');
			burger.setAttribute('aria-expanded', 'true');
		}
	}

	burger.addEventListener('click', toggleMenu);

	// fechar ao clicar fora
	document.addEventListener('click', (e) => {
		if (!mobileMenu || !burger) return;
		if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
			if (mobileMenu.classList.contains('is-open')) {
				toggleMenu();
			}
		}
	});

	// fechar ao pressionar Escape
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
			toggleMenu();
			burger.focus();
		}
	});
});
