# Установка UI библиотек

## Шаг 1: Установите зависимости

```bash
cd next_app
npm install recharts
npm install -D tailwindcss postcss autoprefixer
```

## Шаг 2: Инициализируйте Tailwind (если еще не сделано)

```bash
npx tailwindcss init -p
```

## Шаг 3: Готово!

Все компоненты уже созданы и готовы к использованию:
- `/dashboard` - страница с примерами графиков
- `components/ui/Card.tsx` - компонент карточки
- `components/ui/Button.tsx` - компонент кнопки
- `components/StatsChart.tsx` - компонент графиков

## Использование

Откройте страницу `/dashboard` чтобы увидеть примеры:
- Линейные графики
- Столбчатые диаграммы
- Круговые диаграммы
- UI компоненты (Card, Button)

## Дополнительно: shadcn/ui

Если хотите использовать shadcn/ui:

```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog
```

