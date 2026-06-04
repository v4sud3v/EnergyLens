"use client";

import React from "react";
import LiveMetricsGraph from "./components/LiveMetricsGraph";
import StatusTrackers from "./components/StatusTrackers";
import TimelineForecast from "./components/TimelineForecast";
import AIChatConsole from "./components/AIChatConsole";
import { useNodeContext } from "./context/NodeContext";

export default function Home() {
  const { activeNode } = useNodeContext();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gridTemplateRows: 'auto auto',
      gap: '24px',
      maxWidth: '1600px',
      margin: '0 auto',
      height: '100%'
    }}>
      {/* Top Left: Live Metrics (Spans 1 col, but 2fr width) */}
      <div style={{ gridColumn: '1 / 2', gridRow: '1 / 2', minWidth: 0 }}>
        <LiveMetricsGraph activeNode={activeNode} />
      </div>

      {/* Top Right: Status Trackers */}
      <div style={{ gridColumn: '2 / 3', gridRow: '1 / 2', minWidth: 0 }}>
        <StatusTrackers activeNode={activeNode} />
      </div>

      {/* Bottom Left: Timeline Forecast */}
      <div style={{ gridColumn: '1 / 2', gridRow: '2 / 3', minWidth: 0 }}>
        <TimelineForecast activeNode={activeNode} />
      </div>

      {/* Bottom Right: AI Chat Console */}
      <div style={{ gridColumn: '2 / 3', gridRow: '2 / 3', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <AIChatConsole activeNode={activeNode} />
      </div>
    </div>
  );
}
