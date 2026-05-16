import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, Tags } from 'lucide-react';
import './Sidebar.css';

export function Sidebar() {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/productos', icon: <Package size={20} />, label: 'Productos' },
    { to: '/categorias', icon: <Tags size={20} />, label: 'Categorías' },
    { to: '/clientes', icon: <Users size={20} />, label: 'Clientes' },
    { to: '/ventas', icon: <ShoppingCart size={20} />, label: 'Ventas' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Inventario</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to} 
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
