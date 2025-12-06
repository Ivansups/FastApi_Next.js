'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
// import StatsChart from '@/components/StatsChart'; // Временно отключено - требуется установка recharts
import BackButton from '@/components/BackButton';
import styles from './page.module.css';

// Пример данных для графиков
const lineData = [
  { name: 'Янв', value: 400, users: 240 },
  { name: 'Фев', value: 300, users: 139 },
  { name: 'Мар', value: 500, users: 280 },
  { name: 'Апр', value: 278, users: 190 },
  { name: 'Май', value: 189, users: 320 },
  { name: 'Июн', value: 239, users: 280 },
];

const barData = [
  { name: 'Пн', value: 65 },
  { name: 'Вт', value: 59 },
  { name: 'Ср', value: 80 },
  { name: 'Чт', value: 81 },
  { name: 'Пт', value: 56 },
  { name: 'Сб', value: 55 },
  { name: 'Вс', value: 40 },
];

const pieData = [
  { name: 'Категория A', value: 400 },
  { name: 'Категория B', value: 300 },
  { name: 'Категория C', value: 200 },
  { name: 'Категория D', value: 100 },
];

export default function DashboardPage() {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');

  return (
    <div className={styles.dashboard}>
      <BackButton href="/me" />
      
      <div className={styles.header}>
        <h1 className={styles.title}>Дашборд</h1>
        <p className={styles.subtitle}>Визуализация данных и статистика</p>
      </div>

      <div className={styles.statsGrid}>
        <Card>
          <CardHeader>
            <CardTitle>Общая статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Всего пользователей</span>
              <span className={styles.statValue}>1,234</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Активных сегодня</span>
              <span className={styles.statValue}>567</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Конверсия</span>
              <span className={styles.statValue}>45.8%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Динамика продаж</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--purple-light)' }}>
              <p>Для отображения графиков установите recharts:</p>
              <code style={{ display: 'block', marginTop: '1rem', padding: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                npm install recharts
              </code>
            </div>
            {/* <StatsChart data={lineData} type="line" dataKey="value" /> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Активность по дням</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--purple-light)' }}>
              <p>График будет отображаться после установки recharts</p>
            </div>
            {/* <StatsChart data={barData} type="bar" dataKey="value" /> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Распределение</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--purple-light)' }}>
              <p>График будет отображаться после установки recharts</p>
            </div>
            {/* <StatsChart data={pieData} type="pie" dataKey="value" /> */}
          </CardContent>
        </Card>
      </div>

      <div className={styles.actions}>
        <Button variant="primary" onClick={() => setChartType('line')}>
          Линейный график
        </Button>
        <Button variant="secondary" onClick={() => setChartType('bar')}>
          Столбчатая диаграмма
        </Button>
        <Button variant="secondary" onClick={() => setChartType('pie')}>
          Круговая диаграмма
        </Button>
      </div>
    </div>
  );
}

