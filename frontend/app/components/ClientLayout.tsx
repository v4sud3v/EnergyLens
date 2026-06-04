"use client";

import React from 'react';
import { NodeProvider } from '../context/NodeContext';
import Header from './Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <NodeProvider>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
          {children}
        </main>
      </div>
    </NodeProvider>
  );
}
