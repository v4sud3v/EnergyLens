"use client";

import { useState } from "react";
import styles from "./page.module.css";
import LiveMetricsGraph from "./components/LiveMetricsGraph";

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
          
          <div style={{ padding: "16px", backgroundColor: "#12161c", borderRadius: "8px", border: "1px solid #1f2833" }}>
            <h2 style={{ color: "#c5c6c7", marginBottom: "1rem", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>System Status</h2>
            <p style={{ color: "#8a8d91" }}>Additional visualizations and tracking panels for <strong>{selectedNode}</strong> will be displayed here.</p>
          </div>
        </div>
      </main>
      <aside className={styles.sidebar}>
        {/* Communication sidebar */}
        <h3 style={{ color: "#45a29e", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Comms Feed</h3>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#8a8d91" }}>Awaiting signals from {selectedNode}...</p>
      </aside>
    </div>
  );
}
