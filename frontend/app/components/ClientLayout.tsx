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
        backgroundColor: '#0b0c10',
        color: '#c5c6c7',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
    </NodeProvider>
  );
}
