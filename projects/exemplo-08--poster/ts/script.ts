(function (): void {
  let uploadedImage: string | null = null;

  const SHADOW_GREY: string = '#292421';
  const PREVIEW_BG: string = '#e8e4df';

  function getElement<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }

  const imageUploadInput = getElement<HTMLInputElement>('imageUpload');
  const uploadBtn = getElement<HTMLButtonElement>('imageUploadBtn');

  imageUploadInput?.addEventListener('change', function (e: Event): void {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file && uploadBtn) {
      const reader = new FileReader();
      reader.onload = function (event: ProgressEvent<FileReader>): void {
        if (event.target?.result && typeof event.target.result === 'string') {
          uploadedImage = event.target.result;
          uploadBtn.textContent = `Imagem: ${file.name.substring(0, 20)}... (Trocar)`;
        }
      };
      reader.readAsDataURL(file);
    } else if (uploadBtn) {
      uploadBtn.textContent = 'Escolher Imagem';
      uploadedImage = null;
    }
  });

  function generatePoster(): void {
    const title = getElement<HTMLInputElement>('title')?.value || '';
    const year = getElement<HTMLInputElement>('year')?.value || '';
    const nativeTitle = getElement<HTMLInputElement>('nativeTitle')?.value || '';
    const genre = getElement<HTMLInputElement>('genre')?.value || '';
    const directedBy = getElement<HTMLInputElement>('directedBy')?.value || '';
    const writtenBy = getElement<HTMLInputElement>('writtenBy')?.value || '';
    const starring1 = getElement<HTMLInputElement>('starring1')?.value || '';
    const starring2 = getElement<HTMLInputElement>('starring2')?.value || '';
    const starring3 = getElement<HTMLInputElement>('starring3')?.value || '';

    if (!title || !uploadedImage) {
      alert('⚠️ Por favor, preencha pelo menos o título e adicione uma imagem!');
      return;
    }

    const starring: string[] = [starring1, starring2, starring3].filter(s => s.trim() !== '');

    const placeholder = getElement<HTMLDivElement>('placeholder');
    const posterContent = getElement<HTMLDivElement>('posterContent');
    const downloadBtn = getElement<HTMLButtonElement>('downloadBtn');
    const posterPreview = getElement<HTMLImageElement>('posterPreview');

    placeholder?.classList.add('hidden');
    posterContent?.classList.remove('hidden');
    downloadBtn?.classList.remove('hidden');

    if (posterPreview) posterPreview.src = uploadedImage;

    const previewTitle = getElement<HTMLDivElement>('previewTitle');
    const previewYear = getElement<HTMLDivElement>('previewYear');
    const previewNative = getElement<HTMLDivElement>('previewNative');
    const previewGenre = getElement<HTMLDivElement>('previewGenre');
    const previewDirector = getElement<HTMLDivElement>('previewDirector');
    const previewWriter = getElement<HTMLDivElement>('previewWriter');
    const previewStarring = getElement<HTMLDivElement>('previewStarring');

    if (previewTitle) previewTitle.textContent = title.toUpperCase();
    if (previewYear) previewYear.textContent = year;
    if (previewNative) previewNative.textContent = nativeTitle;
    if (previewGenre) previewGenre.textContent = genre.toUpperCase();
    if (previewDirector) previewDirector.textContent = directedBy.toUpperCase();
    if (previewWriter) previewWriter.textContent = writtenBy.toUpperCase();
    if (previewStarring) previewStarring.innerHTML = starring.map(s => s.toUpperCase()).join('<br>');

    const nativeRow = getElement<HTMLDivElement>('nativeRow');
    const genreRow = getElement<HTMLDivElement>('genreRow');
    const directorRow = getElement<HTMLDivElement>('directorRow');
    const writerRow = getElement<HTMLDivElement>('writerRow');
    const starringRow = getElement<HTMLDivElement>('starringRow');

    if (nativeRow) nativeRow.style.display = nativeTitle ? 'block' : 'none';
    if (genreRow) genreRow.style.display = genre ? 'block' : 'none';
    if (directorRow) directorRow.style.display = directedBy ? 'block' : 'none';
    if (writerRow) writerRow.style.display = writtenBy ? 'block' : 'none';
    if (starringRow) starringRow.style.display = starring.length > 0 ? 'block' : 'none';
  }

  function downloadPoster(): void {
    const canvas = getElement<HTMLCanvasElement>('posterCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const posterWidth: number = 500;
    const padding: number = 40;
    const imageSize: number = posterWidth - (padding * 2);

    const title = getElement<HTMLInputElement>('title')?.value || '';
    const year = getElement<HTMLInputElement>('year')?.value || '';
    const nativeTitle = getElement<HTMLInputElement>('nativeTitle')?.value || '';
    const genre = getElement<HTMLInputElement>('genre')?.value || '';
    const directedBy = getElement<HTMLInputElement>('directedBy')?.value || '';
    const writtenBy = getElement<HTMLInputElement>('writtenBy')?.value || '';
    const starring: string[] = [
      getElement<HTMLInputElement>('starring1')?.value || '',
      getElement<HTMLInputElement>('starring2')?.value || '',
      getElement<HTMLInputElement>('starring3')?.value || ''
    ].filter(s => s.trim() !== '');

    canvas.width = posterWidth;
    canvas.height = posterWidth + 350;

    ctx.fillStyle = PREVIEW_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = function (): void {
      ctx.drawImage(img, padding, padding, imageSize, imageSize);

      let yPos: number = padding + imageSize + 55;
      ctx.fillStyle = SHADOW_GREY;
      const leftMargin: number = padding;
      const rightMargin: number = posterWidth - padding;

      ctx.font = '900 40px Impact, Arial Black, sans-serif';
      ctx.textAlign = 'left';

      const titleText: string = title.toUpperCase();
      const titleMaxWidth: number = rightMargin - leftMargin - 90;
      const wrappedTitle: string[] = wrapText(ctx, titleText, titleMaxWidth);

      wrappedTitle.forEach((line: string, index: number): void => {
        ctx.fillText(line, leftMargin, yPos + (index * 20));
      });

      if (year) {
        ctx.font = '300 30px Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(year, rightMargin, yPos);
      }

      yPos += (wrappedTitle.length * 15);
      ctx.textAlign = 'left';

      const labelFont: string = 'italic 12px Arial, sans-serif';
      const valueFont: string = '400 14px Arial, sans-serif';
      const rowSpacing: number = 22;

      function drawInfo(label: string, value: string): void {
        if (value && ctx) {  // ✅ Adiciona verificação de ctx
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

      if (starring.length > 0) {
        yPos += rowSpacing;
        ctx.font = labelFont;
        ctx.fillText('starring', leftMargin, yPos);
        yPos += 14;
        ctx.font = valueFont;

        starring.forEach((actor: string): void => {
          ctx.fillText(actor.toUpperCase(), leftMargin, yPos);
          yPos += 18;
        });
      }

      try {
        const link = document.createElement('a');
        link.download = `polaroid-${title.replace(/\s+/g, '-').toLowerCase().substring(0, 30)}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Erro ao baixar:', error);
        alert('Erro ao gerar o download. Verifique se a imagem foi carregada corretamente.');
      }
    };

    img.onerror = function (): void {
      alert('Erro ao carregar a imagem. Verifique o arquivo.');
    };

    if (uploadedImage) {
      img.src = uploadedImage;
    }
  }

  function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words: string[] = text.split(' ');
    const lines: string[] = [];
    let currentLine: string = words[0] ?? '';

    for (let i = 1; i < words.length; i++) {
      // const word: string = words[i];
      const word: string = words[i] ?? '';
      
      const width: number = context.measureText(currentLine + ' ' + word).width;
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

  // Expor funções globalmente para serem chamadas pelo HTML
  (window as any).generatePoster = generatePoster;
  (window as any).downloadPoster = downloadPoster;
})();