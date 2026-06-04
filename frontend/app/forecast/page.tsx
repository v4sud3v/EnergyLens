"use client";

import React from 'react';
import TimelineForecast from '../components/TimelineForecast';
import { useNodeContext } from '../context/NodeContext';
import InfoTooltip from '../components/InfoTooltip';

export default function ForecastPage() {
  const { activeNode } = useNodeContext();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#66fcf1', fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
        Timeline Forecast
        <InfoTooltip text="Visualizes 48 hours of historical actuals against 24 hours of future predictions. Watch for orange dashed spikes indicating predicted grid instability." />
      </h1>
      <p style={{ color: '#8a8d91', marginBottom: '24px' }}>Monitoring {activeNode}</p>
      
      <TimelineForecast activeNode={activeNode} />
    </div>
  );
}
