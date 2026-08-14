import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1C1917',        // основной текст, линии схем
        'ink-soft': '#57534E', // вторичный текст
        muted: '#8A7F72',      // подписи, мелкий текст
        paper: '#FAF7F2',      // фон страницы
        'paper-2': '#F2EDE4',  // фон карточек и секций
        line: '#DED5C7',       // рамки, разделители
        accent: '#8B4A2B',     // кнопки, ссылки, акценты
        'accent-dark': '#6E3A22',
        alert: '#A63D2F',      // плашка NOT IN FRAME, ошибки
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      maxWidth: {
        content: '1200px',
        prose: '68ch',
      },
      spacing: {
        section: '6rem',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};

export default config;
