"use client";

import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside style={{
      width: '250px',
      backgroundColor: '#12161c',
      borderRight: '1px solid #1f2833',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      zIndex: 20
    }}>
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <h2 style={{ color: '#66fcf1', fontSize: '1.25rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          EnergyLens
        </h2>
        <p style={{ color: '#8a8d91', fontSize: '0.8rem', margin: '4px 0 0 0' }}>Operator Console v1.0</p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={navItemStyle}>Home</div>
        </Link>
        <Link href="/metrics" style={{ textDecoration: 'none' }}>
          <div style={navItemStyle}>Live Metrics</div>
        </Link>
        <Link href="/status" style={{ textDecoration: 'none' }}>
          <div style={navItemStyle}>System Status</div>
        </Link>
        <Link href="/forecast" style={{ textDecoration: 'none' }}>
          <div style={navItemStyle}>Forecast</div>
        </Link>
        <Link href="/chat" style={{ textDecoration: 'none' }}>
          <div style={navItemStyle}>AI Console</div>
        </Link>
      </nav>
    </aside>
  );
}

const navItemStyle = {
  padding: '12px 16px',
  borderRadius: '6px',
  color: '#c5c6c7',
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: 'background-color 0.2s ease, color 0.2s ease',
  cursor: 'pointer'
};
