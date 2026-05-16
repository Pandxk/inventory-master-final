import React, { useState } from 'react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(circle at center, #111 0%, #000 100%)' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWdith: '400px', 
        padding: '40px', 
        background: 'var(--color-surface)', 
        borderRadius: '16px', 
        border: '1px solid var(--color-primary)',
        boxShadow: '0 0 30px rgba(0, 242, 255, 0.15)',
        margin: '20px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'rgba(0, 242, 255, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px',
            border: '1px solid var(--color-primary)'
          }}>
            <Lock color="var(--color-primary)" size={30} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>Inventory Master</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '8px' }}>Ingresa tus credenciales</p>
        </div>

        <form onSubmit={handleLogin}>
          <Input 
            label="Usuario" 
            placeholder="ucacue" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Contraseña" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <Button 
            fullWidth 
            type="submit" 
            disabled={loading}
            style={{ height: '48px', marginTop: '10px' }}
          >
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </Button>
        </form>
        
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '24px' }}>
          UCACUE &copy; 2026 - Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
