"use client";

import React, { useState } from 'react';

export default function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '8px' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
    >
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: '#45a29e',
        color: '#0b0c10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        cursor: 'help',
        boxShadow: '0 0 5px rgba(69, 162, 158, 0.4)'
      }}>
        ?
      </div>
      {show && (
        <div style={{
          position: 'absolute',
          bottom: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'max-content',
          maxWidth: '250px',
          backgroundColor: '#1f2833',
          border: '1px solid #66fcf1',
          color: '#c5c6c7',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          lineHeight: '1.4',
          zIndex: 100,
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          whiteSpace: 'normal',
          textTransform: 'none',
          letterSpacing: 'normal'
        }}>
          {text}
        </div>
      )}
    </div>
  );
}
