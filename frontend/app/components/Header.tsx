"use client";

import React from 'react';
import { useNodeContext } from '../context/NodeContext';

export default function Header() {
  const { activeNode, setActiveNode } = useNodeContext();

  return (
    <header style={{
      height: '60px',
      backgroundColor: 'rgba(28, 28, 30, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      zIndex: 100,
      position: 'sticky',
      top: 0
    }}>
      <div>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>
          EnergyLens<span style={{ color: 'var(--accent-blue)', fontWeight: 400 }}>Pro</span>
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label htmlFor="node-selector" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Active Node
        </label>
        <select 
          id="node-selector"
          value={activeNode}
          onChange={(e) => setActiveNode(e.target.value)}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--foreground)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 500,
            outline: 'none',
            cursor: 'pointer',
            WebkitAppearance: 'none',
            appearance: 'none',
            boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          <option value="Substation North" style={{ backgroundColor: '#1c1c1e' }}>Substation North</option>
          <option value="Substation West" style={{ backgroundColor: '#1c1c1e' }}>Substation West</option>
          <option value="Substation East" style={{ backgroundColor: '#1c1c1e' }}>Substation East</option>
        </select>
      </div>
    </header>
  );
}
