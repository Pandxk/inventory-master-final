import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  categoryId: number;
  category: Category;
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/productos'),
        api.get('/categorias')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setCategoryId(product.categoryId.toString());
    } else {
      setEditingId(null);
      setName('');
      setDescription('');
      setPrice('');
      setStock('0');
      if (categories.length > 0) setCategoryId(categories[0].id.toString());
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { 
        name, 
        description, 
        price: parseFloat(price), 
        stock: parseInt(stock), 
        categoryId: parseInt(categoryId) 
      };

      if (editingId) {
        await api.put(`/productos/${editingId}`, data);
      } else {
        await api.post('/productos', data);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      fetchData();
    } catch (error) {
      alert('Error al eliminar producto');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Productos</h1>
        <Button onClick={() => openModal()}>
          <Plus size={18} />
          Nuevo Producto
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Categoría</TableHeader>
            <TableHeader>Precio</TableHeader>
            <TableHeader>Stock</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>No hay productos registrados.</div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.id}</TableCell>
                <TableCell style={{ fontWeight: 500 }}>{prod.name}</TableCell>
                <TableCell>{prod.category?.name || 'N/A'}</TableCell>
                <TableCell>${Number(prod.price).toFixed(2)}</TableCell>
                <TableCell>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '99px', 
                    fontSize: '12px', 
                    fontWeight: 700,
                    backgroundColor: prod.stock > 5 ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 240, 31, 0.2)',
                    color: prod.stock > 5 ? 'var(--color-success)' : 'var(--color-warning)',
                    border: `1px solid ${prod.stock > 5 ? 'var(--color-success)' : 'var(--color-warning)'}`,
                    textShadow: `0 0 5px ${prod.stock > 5 ? 'var(--color-success)' : 'var(--color-warning)'}`
                  }}>
                    {prod.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openModal(prod)} style={{ color: 'var(--color-primary)' }}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(prod.id)} style={{ color: 'var(--color-danger)' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Nombre del producto" value={name} onChange={(e) => setName(e.target.value)} required />
          
          <div className="input-group">
            <label className="input-label">Categoría</label>
            <select 
              className="input-field" 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Precio ($)" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <Input label="Stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
