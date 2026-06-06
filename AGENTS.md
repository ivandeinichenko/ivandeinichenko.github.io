# AGENTS.md

База знаний по проекту для AI-ассистентов.

## ⚠️ Правила общения

- **Общайся с пользователем (Иван) ТОЛЬКО на русском языке.** Весь текст
  ответов, объяснения, вопросы и комментарии — на русском. Код, имена
  переменных, коммиты и содержимое сайта остаются на английском (сайт
  англоязычный).

## О проекте

Персональный сайт-портфолио Ивана Дейниченко (Senior Frontend Engineer),
хостится на **GitHub Pages**. Статический одностраничник на **vanilla
HTML/CSS/JS** без рантайм-зависимостей, собирается через **Vite 8**.

- Репозиторий: https://github.com/ivandeinichenko/cv-github-pages
- Прод-URL: https://ivandeinichenko.github.io/
- Язык контента сайта: английский.

## Стек и инструменты

- **Vite 8** — сборка, минификация (terser), code-splitting, dev-сервер.
- **ESLint 9 + Prettier** — линтинг и форматирование.
- Чистый ES6+ JavaScript (ES-модули), без фреймворков.
- Google Fonts (Inter, JetBrains Mono), Google Analytics (gtag).

## Структура

```
index.html            — вся разметка одностраничника (single source of truth контента)
css/
  main.css            — базовые стили, сетки, компоненты
  themes.css          — переменные тем (light/dark через [data-theme])
  animations.css      — keyframes и анимации
  responsive.css      — медиа-запросы и print-стили
js/
  main.js             — навигация, smooth-scroll, счётчики, scroll-reveal, back-to-top
  theme-switcher.js   — переключение тёмной/светлой темы + анти-flash
  particles.js        — интерактивный canvas-фон с частицами
  animations.js
  utils/logger.js     — обёртка над console (управляется VITE_ENABLE_LOGS)
assets/               — favicon, PDF (CV и Resume)
docs/                 — гайды (деплой, GitHub Pages, env-переменные)
.claude/launch.json   — конфиг dev-сервера для preview (npm run dev, порт 3000)
robots.txt, sitemap.xml
```

## Команды

```bash
npm run dev           # dev-сервер на http://localhost:3000
npm run build         # прод-сборка в dist/
npm run preview       # предпросмотр сборки (порт 4173)
npm run lint          # ESLint с --fix по js/*.js
npm run format        # Prettier для js/**/*.js и css/**/*.css
npm run format:check  # проверка форматирования без записи
```

## Секции сайта (порядок в index.html)

Hero (частицы) → About (анимированные счётчики) → Skills (прогресс-бары) →
Experience (таймлайн мест работы) → Achievements (метрики) → Contact →
Footer.

## Ключевые паттерны (важно при правках)

- **Skills**: каждая категория — блок `.skill-category` с `.category-header`
  (Feather-style SVG-иконка + `<h3>`) и списком `.skill-item` с
  `.skill-bar > .skill-progress[data-progress="NN"]`. Значение `data-progress`
  читается дженерик-обработчиком `initSkillBars()` в `js/main.js` — новые
  навыки не требуют изменений JS. Сетка `.skills-grid` адаптивная: на широком
  экране `repeat(4, 1fr)`, на планшете `repeat(2, 1fr)`. Держи количество
  карточек кратным/балансным (сейчас 4), иначе появляется пустая ячейка.
- **Темы**: переключаются через атрибут `data-theme="dark"` на `<html>`,
  сохраняются в localStorage (`preferred-theme`), реагируют на системную тему;
  есть анти-flash IIFE в `theme-switcher.js`. Цвета частиц подстраиваются под
  тему в `particles.js`.
- **Анимации**: появление по скроллу через IntersectionObserver (классы
  `.fade-in-up` → `.visible`). Частицы отключаются при `prefers-reduced-motion`
  и при скрытии вкладки.
- **Иконки**: Feather Icons (инлайновые SVG, `stroke="currentColor"`).

## Известные мелочи / возможные доработки

- Имена PDF в `assets/pdf/` (`..._Senior_Frontend_Developer.pdf`) могут не
  совпадать со ссылками на скачивание в `index.html`
  (`..._Senior_Frontend_Engineer.pdf`) — проверять при правках ссылок на CV.
- В блоке Experience у компании **Noveo** ранее дублировался последний пункт
  списка достижений — проверить при редактировании.

## Деплой

GitHub Pages из ветки `main`. Подробности — в `docs/` (DEPLOYMENT.md,
GITHUB_PAGES_SETUP.md, BUILD_SETUP.md, ENVIRONMENT_VARIABLES.md).
