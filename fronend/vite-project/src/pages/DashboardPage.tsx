import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    todaySales: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Dashboard Operativo</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-primary)', boxShadow: '0 0 15px rgba(0, 242, 255, 0.1)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Total Productos</h3>
          <p style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px', color: 'var(--color-primary)', textShadow: '0 0 10px var(--color-primary)' }}>
            {stats.totalProducts}
          </p>
        </div>
        
        <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-warning)', boxShadow: '0 0 15px rgba(255, 240, 31, 0.1)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Stock Bajo</h3>
          <p style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px', color: 'var(--color-warning)', textShadow: '0 0 10px var(--color-warning)' }}>
            {stats.lowStockCount}
          </p>
        </div>
        
        <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-success)', boxShadow: '0 0 15px rgba(57, 255, 20, 0.1)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Ventas Hoy</h3>
          <p style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px', color: 'var(--color-success)', textShadow: '0 0 10px var(--color-success)' }}>
            ${Number(stats.todaySales).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
