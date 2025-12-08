'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
// import StatsChart from '@/components/StatsChart'; // Временно отключено - требуется установка recharts
import BackButton from '@/components/BackButton';
import styles from './page.module.css';

export default function DashboardPage() {

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
        <Button variant="primary" onClick={() => {}}>
          Линейный график
        </Button>
        <Button variant="secondary" onClick={() => {}}>
          Столбчатая диаграмма
        </Button>
        <Button variant="secondary" onClick={() => {}}>
          Круговая диаграмма
        </Button>
      </div>
    </div>
  );
}

