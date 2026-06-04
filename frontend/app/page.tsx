"use client";

import { useState } from "react";
import styles from "./page.module.css";
import LiveMetricsGraph from "./components/LiveMetricsGraph";
import StatusTrackers from "./components/StatusTrackers";
import TimelineForecast from "./components/TimelineForecast";
import AIChatConsole from "./components/AIChatConsole";

export default function Home() {
  const [selectedNode, setSelectedNode] = useState("Substation North");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          EnergyLens Control Panel
        </div>
        <div className={styles.selectorContainer}>
          <label htmlFor="node-selector" className={styles.selectorLabel}>
            Active Node
          </label>
          <select 
            id="node-selector"
            className={styles.dropdown}
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
          >
            <option value="Substation North">Substation North</option>
            <option value="Substation West">Substation West</option>
            <option value="Substation East">Substation East</option>
          </select>
        </div>
      </header>
      <main className={styles.main}>
        {/* Main tracking area */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          <LiveMetricsGraph activeNode={selectedNode} />
          
          <StatusTrackers activeNode={selectedNode} />
          
          <TimelineForecast activeNode={selectedNode} />
        </div>
      </main>
      <aside className={styles.sidebar}>
        <AIChatConsole activeNode={selectedNode} />
      </aside>
    </div>
  );
}
