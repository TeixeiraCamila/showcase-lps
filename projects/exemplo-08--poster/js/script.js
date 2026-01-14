// Variável global para armazenar a imagem carregada
let uploadedImage = null;

// Cache de elementos DOM para melhor performance
const elements = {
	imageUpload: document.getElementById('imageUpload'),
	imageUploadBtn: document.getElementById('imageUploadBtn'),
	title: document.getElementById('title'),
	year: document.getElementById('year'),
	nativeTitle: document.getElementById('nativeTitle'),
	genre: document.getElementById('genre'),
	directedBy: document.getElementById('directedBy'),
	writtenBy: document.getElementById('writtenBy'),
	starring1: document.getElementById('starring1'),
	starring2: document.getElementById('starring2'),
	starring3: document.getElementById('starring3'),
	placeholder: document.getElementById('placeholder'),
	posterContent: document.getElementById('posterContent'),
	downloadBtn: document.getElementById('downloadBtn'),
	posterPreview: document.getElementById('posterPreview'),
	previewTitle: document.getElementById('previewTitle'),
	previewYear: document.getElementById('previewYear'),
	previewNative: document.getElementById('previewNative'),
	previewGenre: document.getElementById('previewGenre'),
	previewDirector: document.getElementById('previewDirector'),
	previewWriter: document.getElementById('previewWriter'),
	previewStarring: document.getElementById('previewStarring'),
	nativeRow: document.getElementById('nativeRow'),
	genreRow: document.getElementById('genreRow'),
	directorRow: document.getElementById('directorRow'),
	writerRow: document.getElementById('writerRow'),
	starringRow: document.getElementById('starringRow'),
	posterCanvas: document.getElementById('posterCanvas'),
};

// Constantes de cores para consistência no Canvas
const SHADOW_GREY = '#292421';
const PREVIEW_BG = '#e8e4df';

// Event listener para upload de imagem
elements.imageUpload.addEventListener('change', function (e) {
	const file = e.target.files[0];

	if (file) {
		const reader = new FileReader();
		reader.onload = function (event) {
			uploadedImage = event.target.result;
			// Feedback visual do arquivo carregado
			elements.imageUploadBtn.textContent = `Imagem: ${file.name.substring(
				0,
				20
			)}... (Trocar)`;
		};
		reader.readAsDataURL(file);
	} else {
		elements.imageUploadBtn.textContent = 'Escolher Imagem';
		uploadedImage = null;
	}
});

/**
 * Gera o preview do pôster baseado nos dados do formulário
 */
function generatePoster() {
	// Coletar valores do formulário usando elementos cacheados
	const title = elements.title.value;
	const year = elements.year.value;
	const nativeTitle = elements.nativeTitle.value;
	const genre = elements.genre.value;
	const directedBy = elements.directedBy.value;
	const writtenBy = elements.writtenBy.value;
	const starring1 = elements.starring1.value;
	const starring2 = elements.starring2.value;
	const starring3 = elements.starring3.value;

	// Validação básica
	if (!title || !uploadedImage) {
		Toastify({
			text: '⚠️ Por favor, preencha pelo menos o título e adicione uma imagem!',
			duration: 3000,
			backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
			stopOnFocus: true,
		}).showToast();
		return;
	}

	// Montar elenco filtrando valores vazios
	const starring = [starring1, starring2, starring3].filter(
		(s) => s.trim() !== ''
	);

	// Atualizar preview: ocultar placeholder e mostrar conteúdo
	elements.placeholder.classList.add('u-hidden');
	elements.posterContent.classList.remove('u-hidden');
	elements.downloadBtn.classList.remove('u-hidden');

	// Preencher dados no preview
	elements.posterPreview.src = uploadedImage;
	elements.previewTitle.textContent = title.toUpperCase();
	elements.previewYear.textContent = year;
	elements.previewNative.textContent = nativeTitle;
	elements.previewGenre.textContent = genre.toUpperCase();
	elements.previewDirector.textContent = directedBy.toUpperCase();
	elements.previewWriter.textContent = writtenBy.toUpperCase();
	elements.previewStarring.innerHTML = starring
		.map((s) => s.toUpperCase())
		.join('<br>');

	// Esconder linhas vazias baseado nos valores preenchidos
	elements.nativeRow.style.display = nativeTitle ? 'block' : 'none';
	elements.genreRow.style.display = genre ? 'block' : 'none';
	elements.directorRow.style.display = directedBy ? 'block' : 'none';
	elements.writerRow.style.display = writtenBy ? 'block' : 'none';
	elements.starringRow.style.display = starring.length > 0 ? 'block' : 'none';
}

/**
 * Gera e baixa o pôster como imagem PNG usando Canvas
 */
