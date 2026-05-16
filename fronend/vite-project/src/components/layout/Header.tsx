import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-search"></div>
      <div className="header-user">
        <div className="user-info" style={{ textAlign: 'right' }}>
          <span className="user-name">ucacue</span>
          <span className="user-role">Administrador</span>
        </div>
        <div className="user-avatar">
          <User size={20} />
        </div>
        <button 
          onClick={handleLogout} 
          style={{ 
            marginLeft: '12px', 
            color: 'var(--color-danger)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          <LogOut size={18} /> Salir
        </button>
      </div>
    </header>
  );
}
