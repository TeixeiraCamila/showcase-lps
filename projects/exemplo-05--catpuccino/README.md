# 🐱 Catpuccino - Café com Aconchego

Uma experiência retrô-moderna de café para Gen Z Creators em Birigui, São Paulo.

## 📋 Visão Geral do Projeto

**Catpuccino** é um website profissional e responsivo para um café artesanal com identidade visual única. O projeto foi desenvolvido com foco em:

- ✨ Design Earthy Organic (paleta neutra + accent gold)
- 🎨 Duas variações temáticas (Light Mode + Dark Mode)
- 📱 Mobile-first responsivo (Desktop, Tablet, Mobile)
- ⚡ Performance otimizada e experiência de usuário fluida
- 🎭 Animações suaves (fade, parallax, scroll effects)
- 🔍 SEO optimizado com meta tags
- ♿ Acessibilidade em mente

---

## 🗂️ Estrutura do Projeto

```
exemplo-05--catpuccino/
├── index.html              # HTML principal com todas as seções
├── assets/
│   └── images/            # Pasta para imagens futuras
├── css/
│   ├── style-light.css    # Tema claro (Light Mode)
│   └── style-dark.css     # Tema escuro (Dark Mode)
└── js/
    └── script.js           # JavaScript - funcionalidades interativas
```

---

## 🎨 Design & Branding

### Paleta de Cores

**Light Mode:**
- Primary Dark: `#8B7355` (Marrom Café)
- Primary Light: `#D4A574` (Gold Earthy)
- Accent Warm: `#C4956A` (Caramelo)
- Backgrounds: `#FAFAF8` (Off-white)
- Text: `#2A2A2A` (Dark Gray)

**Dark Mode:**
- Primary Dark: `#D4A574` (Gold Earthy - inverted)
- Backgrounds: `#0F0F0F` (Deep Dark)
- Text: `#F5F3F0` (Off-white)

### Tipografia

- **Primary Font:** System Stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto')
- **Secondary Font:** Georgia (serif, para destaque)

---

## 📑 Seções do Website

### 1. **Hero Section**
- Título impactante com mascote 🐱☕
- Subtitle e CTA buttons (Explorar Menu / Reservar)
- Parallax effect no background
- Responsive heights para todos os devices

### 2. **Experience / Concept**
- 4 cards destacando: Café Premium, Aconchego, Espaço Criativo, Mascote
- Highlight box com informações sobre Birigui
- Animações ao hover

### 3. **Menu Section**
- Sistema de abas (Beverages / Snacks / Specials)
- 12 itens do menu com preços
- Filter interativo com JavaScript
- Cards responsivos

### 4. **Mascot + Story**
- Seção dedicada ao mascote Miau
- Características, hobbies, sonhos
- Quote inspirador
- Animação float 🐱

### 5. **Gallery / Space**
- 6 items de galeria (placeholders com gradients)
- Hover overlays informativos
- Grid responsivo

### 6. **Special Highlights**
- 4 cards com destaques: Insta-worthy Drinks, Kit, Comunidade, Eventos
- Icons emoji bem definidos
- Hover effects elegantes

### 7. **Testimonials**
- 4 depoimentos de clientes
- Rating com ⭐
- Autores e suas profissões
- Dark background com cards em destaque

### 8. **Footer / Contact**
- Seções: Sobre, Endereço, Contato, Redes Sociais
- Email: cat.capuccino@gmail.com
- Links sociais (Instagram, TikTok, Twitter, Pinterest)
- Copyright e links legais

---

## ⚙️ Funcionalidades JavaScript

### 1. **Theme Toggle** 🌙☀️
```javascript
- Toggle entre Light Mode e Dark Mode
- Detecta preferência do sistema operacional
- Salva preferência no localStorage
- Carrega stylesheet dinamicamente
```

### 2. **Menu Filter** 📋
```javascript
- Abas ativas com classe .active
- Filtra items por categoria (beverages, snacks, specials)
- Fade animation ao mudar tab
```

### 3. **Mobile Menu** 📱
```javascript
- Hamburger menu para dispositivos pequenos
- Fecha automaticamente ao clicar em link
```

### 4. **Scroll Animations** ✨
```javascript
- Fade-in ao entrar na viewport
- IntersectionObserver API
- Anima: cards, menu items, highlights, testimonials
```

### 5. **Smooth Scroll** 🎯
```javascript
- Links de âncora com scroll suave
- Compensa altura do header sticky
```