function downloadPoster() {
	const canvas = elements.posterCanvas;
	const ctx = canvas.getContext('2d');

	// Dimensões do pôster
	const posterWidth = 500;
	const padding = 40;
	const imageSize = posterWidth - padding * 2;

	// Coletar dados do formulário usando elementos cacheados
	const title = elements.title.value;
	const year = elements.year.value;
	const nativeTitle = elements.nativeTitle.value;
	const genre = elements.genre.value;
	const directedBy = elements.directedBy.value;
	const writtenBy = elements.writtenBy.value;
	const starring = [
		elements.starring1.value,
		elements.starring2.value,
		elements.starring3.value,
	].filter((s) => s.trim() !== '');

	canvas.width = posterWidth;
	canvas.height = posterWidth + 350;

	// Fundo bege da Polaroid
	ctx.fillStyle = PREVIEW_BG;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const img = new Image();
	img.crossOrigin = 'anonymous'; // Necessário para evitar erro de CORS

	img.onload = function () {
		// Desenhar imagem
		ctx.drawImage(img, padding, padding, imageSize, imageSize);

		// Posição Y inicial para a área de texto
		let yPos = padding + imageSize + 55;
		ctx.fillStyle = SHADOW_GREY;
		const leftMargin = padding;
		const rightMargin = posterWidth - padding;

		// --- 1. TÍTULO e ANO ---

		// Configuração de fonte para o título
		ctx.font = '900 40px Impact, Arial Black, sans-serif';
		ctx.textAlign = 'left';

		const titleText = title.toUpperCase();
		// Largura máxima do título: largura do pôster - 2x margem - espaço do ano
		const titleMaxWidth = rightMargin - leftMargin - 90;
		const wrappedTitle = wrapText(ctx, titleText, titleMaxWidth);

		// Desenha o Título linha por linha
		wrappedTitle.forEach((line, index) => {
			ctx.fillText(line, leftMargin, yPos + index * 20); // Espaçamento de 45px entre linhas
		});

		// Desenha o Ano (alinhado com a primeira linha do título)
		if (year) {
			ctx.font = '300 30px Arial, sans-serif';
			ctx.textAlign = 'right';
			// Usa a yPos original
			ctx.fillText(year, rightMargin, yPos);
		}

		// Atualiza yPos para o próximo bloco de texto
		yPos += wrappedTitle.length * 15;

		// Resetar alinhamento para esquerda para as infos
		ctx.textAlign = 'left';

		// --- 2. INFORMAÇÕES DETALHADAS ---

		// Configurações para labels e valores
		const labelFont = 'italic 12px Arial, sans-serif';
		const valueFont = '400 14px Arial, sans-serif';
		const rowSpacing = 22; // Aumentei o espaçamento para clareza

		// Funções auxiliares para desenhar um bloco de info
		function drawInfo(label, value) {
			if (value) {
				yPos += rowSpacing;
				ctx.font = labelFont;
				ctx.fillText(label, leftMargin, yPos);
				yPos += 14;
				ctx.font = valueFont;
				ctx.fillText(value.toUpperCase(), leftMargin, yPos);
			}
		}

		drawInfo('native title', nativeTitle);
		drawInfo('genre', genre);
		drawInfo('directed by', directedBy);
		drawInfo('written by', writtenBy);

		// Starring (Elenco) - Tratamento especial para várias linhas
		if (starring.length > 0) {
			yPos += rowSpacing;
			ctx.font = labelFont;
			ctx.fillText('starring', leftMargin, yPos);
			yPos += 14;
			ctx.font = valueFont;

			starring.forEach((actor) => {
				ctx.fillText(actor.toUpperCase(), leftMargin, yPos);
				yPos += 18; // Espaçamento entre atores
			});
		}

		// Download
		// O download é acionado diretamente no final do onload, que é mais confiável que setTimeout
		try {
			const link = document.createElement('a');
			// Nome do arquivo baseado no título
			link.download =
				'polaroid-' +
				title.replace(/\s+/g, '-').toLowerCase().substring(0, 30) +
				'.png';
			link.href = canvas.toDataURL('image/png');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Toast de sucesso
			Toastify({
				text: '✅ Pôster baixado com sucesso!',
				duration: 3000,
				backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
				stopOnFocus: true,
			}).showToast();
		} catch (error) {
			console.error('Erro ao baixar:', error);
			Toastify({
				text: '❌ Erro ao gerar o download. Verifique se a imagem foi carregada corretamente.',
				duration: 4000,
				backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
				stopOnFocus: true,
			}).showToast();
		}
	};

	img.onerror = function () {
		Toastify({
			text: '❌ Erro ao carregar a imagem. Verifique o arquivo.',
			duration: 4000,
			backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
			stopOnFocus: true,
		}).showToast();
	};

	img.src = uploadedImage;
}

// Função auxiliar para quebra de linha de texto no canvas
function wrapText(context, text, maxWidth) {
	const words = text.split(' ');
	const lines = [];
	let currentLine = words[0];

	for (let i = 1; i < words.length; i++) {
		const word = words[i];
		const width = context.measureText(currentLine + ' ' + word).width;
		if (width < maxWidth) {
			currentLine += ' ' + word;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}
	lines.push(currentLine);
	return lines;
}
