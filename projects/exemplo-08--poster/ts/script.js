(function () {
    var uploadedImage = null;
    var SHADOW_GREY = '#292421';
    var PREVIEW_BG = '#e8e4df';
    function getElement(id) {
        return document.getElementById(id);
    }
    var imageUploadInput = getElement('imageUpload');
    var uploadBtn = getElement('imageUploadBtn');
    imageUploadInput === null || imageUploadInput === void 0 ? void 0 : imageUploadInput.addEventListener('change', function (e) {
        var _a;
        var target = e.target;
        var file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file && uploadBtn) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var _a;
                if (((_a = event.target) === null || _a === void 0 ? void 0 : _a.result) && typeof event.target.result === 'string') {
                    uploadedImage = event.target.result;
                    uploadBtn.textContent = "Imagem: ".concat(file.name.substring(0, 20), "... (Trocar)");
                }
            };
            reader.readAsDataURL(file);
        }
        else if (uploadBtn) {
            uploadBtn.textContent = 'Escolher Imagem';
            uploadedImage = null;
        }
    });
    function generatePoster() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var title = ((_a = getElement('title')) === null || _a === void 0 ? void 0 : _a.value) || '';
        var year = ((_b = getElement('year')) === null || _b === void 0 ? void 0 : _b.value) || '';
        var nativeTitle = ((_c = getElement('nativeTitle')) === null || _c === void 0 ? void 0 : _c.value) || '';
        var genre = ((_d = getElement('genre')) === null || _d === void 0 ? void 0 : _d.value) || '';
        var directedBy = ((_e = getElement('directedBy')) === null || _e === void 0 ? void 0 : _e.value) || '';
        var writtenBy = ((_f = getElement('writtenBy')) === null || _f === void 0 ? void 0 : _f.value) || '';
        var starring1 = ((_g = getElement('starring1')) === null || _g === void 0 ? void 0 : _g.value) || '';
        var starring2 = ((_h = getElement('starring2')) === null || _h === void 0 ? void 0 : _h.value) || '';
        var starring3 = ((_j = getElement('starring3')) === null || _j === void 0 ? void 0 : _j.value) || '';
        if (!title || !uploadedImage) {
            alert('⚠️ Por favor, preencha pelo menos o título e adicione uma imagem!');
            return;
        }
        var starring = [starring1, starring2, starring3].filter(function (s) { return s.trim() !== ''; });
        var placeholder = getElement('placeholder');
        var posterContent = getElement('posterContent');
        var downloadBtn = getElement('downloadBtn');
        var posterPreview = getElement('posterPreview');
        placeholder === null || placeholder === void 0 ? void 0 : placeholder.classList.add('hidden');
        posterContent === null || posterContent === void 0 ? void 0 : posterContent.classList.remove('hidden');
        downloadBtn === null || downloadBtn === void 0 ? void 0 : downloadBtn.classList.remove('hidden');
        if (posterPreview)
            posterPreview.src = uploadedImage;
        var previewTitle = getElement('previewTitle');
        var previewYear = getElement('previewYear');
        var previewNative = getElement('previewNative');
        var previewGenre = getElement('previewGenre');
        var previewDirector = getElement('previewDirector');
        var previewWriter = getElement('previewWriter');
        var previewStarring = getElement('previewStarring');
        if (previewTitle)
            previewTitle.textContent = title.toUpperCase();
        if (previewYear)
            previewYear.textContent = year;
        if (previewNative)
            previewNative.textContent = nativeTitle;
        if (previewGenre)
            previewGenre.textContent = genre.toUpperCase();
        if (previewDirector)
            previewDirector.textContent = directedBy.toUpperCase();
        if (previewWriter)
            previewWriter.textContent = writtenBy.toUpperCase();
        if (previewStarring)
            previewStarring.innerHTML = starring.map(function (s) { return s.toUpperCase(); }).join('<br>');
        var nativeRow = getElement('nativeRow');
        var genreRow = getElement('genreRow');
        var directorRow = getElement('directorRow');
        var writerRow = getElement('writerRow');
        var starringRow = getElement('starringRow');
        if (nativeRow)
            nativeRow.style.display = nativeTitle ? 'block' : 'none';
        if (genreRow)
            genreRow.style.display = genre ? 'block' : 'none';
        if (directorRow)
            directorRow.style.display = directedBy ? 'block' : 'none';
        if (writerRow)
            writerRow.style.display = writtenBy ? 'block' : 'none';
        if (starringRow)
            starringRow.style.display = starring.length > 0 ? 'block' : 'none';
    }
    function downloadPoster() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var canvas = getElement('posterCanvas');
        if (!canvas)
            return;
        var ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        var posterWidth = 500;
        var padding = 40;
        var imageSize = posterWidth - (padding * 2);
        var title = ((_a = getElement('title')) === null || _a === void 0 ? void 0 : _a.value) || '';
        var year = ((_b = getElement('year')) === null || _b === void 0 ? void 0 : _b.value) || '';
        var nativeTitle = ((_c = getElement('nativeTitle')) === null || _c === void 0 ? void 0 : _c.value) || '';
        var genre = ((_d = getElement('genre')) === null || _d === void 0 ? void 0 : _d.value) || '';
        var directedBy = ((_e = getElement('directedBy')) === null || _e === void 0 ? void 0 : _e.value) || '';
        var writtenBy = ((_f = getElement('writtenBy')) === null || _f === void 0 ? void 0 : _f.value) || '';
        var starring = [
            ((_g = getElement('starring1')) === null || _g === void 0 ? void 0 : _g.value) || '',
            ((_h = getElement('starring2')) === null || _h === void 0 ? void 0 : _h.value) || '',
            ((_j = getElement('starring3')) === null || _j === void 0 ? void 0 : _j.value) || ''
        ].filter(function (s) { return s.trim() !== ''; });
        canvas.width = posterWidth;
        canvas.height = posterWidth + 350;
        ctx.fillStyle = PREVIEW_BG;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            ctx.drawImage(img, padding, padding, imageSize, imageSize);
            var yPos = padding + imageSize + 55;
            ctx.fillStyle = SHADOW_GREY;
            var leftMargin = padding;
            var rightMargin = posterWidth - padding;
            ctx.font = '900 40px Impact, Arial Black, sans-serif';
            ctx.textAlign = 'left';
            var titleText = title.toUpperCase();
            var titleMaxWidth = rightMargin - leftMargin - 90;
            var wrappedTitle = wrapText(ctx, titleText, titleMaxWidth);
            wrappedTitle.forEach(function (line, index) {
                ctx.fillText(line, leftMargin, yPos + (index * 20));
            });
            if (year) {
                ctx.font = '300 30px Arial, sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(year, rightMargin, yPos);
            }
            yPos += (wrappedTitle.length * 15);
            ctx.textAlign = 'left';
            var labelFont = 'italic 12px Arial, sans-serif';
            var valueFont = '400 14px Arial, sans-serif';
            var rowSpacing = 22;
            function drawInfo(label, value) {
                if (value && ctx) { // ✅ Adiciona verificação de ctx
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
                starring.forEach(function (actor) {
                    ctx.fillText(actor.toUpperCase(), leftMargin, yPos);
                    yPos += 18;
                });
            }
            try {
                var link = document.createElement('a');
                link.download = "polaroid-".concat(title.replace(/\s+/g, '-').toLowerCase().substring(0, 30), ".png");
                link.href = canvas.toDataURL('image/png');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            catch (error) {
                console.error('Erro ao baixar:', error);
                alert('Erro ao gerar o download. Verifique se a imagem foi carregada corretamente.');
            }
        };
        img.onerror = function () {
            alert('Erro ao carregar a imagem. Verifique o arquivo.');
        };
        if (uploadedImage) {
            img.src = uploadedImage;
        }
    }
    function wrapText(context, text, maxWidth) {
        var _a, _b;
        var words = text.split(' ');
        var lines = [];
        var currentLine = (_a = words[0]) !== null && _a !== void 0 ? _a : '';
        for (var i = 1; i < words.length; i++) {
            // const word: string = words[i];
            var word = (_b = words[i]) !== null && _b !== void 0 ? _b : '';
            var width = context.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            }
            else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
    // Expor funções globalmente para serem chamadas pelo HTML
    window.generatePoster = generatePoster;
    window.downloadPoster = downloadPoster;
})();
