"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from '../page.module.css';
import InfoTooltip from './InfoTooltip';

interface Incident {
  id: string;
  time: string;
  message: string;
  level: 'warning' | 'critical';
}

export default function StatusTrackers({ activeNode }: { activeNode: string }) {
  const [anomalyScore, setAnomalyScore] = useState(0.1);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of incident log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [incidents]);

  // Reset incidents on node change to show loading context
  useEffect(() => {
    setIncidents([{
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour12: false }),
      message: `System initialized for ${activeNode}. Monitoring...`,
      level: 'warning' // Just for coloring it neutral/amber initially
    }]);
    setAnomalyScore(0.1);
  }, [activeNode]);

  useEffect(() => {
    // Simulate anomaly score changes
    const interval = setInterval(() => {
      setAnomalyScore(prev => {
        // Random walk for anomaly score
        let newScore = prev + (Math.random() * 0.4 - 0.15); // Bias slightly towards increasing but can decrease
        
        // Sometimes drop it back down if it's too high to simulate issue resolution
        if (newScore > 0.9 && Math.random() > 0.5) {
            newScore = 0.2;
        }

        // Clamp between 0 and 1
        newScore = Math.max(0, Math.min(1, newScore));
        
        // Generate incident log if it crosses a threshold
        if (newScore >= 0.7 && prev < 0.7) {
            setIncidents(logs => [...logs, {
                id: Date.now().toString(),
                time: new Date().toLocaleTimeString([], { hour12: false }),
                message: `[${activeNode}] Critical anomaly detected! Voltage instability imminent.`,
                level: 'critical'
            }]);
        } else if (newScore >= 0.4 && prev < 0.4) {
            setIncidents(logs => [...logs, {
                id: Date.now().toString(),
                time: new Date().toLocaleTimeString([], { hour12: false }),
                message: `[${activeNode}] Warning: Metrics deviating from baseline.`,
                level: 'warning'
            }]);
        } else if (newScore < 0.4 && prev >= 0.4) {
             setIncidents(logs => [...logs, {
                id: Date.now().toString(),
                time: new Date().toLocaleTimeString([], { hour12: false }),
                message: `[${activeNode}] System stabilized. Metrics returned to normal.`,
                level: 'warning' // Use warning color for info for now, or maybe create an 'info' level
            }]);
        }

        return newScore;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeNode]);

  let stateStatus = 'normal';
  if (anomalyScore >= 0.7) stateStatus = 'critical';
  else if (anomalyScore >= 0.4) stateStatus = 'warning';

  return (
    <div style={{
      width: '100%', 
      height: '100%',
      backgroundColor: '#12161c', 
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(69, 162, 158, 0.2)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <h3 style={{ margin: 0, color: '#c5c6c7', fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          System Status
        </h3>
        <InfoTooltip text="State lights indicate overall health. The Anomaly Gauge flashes orange if the score exceeds 0.7, automatically adding a timestamped warning to the Incident Log below." />
      </div>

      {/* Top Row: Lights & Gauge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Sub-Component A: State Lights */}
        <div>
          <h3 style={{ margin: '0 0 12px 0', color: '#c5c6c7', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            System State
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Normal Block */}
            <div style={{
              flex: 1,
              height: '40px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              backgroundColor: stateStatus === 'normal' ? '#2e7d32' : '#1e242c',
              color: stateStatus === 'normal' ? '#fff' : '#4a5568',
              boxShadow: stateStatus === 'normal' ? '0 0 12px #2e7d32' : 'none',
              transition: 'all 0.3s ease'
            }}>
              Normal
            </div>
            
            {/* Warning Block */}
            <div style={{
              flex: 1,
              height: '40px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              backgroundColor: stateStatus === 'warning' ? '#f57c00' : '#1e242c',
              color: stateStatus === 'warning' ? '#fff' : '#4a5568',
              boxShadow: stateStatus === 'warning' ? '0 0 12px #f57c00' : 'none',
              transition: 'all 0.3s ease'
            }}>
              Warning
            </div>
            
            {/* Critical Block */}
            <div style={{
              flex: 1,
              height: '40px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              backgroundColor: stateStatus === 'critical' ? '#d32f2f' : '#1e242c',
              color: stateStatus === 'critical' ? '#fff' : '#4a5568',
              boxShadow: stateStatus === 'critical' ? '0 0 15px #d32f2f' : 'none',
              transition: 'all 0.3s ease'
            }}>
              Critical
            </div>
          </div>
        </div>

        {/* Sub-Component B: Anomaly Gauge */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 12px 0' }}>
            <h3 style={{ margin: 0, color: '#c5c6c7', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Anomaly Score
            </h3>
            <span style={{ color: stateStatus === 'critical' ? '#ff9800' : '#66fcf1', fontWeight: 'bold', fontSize: '0.85rem' }}>
              {anomalyScore.toFixed(2)}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '40px',
            backgroundColor: '#1e242c',
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* The fill line */}
            <div 
              className={anomalyScore >= 0.7 ? styles.flashingOrange : ''}
              style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, anomalyScore * 100))}%`,
                backgroundColor: anomalyScore >= 0.7 ? '#ff9800' : '#0288d1',
                transition: 'width 0.5s ease-out, background-color 0.3s ease'
              }}
            />
            {/* Threshold marker */}
            <div style={{
              position: 'absolute',
              left: '70%',
              top: 0,
              bottom: 0,
              width: '2px',
              backgroundColor: '#ef5350',
              zIndex: 10
            }} title="Critical Threshold (0.7)" />
          </div>
        </div>

      </div>

      {/* Sub-Component C: Incident Ticker */}
      <div>
        <h3 style={{ margin: '0 0 8px 0', color: '#c5c6c7', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Incident Log
        </h3>
        <div style={{
          height: '120px',
          backgroundColor: '#0b0c10',
          border: '1px solid #1f2833',
          borderRadius: '4px',
          padding: '8px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: 'monospace'
        }}>
          {incidents.map(inc => (
            <div key={inc.id} style={{ 
              fontSize: '0.85rem', 
              color: inc.level === 'critical' ? '#ff5252' : inc.level === 'warning' ? '#ffb74d' : '#81c784',
              display: 'flex',
              gap: '8px'
            }}>
              <span style={{ color: '#45a29e', flexShrink: 0 }}>[{inc.time}]</span>
              <span>{inc.message}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

    </div>
  );
}
