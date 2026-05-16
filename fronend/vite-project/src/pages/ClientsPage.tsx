import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Client {
  id: number;
  identification: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [identification, setIdentification] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clientes');
      setClients(res.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openModal = (client?: Client) => {
    if (client) {
      setEditingId(client.id);
      setIdentification(client.identification);
      setFirstName(client.firstName);
      setLastName(client.lastName);
      setEmail(client.email || '');
      setPhone(client.phone || '');
    } else {
      setEditingId(null);
      setIdentification('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { identification, firstName, lastName, email, phone };
      if (editingId) {
        await api.put(`/clientes/${editingId}`, data);
      } else {
        await api.post('/clientes', data);
      }
      setIsModalOpen(false);
      fetchClients();
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;
    try {
      await api.delete(`/clientes/${id}`);
      fetchClients();
    } catch (error) {
      alert('Error al eliminar cliente: Puede tener ventas asociadas.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Clientes</h1>
        <Button onClick={() => openModal()}>
          <Plus size={18} />
          Nuevo Cliente
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Identificación</TableHeader>
            <TableHeader>Nombres</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Teléfono</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>No hay clientes registrados.</div>
              </TableCell>
            </TableRow>
          ) : (
            clients.map((cli) => (
              <TableRow key={cli.id}>
                <TableCell style={{ fontWeight: 500 }}>{cli.identification}</TableCell>
                <TableCell>{cli.firstName} {cli.lastName}</TableCell>
                <TableCell>{cli.email}</TableCell>
                <TableCell>{cli.phone}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openModal(cli)} style={{ color: 'var(--color-primary)' }}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(cli.id)} style={{ color: 'var(--color-danger)' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Identificación" value={identification} onChange={(e) => setIdentification(e.target.value)} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Nombres" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <Input label="Apellidos" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
