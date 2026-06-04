"use client";

import React from 'react';
import LiveMetricsGraph from '../components/LiveMetricsGraph';
import { useNodeContext } from '../context/NodeContext';
import InfoTooltip from '../components/InfoTooltip';

export default function MetricsPage() {
  const { activeNode } = useNodeContext();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#66fcf1', fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
        Live Metrics
        <InfoTooltip text="This dual-axis chart continuously maps Active Power (left axis, MW) and Line Voltage (right axis, kV). A sliding window shows the last 20 seconds of real-time telemetry." />
      </h1>
      <p style={{ color: '#8a8d91', marginBottom: '24px' }}>Monitoring {activeNode}</p>
      
      <LiveMetricsGraph activeNode={activeNode} />
    </div>
  );
}
