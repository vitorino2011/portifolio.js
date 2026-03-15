# Scripts do Portfolio — Documentação JS

**Arquivo:** `app.js`  
**Contexto:** Scripts de interatividade para página de portfólio pessoal

---

## Sumário

1. [Particles](#1-particles)
2. [Cartão 3D Hero](#2-cartão-3d-hero)
3. [Glow nos Skill Cards](#3-glow-nos-skill-cards)
4. [Scroll Reveal](#4-scroll-reveal)
5. [Barra de Progresso e Navbar](#5-barra-de-progresso-e-navbar)
6. [Cursor Glow](#6-cursor-glow)
7. [Nav Links e Menu Mobile](#7-nav-links-e-menu-mobile)
8. [Modal — Story](#8-modal--story)
9. [Modal — Vídeo](#9-modal--vídeo)
10. [Sistema de Likes](#10-sistema-de-likes)
11. [Tablet Code Switcher](#11-tablet-code-switcher)
12. [Tablet Scroll Animation](#12-tablet-scroll-animation)

---

## 1. Particles

Cria 30 partículas flutuantes no fundo da página dinamicamente.

**Elemento alvo:** `#particles`

**O que faz:**
- Gera `<div class="particle">` e os injeta no container
- Cada partícula recebe posição horizontal aleatória (`left`)
- Duração da animação entre `8s` e `20s` (aleatório)
- Delay inicial entre `0s` e `10s` (para não sincronizar)
- Tamanho entre `1px` e `3px` (aleatório)

```js
p.style.animationDuration = (8 + Math.random() * 12) + 's';
```

---

## 2. Cartão 3D Hero

Aplica rotação 3D ao cartão principal da hero section conforme o cursor do mouse.

**Elementos:** `#card3dWrapper`, `#card3d`, `#cardShine`

**O que faz:**
- No `mousemove`, calcula a posição do cursor relativa ao centro do card
- Aplica `rotateX` e `rotateY` com intensidade máxima de `±15°`
- Atualiza as variáveis CSS `--mx` e `--my` no elemento de brilho (para efeito de luz)
- No `mouseleave`, reseta a transformação para `rotateX(0) rotateY(0)`

```js
c.style.transform = `rotateX(${((y - cy) / cy) * -15}deg) rotateY(${((x - cx) / cx) * 15}deg)`;
```

---

## 3. Glow nos Skill Cards

Aplica um efeito de brilho que segue o cursor dentro de cada skill card.

**Elementos:** `.skill-card` (todos)

**O que faz:**
- No `mousemove` de cada card, calcula a posição do cursor em porcentagem (`0%` a `100%`)
- Atualiza as variáveis CSS `--mx` e `--my` diretamente no elemento
- O CSS usa essas variáveis para posicionar um gradiente radial de glow

---

## 4. Scroll Reveal

Anima elementos conforme entram (e saem) da viewport durante o scroll.

**Elementos observados:** `.reveal`, `.reveal-scale`, `.timeline-item`

**O que faz:**
- Usa `IntersectionObserver` com threshold de `15%` e margem inferior de `-50px`
- Ao entrar na viewport: adiciona classe `visible` e anima as `.skill-bar-fill` até o valor de `data-width`
- Ao sair da viewport: remove `visible` e zera as barras de habilidade (animação se repete)

```js
// Exemplo de elemento HTML compatível:
// <div class="reveal">...</div>
// <div class="skill-bar-fill" data-width="85"></div>
```

---

## 5. Barra de Progresso e Navbar

Atualiza a barra de progresso de leitura e o estilo da navbar no scroll.

**Elementos:** `#progressBar`, `#navbar`

**O que faz:**
- Calcula o percentual de scroll: `scrollY / (scrollHeight - innerHeight) * 100`
- Aplica esse valor como `width` na barra de progresso
- Adiciona/remove a classe `scrolled` na navbar quando o scroll passa de `100px`

---

## 6. Cursor Glow

Faz um halo circular seguir o cursor pelo documento.

**Elemento:** `#cursorGlow`

**O que faz:**
- No `mousemove`, posiciona o elemento via `left` e `top` com `opacity: 1`
- No `mouseleave` do documento, define `opacity: 0` para esconder

---

## 7. Nav Links e Menu Mobile

Gerencia a navegação suave e o toggle do menu hambúrguer.

**Elementos:** `.nav-links a`, `#mobileToggle`, `#navLinks`

**O que faz:**
- Clique em links de nav: `scrollIntoView` com `behavior: 'smooth'` + fecha o menu mobile
- Clique no botão hambúrguer: alterna a classe `open` em `#navLinks`
- Após `200ms` da carga: adiciona `visible` nos elementos `.reveal` da hero section (garante a animação inicial)

---

## 8. Modal — Story

Abre e fecha o modal de história/bio.

**Elemento:** `#storyOverlay`

**Funções:**

| Função | Ação |
|--------|------|
| `openStory()` | Exibe o overlay com `display: flex` + adiciona classe `active` via `requestAnimationFrame` |
| `closeStory()` | Remove `active`, espera `400ms` e esconde com `display: none` |

> O `requestAnimationFrame` garante que o browser registre o `display: flex` antes de iniciar a transição CSS.

---

## 9. Modal — Vídeo

Modal com player de vídeo customizado, incluindo controles manuais.

**Elementos principais:** `#videoOverlay`, `#mainVideo`, `#videoPlaceholder`

### Abertura e fechamento

| Função | Ação |
|--------|------|
| `openVideo()` | Exibe o modal de vídeo |
| `closeVideo()` | Fecha o modal e pausa o vídeo se estiver tocando |

### Carregamento de arquivo

```js
function loadVideo(input)
```
- Recebe um `<input type="file">`
- Cria uma URL local com `URL.createObjectURL()` e injeta no `<video>`
- Esconde o placeholder e ativa os listeners de progresso

### Controles do player

| Função | Ação |
|--------|------|
| `togglePlay()` | Alterna entre play/pause e muda o ícone do botão |
| `skipVideo(sec)` | Avança ou retrocede `sec` segundos |
| `seekVideo(e)` | Clique na barra de progresso para ir a um ponto específico |
| `changeSpeed()` | Cicla entre as velocidades `[0.5, 0.75, 1, 1.25, 1.5, 2]` |
| `goFullscreen()` | Entra em tela cheia com fallback para webkit |
| `updateTime()` | Atualiza o texto `currentTime / duration` no formato `M:SS` |

---

## 10. Sistema de Likes

Permite ao usuário curtir/descurtir o conteúdo, com persistência via `localStorage`.

**Elementos:** `#vcLike`, `#likeCount`

**Variáveis de estado:**

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `likes` | `number` | Contagem total de likes |
| `userLiked` | `boolean` | Se o usuário atual já curtiu |

**Chaves no `localStorage`:**

| Chave | Valor |
|-------|-------|
| `jvr_likes` | Número de likes (string) |
| `jvr_user_liked` | `'true'` ou `'false'` |

**Função `toggleLike()`:**
- Se não curtiu: incrementa, adiciona classe `liked`, aplica animação de escala `1.3x`
- Se já curtiu: decrementa e remove `liked`
- Persiste no `localStorage` com try/catch para ambientes que bloqueiam storage

---

## 11. Tablet Code Switcher

Alterna entre diferentes trechos de código exibidos no "tablet" da seção de skills.

**Elementos:** `.tablet-panel`, `.tablet-tab`, `#tabletFileName`

**Mapeamento de arquivo por linguagem:**

| ID | Nome do arquivo exibido |
|----|------------------------|
| `python` | `joao_vitor.py` |
| `cpp` | `arduino_sketch.ino` |
| `html` | `index.html` |
| `css` | `style.css` |
| `js` | `app.js` |
| `git` | `.git/COMMIT_EDITMSG` |

**Função `switchTabletCode(id, btn)`:**
- Remove `active` de todos os painéis e tabs
- Ativa o painel `#tpanel-{id}` e o botão clicado
- Atualiza o nome do arquivo exibido no header do tablet

---

## 12. Tablet Scroll Animation

Anima o tablet com rotação 3D e escala conforme o usuário rola a página.

**Elementos:** `#tabletScrollContainer`, `#tabletAnimHeader`, `#tabletAnimCard`

### Como o progresso é calculado

```js
let progress = (0 - rect.top) / endOffset;
// 0 = container chegou ao topo da viewport
// 1 = scroll chegou ao fim do container
```

### Transformações aplicadas

| Propriedade | Valor inicial | Valor final | Elemento |
|-------------|:-------------:|:-----------:|----------|
| `rotateX` | `22deg` | `0deg` | `#tabletAnimCard` |
| `scale` (mobile) | `0.72` | `0.92` | `#tabletAnimCard` |
| `scale` (desktop) | `1.06` | `1.0` | `#tabletAnimCard` |
| `translateY` | `0px` | `-110px` | `#tabletAnimHeader` |
| `opacity` do header | `0.4` → `1.0` (primeiros 30%) | `1.0` → `0.15` (restante) | `#tabletAnimHeader` |

### Interpolação linear (lerp)

```js
function lerpTablet(start, end, factor) {
  return start + (end - start) * factor;
}
```

> Faz a transição suave entre dois valores conforme o `progress` vai de `0` a `1`.

### Performance

O listener de scroll usa `requestAnimationFrame` com flag `tabletTicking` para evitar múltiplas execuções por frame (técnica de *scroll debounce* com rAF):

```js
window.addEventListener('scroll', () => {
  if (!tabletTicking) {
    window.requestAnimationFrame(() => {
      updateTabletAnimation();
      tabletTicking = false;
    });
    tabletTicking = true;
  }
});
```

O breakpoint mobile/desktop (`768px`) é monitorado via listener de `resize` para recalcular os valores de escala dinamicamente.
