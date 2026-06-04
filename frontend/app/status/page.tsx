"use client";

import React from 'react';
import StatusTrackers from '../components/StatusTrackers';
import { useNodeContext } from '../context/NodeContext';
import InfoTooltip from '../components/InfoTooltip';

export default function StatusPage() {
  const { activeNode } = useNodeContext();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#66fcf1', fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
        System Status
        <InfoTooltip text="State lights indicate overall health. The Anomaly Gauge flashes orange if the score exceeds 0.7, automatically adding a timestamped warning to the Incident Log below." />
      </h1>
      <p style={{ color: '#8a8d91', marginBottom: '24px' }}>Monitoring {activeNode}</p>
      
      <StatusTrackers activeNode={activeNode} />
    </div>
  );
}
