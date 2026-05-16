import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { ShoppingCart, Trash2, Plus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  identification: string;
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export function NewSalePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [pRes, cRes] = await Promise.all([
        api.get('/productos'),
        api.get('/clientes')
      ]);
      setProducts(pRes.data);
      setClients(cRes.data);
    };
    fetchData();
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return alert('No hay más stock');
      setCart(cart.map(item => 
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      if (product.stock <= 0) return alert('Producto agotado');
      setCart([...cart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmit = async () => {
    if (!selectedClientId) return alert('Selecciona un cliente');
    if (cart.length === 0) return alert('Agrega productos a la venta');

    setLoading(true);
    try {
      await api.post('/ventas', {
        clientId: parseInt(selectedClientId),
        items: cart.map(item => ({ productId: item.productId, quantity: item.quantity }))
      });
      alert('Venta realizada con éxito');
      navigate('/ventas');
    } catch (error: any) {
      alert('Error: ' + error.response?.data?.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', height: 'calc(100vh - 120px)' }}>
      {/* Columna Izquierda: Selección de Productos */}
      <div style={{ overflowY: 'auto', paddingRight: '12px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px', color: 'var(--color-primary)', textShadow: '0 0 8px var(--color-primary)' }}>
          Seleccionar Productos
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {products.map(prod => (
            <div 
              key={prod.id} 
              style={{ 
                background: 'var(--color-surface)', 
                padding: '16px', 
                borderRadius: '12px', 
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>{prod.name}</h4>
                <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-success)' }}>${Number(prod.price).toFixed(2)}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Stock: {prod.stock}</p>
              </div>
              <Button 
                variant="ghost" 
                style={{ marginTop: '12px', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}
                onClick={() => addToCart(prod)}
                disabled={prod.stock <= 0}
              >
                <Plus size={16} /> Agregar
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Columna Derecha: Carrito y Cliente */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingCart size={24} color="var(--color-primary)" /> Resumen de Venta
        </h2>

        <div className="input-group">
          <label className="input-label">Cliente</label>
          <select 
            className="input-field" 
            value={selectedClientId} 
            onChange={(e) => setSelectedClientId(e.target.value)}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            <option value="">-- Seleccionar Cliente --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.identification})</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>Producto</th>
                <th style={{ padding: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>Cant.</th>
                <th style={{ padding: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>Total</th>
                <th style={{ padding: '8px' }}></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.productId} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '12px 8px', fontSize: '14px' }}>{item.name}</td>
                  <td style={{ padding: '12px 8px', fontSize: '14px' }}>x{item.quantity}</td>
                  <td style={{ padding: '12px 8px', fontSize: '14px', fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <button onClick={() => removeFromCart(item.productId)} style={{ color: 'var(--color-danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {cart.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                    Carrito vacío
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '18px', fontWeight: 600 }}>Total:</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)', textShadow: '0 0 10px rgba(0, 242, 255, 0.3)' }}>
              ${total.toFixed(2)}
            </span>
          </div>
          <Button 
            fullWidth 
            style={{ height: '50px', fontSize: '16px' }} 
            onClick={handleSubmit}
            disabled={loading}
          >
            <CheckCircle size={20} /> {loading ? 'Procesando...' : 'Confirmar Venta'}
          </Button>
        </div>
      </div>
    </div>
  );
}
