document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('wheel', onWheel, { passive: false });
	window.addEventListener('touchstart', onTouchStart, { passive: true });
	window.addEventListener('touchmove', onTouchMove, { passive: true });
	window.addEventListener('touchend', onTouchEnd, { passive: true });
	window.addEventListener('keydown', onKey);

	document.body.setAttribute('tabindex', '0');

	const texts = Array.from(document.querySelectorAll('.slide__text'));
	const slides = Array.from(document.querySelectorAll('.slide'));

	if (!slides.length) return;

	const status = document.getElementById('status');

	let current = 0; // Índice do slide atual
	const total = slides.length; // Total de slides
	let isAnimating = false; // Flag de animação em andamento

	const COOLDOWN = 450; // Tempo mínimo entre transições (ms)
	const WHEEL_THRESHOLD = 30; // Sensibilidade do scroll do mouse
	const TOUCH_THRESHOLD = 40; // Sensibilidade do swipe touch
	const ANIMATION_DURATION = 0.9; // Duração da animação principal
	const WIDTH__MINUS = 400; // Offset para posição do texto

	let lastAction = 0; // Timestamp da última ação
	let touchStartY = null; // Posição Y inicial do touch

	// Todos os slides começam invisíveis
	gsap.set(slides, {
		autoAlpha: 0,
	});

	// Primeiro slide visível
	gsap.set(slides[0], {
		autoAlpha: 1,
		attr: { 'data-active': 'true' },
	});

	// Todos os textos começam invisíveis
	gsap.set(texts, {
		autoAlpha: 0,
		x: -100, // Começa deslocado para esquerda
		y: 0,
	});

	// Primeiro texto visível com animação de entrada
	gsap.to(texts[0], {
		autoAlpha: 0.8,
		x: slides[0].offsetWidth - WIDTH__MINUS,
		duration: 1,
		ease: 'power3.out',
	});

	changeResume(slides[0]);

	function goTo(index, direction = 1) {
		const now = performance.now();

		if (now - lastAction < COOLDOWN || isAnimating) return;

		lastAction = now;

		const prev = current;

		// Cálculo do índice com loop infinito
		current = ((index % total) + total) % total;

		if (current === prev) return;

		isAnimating = true;

		const inSlide = slides[current]; // Slide que entra
		const outSlide = slides[prev]; // Slide que sai
		const inText = texts[current]; // Texto que entra
		const outText = texts[prev]; // Texto que sai

		changeResume(inSlide);

		// Marca slide ativo
		slides.forEach((s, i) =>
			s.setAttribute('data-active', i === current ? 'true' : 'false')
		);

		// ---- ANIMAÇÃO COM GSAP TIMELINE ----

		const tl = gsap.timeline({
			onComplete: () => {
				isAnimating = false;

				// Reseta a posição Y dos slides após animação
				gsap.set([inSlide, outSlide], { y: 0 });
			},
		});

		// Calcula deslocamento Y baseado na direção
		const slideDistance = 100; // Pixels de movimento vertical

		// Posiciona slide abaixo/acima antes de entrar
		gsap.set(inSlide, {
			autoAlpha: 0,
		});

		tl.to(
			inSlide,
			{
				autoAlpha: 1, // Fade in
				duration: ANIMATION_DURATION,
				ease: 'power2.out',
			},
			0
		);

		// ---- ANIMAÇÃO DO SLIDE SAINDO ----

		tl.to(
			outSlide,
			{
				autoAlpha: 0, // Fade out
				duration: ANIMATION_DURATION,
				ease: 'power2.in',
			},
			0
		);

		// ---- ANIMAÇÃO DO TEXTO ENTRANDO ----

		// Reseta posição do texto antes de animar
		gsap.set(inText, {
			x: -100, // Começa fora da tela à esquerda
			y: -20, // Pequeno deslocamento vertical
			autoAlpha: 0,
			scale: 0.9, // Começa menor
		});

		tl.to(
			inText,
			{
				x: inSlide.offsetWidth - WIDTH__MINUS, // Move para posição final
				y: 0, // Centraliza verticalmente
				autoAlpha: 0.8, // Fade in
				scale: 1, // Escala normal
				duration: ANIMATION_DURATION * 0.8,
				ease: 'back.out(1.4)', // Easing com bounce
			},
			0.3
		);

		// ---- ANIMAÇÃO DO TEXTO SAINDO ----

		tl.to(
			outText,
			{
				x: outSlide.offsetWidth, // Move para fora à direita
				y: 20, // Pequeno deslocamento vertical
				autoAlpha: 0, // Fade out
				scale: 0.9, // Diminui
				duration: ANIMATION_DURATION * 0.6,
				ease: 'power2.in',
			},
			0
		); // Começa junto com slide

		if (status) {
			status.textContent = `Imagem ${current + 1} de ${total}`;
		}
	}

	function changeResume(inSlide) {
		const tomatometer = inSlide.getAttribute('data-tomatometer');
		console.log(tomatometer);
		const obs = inSlide.getAttribute('data-obs');

		const inSlideImg = inSlide.lastElementChild.getAttribute('src');
		const resume = document.querySelector('.resume img');
		const resumeText = document.querySelector('.resume p');
		const resumeAlt = document.querySelector('.resume span');

		// Gera número aleatório de estrelas (1-5)
		// const maxRepetitions = '5';
		// const randomRepetitions = Math.floor(Math.random() * maxRepetitions) + 1;

		resume.setAttribute('src', inSlideImg);

		const text = '✩';
		resumeText.innerHTML = text.repeat(tomatometer);
		resumeAlt.innerHTML = obs;
	}

	/* scroll do mouse/trackpad*/
	function onWheel(e) {
		const delta = e.deltaY;

		if (Math.abs(delta) < WHEEL_THRESHOLD) return;

		e.preventDefault();

		if (delta > 0) {
			goTo(current + 1, 1); // Scroll down = próximo
		} else {
			goTo(current - 1, -1); // Scroll up = anterior
		}
	}

	function onTouchStart(e) {
		const touch = e.touches && e.touches[0];
		if (touch) {
			touchStartY = touch.clientY;
		}
	}

	/* movimento do touch */
	function onTouchMove(e) {
		if (touchStartY === null) return;

		const touch = e.touches && e.touches[0];
		if (!touch) return;

		const dy = touchStartY - touch.clientY;

		if (Math.abs(dy) > TOUCH_THRESHOLD) {
			if (dy > 0) {
				goTo(current + 1, 1); // Swipe up = próximo
			} else {
				goTo(current - 1, -1); // Swipe down = anterior
			}

			touchStartY = null;
		}
	}

	/**
	 * Handler para fim do touch
	 */
	function onTouchEnd() {
		touchStartY = null;
	}

	/*navegação por teclado*/
	function onKey(e) {
		if (e.key === 'ArrowDown' || e.key === 'PageDown') {
			goTo(current + 1, 1);
		}

		if (e.key === 'ArrowUp' || e.key === 'PageUp') {
			goTo(current - 1, -1);
		}
	}
});
