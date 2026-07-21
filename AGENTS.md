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

- Репозиторий: https://github.com/ivandeinichenko/ivandeinichenko.github.io
- Прод-URL: https://ivandeinichenko.github.io/
- Язык контента сайта: английский.

## Дизайн-система

Сайт оформлен как **инженерный datasheet** («ID-13»): инженер подан как
production-компонент — номер детали, таблица характеристик, полевые испытания,
рабочий журнал, баркод. Тон сухой, технический, с лёгкой иронией.

Правила, которые нельзя нарушать при правках вёрстки:

- **Один акцентный цвет.** Второй не вводить никогда.
- Все рамки — 1px `var(--line)`. **Ни теней, ни градиентов, ни глассморфизма,
  ни скруглений** (кнопки и карточки строго квадратные).
- Заголовки секций — комментарии в моно: `// SPECIFICATIONS`, `// FIELD TESTS`,
  `// WORK LOG`, `// SIDE PROJECTS`, `// CONTACT`.
- Таблицы: только горизонтальные hairline-разделители, без вертикальных линий
  и без зебры.
- Моушн сдержанный и только на CSS: появление hero (`riseIn`), размерная линия
  (`drawIn`), мигание статуса (`blink`). Ховер меняет только цвет рамки/текста.
- Типографика: **Archivo Black** — только hero-фамилия и «Ready to deploy.»;
  **Archivo** — заголовки карточек; **IBM Plex Mono** — весь структурный текст;
  **Instrument Sans** — только описательные абзацы.
- Голос: английский, терсно, через цифры («SEO 40→100», «6× LCP»), без
  маркетинговых превосходных степеней.
- **Запрещено**: скилл-бары и проценты, эмодзи, частицы, стоковые иконки и
  иллюстрации, фото/аватары, плавающая кнопка «наверх».

Развёрнутая спека — токены, шкала кеглей, сетки, моушн — в
[specs/DESIGN.md](specs/DESIGN.md). Читай её перед правками вёрстки.

## Стек и инструменты

- **Vite 8** — сборка, минификация (terser), dev-сервер.
- **ESLint 9 + Prettier** — линтинг и форматирование.
- Чистый ES6+ JavaScript (ES-модули), без фреймворков.
- Google Fonts (Archivo, Archivo Black, IBM Plex Mono, Instrument Sans),
  Google Analytics 4 (gtag, `G-XL46YXYPDE`).

## Структура

```
index.html            — вся разметка + <head> (SEO, canonical, OG/Twitter,
                        JSON-LD Person, favicon, шрифты, gtag, анти-flash тем)
css/
  themes.css          — цветовые токены; :root = тёмная тема, html[data-theme="light"]
  main.css            — layout и компоненты
  animations.css      — keyframes (riseIn, drawIn, blink) + prefers-reduced-motion
  responsive.css      — единственный брейкпоинт 760px + print-стили
js/
  theme-switcher.js   — состояние темы, системная тема, событие themechange
  main.js             — smooth-scroll, подсветка активного пункта меню
  analytics.js        — GA4-события поверх gtag
  utils/logger.js     — обёртка над console (управляется VITE_ENABLE_LOGS)
public/               — статика, копируется в корень сайта как есть:
  assets/             — favicon.ico, og-image.png (1200×630), pdf/CV_*.pdf
  robots.txt, sitemap.xml
specs/                — документация проекта (в репозитории):
  DEVELOPMENT.md      — установка, команды, структура, деплой, траблшутинг
  DESIGN.md           — полная дизайн-спека
  ENVIRONMENT_VARIABLES.md — VITE_ENABLE_LOGS и логгер
  og-image.html       — исходник og-image.png
docs/                 — личные заметки и черновики, в .gitignore
.claude/launch.json   — конфиг dev-сервера для preview (autoPort включён)
```

⚠️ Статика живёт **только** в `public/` (`publicDir: 'public'`). Каталога `assets/`
в корне репозитория быть не должно — дубли там не попадают в сборку и разъезжаются
с актуальными файлами.

## Команды

```bash
npm run dev           # dev-сервер (порт 3000, при занятости — автопорт)
npm run build         # прод-сборка в dist/
npm run preview       # предпросмотр сборки (порт 4173)
npm run lint          # ESLint с --fix по js/*.js
npm run format        # Prettier для js/**/*.js и css/**/*.css
npm run format:check  # проверка форматирования без записи
```

## Секции сайта (порядок в index.html)

Header (sticky) → Hero → `// SPECIFICATIONS` → `// FIELD TESTS` →
`// WORK LOG` → `// SIDE PROJECTS` → `// CONTACT` → Footer.

## Ключевые паттерны (важно при правках)

- **Темы**: `data-theme="light"` на `<html>`; тёмная — дефолт (`:root`).
  Сохраняется в `localStorage('preferred-theme')`, но **только по явному клику** —
  без сохранённого значения сайт следует `prefers-color-scheme`. Анти-flash —
  инлайновый блокирующий скрипт в `<head>` (deferred-модуль сработал бы слишком
  поздно, поэтому переносить его в JS-файл нельзя).
- **WORK LOG**: каждая строка — `<details class="log-row">`. В свёрнутом виде
  читается как обычная строка таблицы, внутри — булиты достижений и tech-теги
  (ключевые слова для рекрутёров/ATS). Выравнивание колонок держится тем, что
  `grid-template-columns` повторяется в каждом `summary` — при изменении шаблона
  правь его и в `main.css`, и в медиазапросе `responsive.css`.
- **Аналитика**: разметка декларативная. На ссылку вешается
  `data-ga-event="<имя>"`, а все прочие `data-ga-*` атрибуты автоматически
  уезжают в параметры события (`data-ga-method` → `method`). Новые ссылки не
  требуют правок JS. События: `cv_download`, `contact_click`, `outbound_click`,
  `theme_toggle`, `section_view`, `work_log_expand`.
- **`section_view`** использует `rootMargin: '-35% 0px -35% 0px'`, а не процентный
  threshold: секция `#log` выше вьюпорта, и любой threshold > 0 для неё никогда
  не сработает.
- **Старые якоря**: `#about`, `#skills`, `#experience`, `#achievements`,
  `#resources` сохранены как невидимые `.anchor-alias` внутри новых секций —
  не удаляй их, на них могут вести внешние ссылки.
- **Hero**: фамилия в одну строку (`white-space: nowrap`), поэтому нижняя граница
  `clamp()` — 34px, а не 44px из макета: на 320px при 44px текст молча обрезается
  через `.hero{overflow:hidden}`.

## SEO

- `canonical`, Open Graph (+ `og:image` 1200×630), Twitter Card, JSON-LD `Person`
  — всё в `<head>` `index.html`.
- `public/sitemap.xml` содержит один URL (корень). Якорные URL не добавляй —
  Google их отдельно не индексирует.
- При смене og-image: правь `specs/og-image.html`, открой его на вьюпорте 1200×630
  и сними скриншот элемента `.card` в `public/assets/og-image.png`.

## Деплой

**Пуш в `main` публикует сайт** — `.github/workflows/deploy.yml` собирает проект
и выкладывает `dist/` на GitHub Pages. Ручного шага нет, ветки `gh-pages` нет.
Workflow также запускается вручную через Actions → Run workflow.

На репозитории включены правила: подписанные коммиты и изменения через PR.
Пуш напрямую в `main` проходит при наличии права обхода, но печатает нарушения.

Подробности — в [specs/DEVELOPMENT.md](specs/DEVELOPMENT.md).
