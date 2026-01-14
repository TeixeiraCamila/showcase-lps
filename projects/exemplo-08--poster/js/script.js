let uploadedImage = null;

// Constantes de cores do CSS para consistência no Canvas
const SHADOW_GREY = '#292421';
const PREVIEW_BG = '#e8e4df';

document.getElementById('imageUpload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const uploadBtn = document.getElementById('imageUploadBtn');

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      uploadedImage = event.target.result;
      // Melhoria: Feedback visual do arquivo carregado
      uploadBtn.textContent = 'Imagem: ' + file.name.substring(0, 20) + '... (Trocar)';
    };
    reader.readAsDataURL(file);
  } else {
    uploadBtn.textContent = 'Escolher Imagem';
    uploadedImage = null;
  }
});

function generatePoster() {
  const title = document.getElementById('title').value;
  const year = document.getElementById('year').value;
  const nativeTitle = document.getElementById('nativeTitle').value;
  const genre = document.getElementById('genre').value;
  const directedBy = document.getElementById('directedBy').value;
  const writtenBy = document.getElementById('writtenBy').value;
  const starring1 = document.getElementById('starring1').value;
  const starring2 = document.getElementById('starring2').value;
  const starring3 = document.getElementById('starring3').value;

  if (!title || !uploadedImage) {
    alert('⚠️ Por favor, preencha pelo menos o título e adicione uma imagem!');
    return;
  }

  // Montar elenco
  const starring = [starring1, starring2, starring3].filter(s => s.trim() !== '');

  // Atualizar preview
  document.getElementById('placeholder').classList.add('hidden');
  document.getElementById('posterContent').classList.remove('hidden');
  document.getElementById('downloadBtn').classList.remove('hidden');

  document.getElementById('posterPreview').src = uploadedImage;
  document.getElementById('previewTitle').textContent = title.toUpperCase();
  document.getElementById('previewYear').textContent = year;
  document.getElementById('previewNative').textContent = nativeTitle;
  document.getElementById('previewGenre').textContent = genre.toUpperCase();
  document.getElementById('previewDirector').textContent = directedBy.toUpperCase();
  document.getElementById('previewWriter').textContent = writtenBy.toUpperCase();
  document.getElementById('previewStarring').innerHTML = starring.map(s => s.toUpperCase()).join('<br>');

  // Esconder linhas vazias
  document.getElementById('nativeRow').style.display = nativeTitle ? 'block' : 'none';
  document.getElementById('genreRow').style.display = genre ? 'block' : 'none';
  document.getElementById('directorRow').style.display = directedBy ? 'block' : 'none';
  document.getElementById('writerRow').style.display = writtenBy ? 'block' : 'none';
  document.getElementById('starringRow').style.display = starring.length > 0 ? 'block' : 'none';
}

function downloadPoster() {
  const canvas = document.getElementById('posterCanvas');
  const ctx = canvas.getContext('2d');

  // Dimensões
  const posterWidth = 500;
  const padding = 40;
  const imageSize = posterWidth - (padding * 2);

  // Dados do formulário
  const title = document.getElementById('title').value;
  const year = document.getElementById('year').value;
  const nativeTitle = document.getElementById('nativeTitle').value;
  const genre = document.getElementById('genre').value;
  const directedBy = document.getElementById('directedBy').value;
  const writtenBy = document.getElementById('writtenBy').value;
  const starring = [
    document.getElementById('starring1').value,
    document.getElementById('starring2').value,
    document.getElementById('starring3').value
  ].filter(s => s.trim() !== '');

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
      ctx.fillText(line, leftMargin, yPos + (index * 20)); // Espaçamento de 45px entre linhas
    });

    // Desenha o Ano (alinhado com a primeira linha do título)
    if (year) {
      ctx.font = '300 30px Arial, sans-serif';
      ctx.textAlign = 'right';
      // Usa a yPos original
      ctx.fillText(year, rightMargin, yPos);
    }

    // Atualiza yPos para o próximo bloco de texto
    yPos += (wrappedTitle.length * 15);

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
      link.download = 'polaroid-' + title.replace(/\s+/g, '-').toLowerCase().substring(0, 30) + '.png';
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar:', error);
      alert('Erro ao gerar o download. Verifique se a imagem foi carregada corretamente.');
    }
  };

  img.onerror = function () {
    alert('Erro ao carregar a imagem. Verifique o arquivo.');
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
