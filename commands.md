# Запуск сервера FastAPI
```bash
source server/venv/bin/activate
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
```

# Запуск Next.js приложения
```bash
pnpm run dev
```

# Линтинг Python кода (ruff)
```bash
source server/venv/bin/activate
ruff check server/
```

# Автоисправление Python кода (ruff)
```bash
source server/venv/bin/activate
ruff check --fix server/
```

# Линтинг Next.js кода (ESLint)
```bash
cd next_app
pnpm run lint
```

# Автоисправление Next.js кода (ESLint)
```bash
cd next_app
pnpm run lint:fix
```
