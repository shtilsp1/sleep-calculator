import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import sitemap from 'vite-plugin-sitemap';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    sitemap({
      hostname: 'https://somnivance.ru', // Укажи твой домен
      dynamicRoutes: [
        '/',
        '/sleep',
        '/nap',
        '/phases'
      ],
      changefreq: 'weekly', // Частота обновления страниц
      priority: 0.8 // Приоритет страниц (от 0.0 до 1.0)
    })
  ],
  base: '/',
  build: {
    outDir: 'dist', // Папка для сборки
    assetsDir: 'assets', // Папка для статических ресурсов
    sourcemap: false, // Отключи sourcemap для продакшена
  },
  server: {
    host: '0.0.0.0', // Слушать все интерфейсы
    port: 5169,
    strictPort: true, // Ошибка, если порт занят
    open: true // Автоматически открыть браузер
  },
  logLevel: 'info',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
