"use client";

import React from 'react';
import { useNodeContext } from '../context/NodeContext';

export default function Header() {
  const { activeNode, setActiveNode } = useNodeContext();

  return (
    <header style={{
      height: '70px',
      backgroundColor: '#1f2833',
      borderBottom: '1px solid #45a29e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label htmlFor="node-selector" style={{ fontSize: '0.875rem', color: '#c5c6c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Active Node
        </label>
        <select 
          id="node-selector"
          value={activeNode}
          onChange={(e) => setActiveNode(e.target.value)}
          style={{
            backgroundColor: '#0b0c10',
            color: '#66fcf1',
            border: '1px solid #45a29e',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '0.9rem',
            outline: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <option value="Substation North">Substation North</option>
          <option value="Substation West">Substation West</option>
          <option value="Substation East">Substation East</option>
        </select>
      </div>
    </header>
  );
}