### 6. **Parallax Effect** 🌌
```javascript
- Background move com scroll (parallax suave)
- Velocidade: 0.5x do scroll normal
```

### 7. **Active Nav Indicator** 🔗
```javascript
- Destaca link de navegação correspondente à seção visível
- Atualiza ao fazer scroll
```

---

## 📱 Responsividade

### Breakpoints

- **Desktop:** 1200px+ (Layout completo)
- **Tablet:** 769px - 1199px (Grid ajustado, menu adaptado)
- **Mobile:** Até 768px (Versão mobile-first)
- **Small Mobile:** Até 480px (Otimizado para smartphones)

### Recursos Responsivos

✅ Grid auto-fit com minmax  
✅ Font sizes com clamp()  
✅ Flexible padding/margins  
✅ Touch-friendly buttons (50px mínimo)  
✅ Hamburger menu automático  
✅ Images aspect-ratio mantido  

---

## 🎭 Animações

### Keyframes Implementadas

- `slideDownIn` - Header entra do topo
- `parallaxMove` - Hero background move sutilmente
- `fadeInUp` - Conteúdo entra com fade + translação
- `float` - Mascote flutua
- `fadeIn` - Menu items aparecem

### Transitions

- `--transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- `--transition-fast: 0.2s`
- `--transition-slow: 0.5s`

---

## 🔍 SEO & Meta Tags

```html
<!-- Meta Description -->
<meta name="description" content="Catpuccino - A experiência perfeita de café e aconchego em Birigui...">

<!-- Meta Keywords -->
<meta name="keywords" content="café, catpuccino, birigui, restaurante...">

<!-- Open Graph -->
<meta property="og:title" content="Catpuccino - Café com Aconchego">
<meta property="og:type" content="website">

<!-- Theme Color -->
<meta name="theme-color" content="#8B7355">
```

---

## 🚀 Como Usar

### Abrir o Site

1. Abra o arquivo `index.html` em um navegador web
2. O site carrega com a preferência de tema do seu sistema
3. Clique no botão de tema (canto superior direito) para alternar Light/Dark

### Personalizar

#### Cores
Edite as variáveis CSS em `style-light.css` e `style-dark.css`:
```css
:root {
  --primary-dark: #8B7355;
  --accent-gold: #D4A574;
  /* ... */
}
```

#### Conteúdo
Edite o `index.html`:
- Altere textos nas seções
- Adicione/remova items do menu
- Adicione novas imagens em `assets/images/`

#### Menu Items
Adicione novos items:
```html
<div class="menu-item" data-category="beverages">
  <div class="menu-header">
    <h4>Novo Café</h4>
    <span class="price">R$ XX,XX</span>
  </div>
  <p>Descrição do item...</p>
</div>
```

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Grid, Flexbox, Animations, Gradients
- **Vanilla JavaScript** - Sem frameworks/dependências
- **Responsive Design** - Mobile-first approach
- **CSS Variables** - Temas dinâmicos

---

## 📋 Checklist de Implementação

✅ HTML5 semântico com todas as seções  
✅ Light Mode CSS com paleta earthy organic  
✅ Dark Mode CSS com inversão temática  
✅ JavaScript funcional (theme toggle, menu filter, animations)  
✅ Responsividade completa (mobile, tablet, desktop)  
✅ Animações suaves (fade, parallax, scroll effects)  
✅ Sticky navigation header  
✅ Menu filtro interativo  
✅ SEO meta tags  
✅ Acessibilidade (alt text, aria-labels)  
✅ Performance otimizada  
✅ Compatibilidade cross-browser  

---

## 🎯 Próximos Passos (Futuro)

- [ ] Adicionar imagens reais da cafeteria
- [ ] Implementar galeria de fotos funcional
- [ ] Formulário de contato com envio de email
- [ ] Sistema de reservas/booking
- [ ] Integração com redes sociais (feeds)
- [ ] Menu dinâmico com CMS
- [ ] PWA (Progressive Web App)
- [ ] Analytics (Google Analytics)
- [ ] Blog integrado

---

## 📧 Contato

**Email:** cat.capuccino@gmail.com  
**Localização:** Birigui, São Paulo, Brasil

---

## 📄 Licença

Este projeto é propriedade do **Catpuccino**. Todos os direitos reservados © 2024.

---

## 🐱 Feito com ☕ e amor por Miau!

*"Um café bom é como um gato: confortável, reconfortante e sempre te surpreende."*
