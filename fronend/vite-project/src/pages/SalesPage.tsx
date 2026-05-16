import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { ShoppingCart, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Sale {
  id: number;
  total: number;
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
  };
  details: any[];
}

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const navigate = useNavigate();

  const fetchSales = async () => {
    try {
      const res = await api.get('/ventas');
      setSales(res.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Ventas Realizadas</h1>
        <Button onClick={() => navigate('/ventas/nueva')}>
          <Plus size={18} />
          Nueva Venta
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Fecha</TableHeader>
            <TableHeader>Cliente</TableHeader>
            <TableHeader>Total</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell>
                <div style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>No hay ventas registradas.</div>
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>#{sale.id}</TableCell>
                <TableCell>{new Date(sale.createdAt).toLocaleString()}</TableCell>
                <TableCell style={{ fontWeight: 500 }}>
                  {sale.client ? `${sale.client.firstName} ${sale.client.lastName}` : 'Consumidor Final'}
                </TableCell>
                <TableCell style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                  ${Number(sale.total).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost">
                    <Eye size={18} /> Detalle
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
