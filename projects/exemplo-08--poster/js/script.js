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
const SHADOW_GREY = '#292b2a'; // dark-gray da paleta
const PREVIEW_BG = '#e8e4df';

/**
 * Mostra toast de notificação
 * @param {string} text - Texto da notificação
 * @param {string} type - Tipo: 'success', 'error', 'warning'
 */
function showToast(text, type = 'success') {
	const colors = {
		success: 'linear-gradient(to right, #00b09b, #96c93d)',
		error: 'linear-gradient(to right, #ff5f6d, #ffc371)',
		warning: 'linear-gradient(to right, #ff9a9e, #fecfef)',
	};

	Toastify({
		text,
		duration: type === 'error' ? 4000 : 3000,
		backgroundColor: colors[type],
		stopOnFocus: true,
	}).showToast();
}

/**
 * Coleta dados do formulário
 * @returns {Object} Dados do formulário
 */
function getFormData() {
	return {
		title: elements.title.value.trim(),
		year: elements.year.value.trim(),
		nativeTitle: elements.nativeTitle.value.trim(),
		genre: elements.genre.value.trim(),
		directedBy: elements.directedBy.value.trim(),
		writtenBy: elements.writtenBy.value.trim(),
		starring: [
			elements.starring1.value.trim(),
			elements.starring2.value.trim(),
		].filter((s) => s),
	};
}

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
 * Atualiza o preview com dados do formulário
 * @param {Object} data - Dados do formulário
 */
function updatePreview(data) {
	elements.posterPreview.src = uploadedImage;
	elements.previewTitle.textContent = data.title.toUpperCase();
	elements.previewYear.textContent = data.year;
	elements.previewNative.textContent = data.nativeTitle;
	elements.previewGenre.textContent = data.genre.toUpperCase();
	elements.previewDirector.textContent = data.directedBy.toUpperCase();
	elements.previewWriter.textContent = data.writtenBy.toUpperCase();
	elements.previewStarring.innerHTML = data.starring
		.map((s) => s.toUpperCase())
		.join('<br>');

	// Mostrar/ocultar linhas baseado nos valores preenchidos
	elements.nativeRow.style.display = data.nativeTitle ? 'block' : 'none';
	elements.genreRow.style.display = data.genre ? 'block' : 'none';
	elements.directorRow.style.display = data.directedBy ? 'block' : 'none';
	elements.writerRow.style.display = data.writtenBy ? 'block' : 'none';
	elements.starringRow.style.display =
		data.starring.length > 0 ? 'block' : 'none';
}

/**
 * Gera o preview do pôster baseado nos dados do formulário
 */
function generatePoster() {
	const data = getFormData();

	// Validação básica
	if (!data.title || !uploadedImage) {
		showToast(
			'⚠️ Por favor, preencha pelo menos o título e adicione uma imagem!',
			'warning'
		);
		return;
	}

	// Validação do ano: deve ter exatamente 4 dígitos
	if (data.year && (data.year.length !== 4 || !/^\d{4}$/.test(data.year))) {
		showToast('⚠️ O ano deve ter exatamente 4 dígitos!', 'warning');
		return;
	}

	// Atualizar preview: ocultar placeholder e mostrar conteúdo
	elements.placeholder.classList.add('u-hidden');
	elements.posterContent.classList.remove('u-hidden');
	elements.downloadBtn.classList.remove('u-hidden');

	updatePreview(data);
}

/**
 * Desenha informações no canvas
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
 * @param {Object} data - Dados do formulário
 * @param {number} leftMargin - Margem esquerda
 * @param {number} rightMargin - Margem direita
 * @param {number} rowSpacing - Espaçamento entre linhas
 * @param {number} yPos - Posição Y atual
 * @returns {number} Nova posição Y
 */
function drawPosterInfo(ctx, data, leftMargin, rightMargin, rowSpacing, yPos) {
	const labelFont = 'italic 12px Arial, sans-serif';
	const valueFont = '400 14px Arial, sans-serif';

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

	drawInfo('native title', data.nativeTitle);
	drawInfo('genre', data.genre);
	drawInfo('directed by', data.directedBy);
	drawInfo('written by', data.writtenBy);

	// Starring (Elenco) - Tratamento especial para várias linhas
	if (data.starring.length > 0) {
		yPos += rowSpacing;
		ctx.font = labelFont;
		ctx.fillText('starring', leftMargin, yPos);
		yPos += 14;
		ctx.font = valueFont;

		data.starring.forEach((actor) => {
			ctx.fillText(actor.toUpperCase(), leftMargin, yPos);
			yPos += 18;
		});
	}

	return yPos;
}

/**
 * Gera e baixa o pôster como imagem PNG usando Canvas
 */
function downloadPoster() {
	const data = getFormData();
	const canvas = elements.posterCanvas;
	const ctx = canvas.getContext('2d');

	// Dimensões do pôster
	const posterWidth = 500;
	const posterHeight = 700; // Altura total fixa do pôster
	const padding = 40;

	// Imagem ocupa exatamente 60% da altura total
	const imageHeight = posterHeight * 0.6;
	const imageWidth = imageHeight / 1.4; // Mantém proporção 1:1.4

	canvas.width = posterWidth;
	canvas.height = posterHeight;

	// Fundo bege da Polaroid
	ctx.fillStyle = PREVIEW_BG;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const img = new Image();
	img.crossOrigin = 'anonymous';

	img.onload = function () {
		ctx.drawImage(img, padding, padding, imageWidth, imageHeight);

		let yPos = padding + imageHeight + 40;
		ctx.fillStyle = SHADOW_GREY;
		const leftMargin = padding;
		const rightMargin = posterWidth - padding;

		// Desenhar título e ano
		ctx.font = '900 40px Impact, Arial Black, sans-serif';
		ctx.textAlign = 'left';

		const titleText = data.title.toUpperCase();
		const titleMaxWidth = rightMargin - leftMargin - 90;
		const wrappedTitle = wrapText(ctx, titleText, titleMaxWidth);

		wrappedTitle.forEach((line, index) => {
			ctx.fillText(line, leftMargin, yPos + index * 20);
		});

		if (data.year) {
			ctx.font = '300 30px Arial, sans-serif';
			ctx.textAlign = 'right';
			ctx.fillText(data.year, rightMargin, yPos);
		}

		yPos += wrappedTitle.length * 15;
		ctx.textAlign = 'left';

		// Desenhar informações com espaçamento otimizado
		yPos = drawPosterInfo(ctx, data, leftMargin, rightMargin, 18, yPos);

		// Download
		try {
			const link = document.createElement('a');
			link.download = `polaroid-${data.title
				.replace(/\s+/g, '-')
				.toLowerCase()
				.substring(0, 30)}.png`;
			link.href = canvas.toDataURL('image/png');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			showToast('✅ Pôster baixado com sucesso!');
		} catch (error) {
			console.error('Erro ao baixar:', error);
			showToast(
				'❌ Erro ao gerar o download. Verifique se a imagem foi carregada corretamente.',
				'error'
			);
		}
	};

	img.onerror = function () {
		showToast('❌ Erro ao carregar a imagem. Verifique o arquivo.', 'error');
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
