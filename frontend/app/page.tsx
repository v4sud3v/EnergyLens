"use client";

import React from "react";
import InfoTooltip from "./components/InfoTooltip";

export default function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
      <h1 style={{ color: '#66fcf1', fontSize: '2.5rem', marginBottom: '16px' }}>
        Welcome to EnergyLens
        <InfoTooltip text="EnergyLens is a next-generation power grid monitoring console. Use the navigation sidebar to explore real-time telemetry, forecasts, and AI diagnostics." />
      </h1>
      <p style={{ color: '#c5c6c7', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '32px' }}>
        You are currently viewing the central operator console. From here, you can navigate to specialized dashboards to monitor substation health, predict demand spikes, and converse with the diagnostic AI.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <DashboardCard 
          title="Live Metrics" 
          desc="Dual-axis real-time telemetry for Power and Voltage." 
          link="/metrics" 
        />
        <DashboardCard 
          title="System Status" 
          desc="Anomaly trackers, state lights, and incident logs." 
          link="/status" 
        />
        <DashboardCard 
          title="Timeline Forecast" 
          desc="48-hour historical and 24-hour predictive demand modeling." 
          link="/forecast" 
        />
        <DashboardCard 
          title="AI Console" 
          desc="Direct natural language interface to the diagnostic backend." 
          link="/chat" 
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, desc, link }: { title: string, desc: string, link: string }) {
  return (
    <a href={link} style={{ textDecoration: 'none' }}>
      <div style={{
        backgroundColor: '#12161c',
        border: '1px solid #1f2833',
        borderRadius: '8px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = '#45a29e';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(69, 162, 158, 0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = '#1f2833';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        <h3 style={{ margin: '0 0 8px 0', color: '#c5c6c7' }}>{title}</h3>
        <p style={{ margin: 0, color: '#8a8d91', fontSize: '0.9rem' }}>{desc}</p>
      </div>
    </a>
  );
}
