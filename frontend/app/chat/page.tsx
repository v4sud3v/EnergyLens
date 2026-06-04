"use client";

import React from 'react';
import AIChatConsole from '../components/AIChatConsole';
import { useNodeContext } from '../context/NodeContext';
import InfoTooltip from '../components/InfoTooltip';

export default function ChatPage() {
  const { activeNode } = useNodeContext();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', height: '100%' }}>
      <h1 style={{ color: '#66fcf1', fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
        AI Engineering Console
        <InfoTooltip text="Ask the diagnostic backend questions about current telemetry, anomalies, or historical trends. The AI automatically contextualizes responses based on the Active Node." />
      </h1>
      <p style={{ color: '#8a8d91', marginBottom: '24px' }}>Monitoring {activeNode}</p>
      
      <div style={{ height: 'calc(100vh - 200px)' }}>
        <AIChatConsole activeNode={activeNode} />
      </div>
    </div>
  );
}
