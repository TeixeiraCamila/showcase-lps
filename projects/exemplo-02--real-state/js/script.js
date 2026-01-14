// ANIMAÇÕES DE ROLAGEM
// Cria um IntersectionObserver para disparar animações quando elementos entram na tela
const scrollObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
			}
		});
	},
	{
		threshold: 0.1, // Dispara quando 10% do elemento está visível
		rootMargin: '0px 0px -50px 0px', // Margem opcional para disparar antes/depois
	}
);

// Observa todos os elementos com classes de animação de rolagem
document
	.querySelectorAll(
		'.scroll-fade-up, .scroll-fade-in, .scroll-slide-right, .scroll-slide-left, .scroll-scale'
	)
	.forEach((el) => {
		scrollObserver.observe(el);
	});

// ANIMAÇÕES ORIGINAIS
// Gerencia animações especiais como contadores e efeitos de digitação usando IntersectionObserver
const observer = new IntersectionObserver((entries, obs) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const el = entry.target;

			// Animação de contador para números de conquistas
			if (el.classList.contains('about__achievement-number')) {
				const targetNumber = +el.dataset.number; // Obtém o número alvo do atributo data
				let current = 0;
				const increment = Math.ceil(targetNumber / 60); // Calcula o incremento para animação suave

				const counter = setInterval(() => {
					current += increment;
					if (current >= targetNumber) {
						el.innerHTML = `${targetNumber} <span>+</span>`;
						clearInterval(counter);
					} else {
						el.innerHTML = `${current} <span>+</span>`;
					}
				}, 100); // Atualiza a cada 100ms
			}

			// Efeito de digitação para elementos de título
			if (el.classList.contains('title--entry')) {
				const textNode = Array.from(el.childNodes).find(
					(n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== ''
				);
				if (textNode) {
					const fullText = textNode.textContent.trim();
					textNode.textContent = ''; // Limpa o texto
					let i = 0;

					const type = setInterval(() => {
						textNode.textContent += fullText[i];
						i++;
						if (i >= fullText.length) clearInterval(type);
					}, 100); // Digita um caractere a cada 100ms
				}
			}

			obs.unobserve(el); // Para de observar após o disparo da animação
		}
	});
});

// Seleciona e observa elementos para animações especiais
const achievements = document.querySelectorAll('.about__achievement-number');
const titles = document.querySelectorAll('.title--entry');
[...achievements, ...titles].forEach((el) => observer.observe(el));

// SLIDER
// Implementa um carrossel com autoplay, controles manuais e navegação por teclado
const slider = document.querySelector('.project__slider');
const track = slider.querySelector('.project__slider-track');
const slides = slider.querySelectorAll('.project__slider-item');
const prevBtn = slider.querySelector('.project__slider-arrow--prev');
const nextBtn = slider.querySelector('.project__slider-arrow--next');

let index = 0; // Índice do slide atual
let autoplay; // ID do intervalo de autoplay

// Atualiza a posição do slider e o estilo do slide ativo
function updateSlider() {
	track.style.transform = `translateX(-${index * 100}%)`; // Move o track para mostrar o slide atual

	slides.forEach((slide, i) => {
		slide.classList.toggle('project__slider-item--active', i === index); // Destaca o slide ativo
	});
}

// Avança para o próximo slide
function nextSlide() {
	index = (index + 1) % slides.length; // Volta ao primeiro slide no final
	updateSlider();
}

// Volta para o slide anterior
function prevSlide() {
	index = (index - 1 + slides.length) % slides.length; // Volta ao último slide no início
	updateSlider();
}

// Inicia a funcionalidade de autoplay
function startAutoplay() {
	autoplay = setInterval(nextSlide, 8000); // Muda de slide a cada 8 segundos
}

// Para o autoplay
function stopAutoplay() {
	clearInterval(autoplay);
}

// Ouvintes de eventos para controles manuais
nextBtn.addEventListener('click', () => {
	nextSlide();
	stopAutoplay();
	startAutoplay(); // Reinicia o autoplay após interação manual
});

prevBtn.addEventListener('click', () => {
	prevSlide();
	stopAutoplay();
	startAutoplay();
});

// Navegação por teclado para acessibilidade
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

// Pausa o autoplay ao passar o mouse para melhor UX
slider.addEventListener('mouseenter', stopAutoplay);
slider.addEventListener('mouseleave', startAutoplay);

// Inicializa o slider
updateSlider();
startAutoplay();

// TOGGLE DO MENU MOBILE
// Gerencia a funcionalidade responsiva do menu mobile com recursos de acessibilidade
document.addEventListener('DOMContentLoaded', () => {
	const burger = document.querySelector('.header__burger');
	if (!burger) return; // Sai se o botão burger não for encontrado

	// Cria o container do menu mobile clonando o menu desktop, se não existir
	let mobileMenu = document.querySelector('.header__menu-mobile');
	const desktopMenu = document.querySelector('.header__menu');
	if (!mobileMenu) {
		mobileMenu = document.createElement('nav');
		mobileMenu.className = 'header__menu-mobile';
		mobileMenu.id = 'mobile-menu';
		mobileMenu.setAttribute('aria-label', 'Navegação mobile');
		const clone = desktopMenu ? desktopMenu.cloneNode(true) : null;
		if (clone) {
			clone.classList.remove('header__menu');
			mobileMenu.appendChild(clone);
		}
		document.querySelector('.header__container').appendChild(mobileMenu);
	}

	// Alterna o estado aberto/fechado do menu mobile
	function toggleMenu() {
		const isOpen = mobileMenu.classList.contains('is-open');
		if (isOpen) {
			// Fecha o menu
			mobileMenu.classList.remove('is-open');
			burger.classList.remove('is-open');
			burger.setAttribute('aria-label', 'Abrir menu');
			burger.setAttribute('aria-expanded', 'false');
			// Aguarda a transição antes de ocultar
			setTimeout(() => {
				if (!mobileMenu.classList.contains('is-open')) {
					mobileMenu.style.display = 'none';
				}
			}, 300);
		} else {
			// Abre o menu
			mobileMenu.style.display = 'block';
			// Força reflow para aplicar a transição
			mobileMenu.offsetHeight;
			mobileMenu.classList.add('is-open');
			burger.classList.add('is-open');
			burger.setAttribute('aria-label', 'Fechar menu');
			burger.setAttribute('aria-expanded', 'true');
		}
	}

	// Ouvinte de evento para clique no botão burger
	burger.addEventListener('click', toggleMenu);

	// Fecha o menu ao clicar fora
	document.addEventListener('click', (e) => {
		if (!mobileMenu || !burger) return;
		if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
			if (mobileMenu.classList.contains('is-open')) {
				toggleMenu();
			}
		}
	});

	// Fecha o menu ao pressionar Escape para acessibilidade
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
			toggleMenu();
			burger.focus(); // Retorna o foco ao botão burger
		}
	});
});
