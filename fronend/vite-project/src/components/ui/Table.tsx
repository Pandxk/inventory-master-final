import React from 'react';
import './Table.css';

interface TableProps {
  children: React.ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="table-container">
      <table className="table">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: TableProps) {
  return <thead className="table-head">{children}</thead>;
}

export function TableBody({ children }: TableProps) {
  return <tbody className="table-body">{children}</tbody>;
}

export function TableRow({ children }: TableProps) {
  return <tr className="table-row">{children}</tr>;
}

export function TableHeader({ children }: TableProps) {
  return <th className="table-header">{children}</th>;
}

export function TableCell({ children }: TableProps) {
  return <td className="table-cell">{children}</td>;
}
