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

  let statusState = 'Normal';
  if (anomalyScore >= 0.7) statusState = 'Critical';
  else if (anomalyScore >= 0.4) statusState = 'Warning';

  const isFlashing = anomalyScore >= 0.7;

  return (
    <div style={{
      width: '100%', 
      height: '100%',
      backgroundColor: 'var(--card-bg)', 
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
          System Status
        </h3>
        <InfoTooltip text="State lights indicate overall health. The Anomaly Gauge flashes orange if the score exceeds 0.7, automatically adding a timestamped warning to the Incident Log below." />
      </div>

      {/* Top Row: Lights & Gauge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Sub-Component A: State Lights */}
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500 }}>Overall State</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              flex: 1, height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: statusState === 'Normal' ? 'var(--accent-green)' : 'rgba(255,255,255,0.05)',
              color: statusState === 'Normal' ? '#000' : 'var(--text-secondary)',
              fontWeight: statusState === 'Normal' ? 600 : 400,
              boxShadow: statusState === 'Normal' ? '0 0 20px rgba(50, 215, 75, 0.4)' : 'none',
              transition: 'all 0.3s ease'
            }}>Normal</div>
            <div style={{
              flex: 1, height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: statusState === 'Warning' ? 'var(--accent-orange)' : 'rgba(255,255,255,0.05)',
              color: statusState === 'Warning' ? '#000' : 'var(--text-secondary)',
              fontWeight: statusState === 'Warning' ? 600 : 400,
              boxShadow: statusState === 'Warning' ? '0 0 20px rgba(255, 159, 10, 0.4)' : 'none',
              transition: 'all 0.3s ease'
            }}>Warning</div>
            <div style={{
              flex: 1, height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: statusState === 'Critical' ? 'var(--accent-red)' : 'rgba(255,255,255,0.05)',
              color: statusState === 'Critical' ? '#fff' : 'var(--text-secondary)',
              fontWeight: statusState === 'Critical' ? 600 : 400,
              boxShadow: statusState === 'Critical' ? '0 0 20px rgba(255, 69, 58, 0.4)' : 'none',
              transition: 'all 0.3s ease'
            }}>Critical</div>
          </div>
        </div>

        {/* Sub-Component B: Anomaly Gauge */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Anomaly Score</span>
            <span style={{ fontSize: '0.85rem', color: isFlashing ? 'var(--accent-orange)' : 'var(--text-secondary)', fontWeight: 600 }}>{anomalyScore.toFixed(2)}</span>
          </div>
          <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
            <div 
              className={isFlashing ? styles.flashingGauge : ''}
              style={{
                width: `${anomalyScore * 100}%`,
                height: '100%',
                backgroundColor: isFlashing ? 'var(--accent-orange)' : 'var(--accent-blue)',
                transition: 'width 0.5s ease-out, background-color 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Sub-Component C: Incident Ticker */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, marginTop: '8px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500 }}>Incident Log</div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          fontFamily: 'monospace'
        }}>
          {incidents.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '20px' }}>No incidents recorded.</div>
          ) : (
            incidents.map(inc => (
              <div key={inc.id} style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{inc.time}</span>
                <span style={{ color: inc.level === 'critical' ? 'var(--accent-red)' : inc.level === 'warning' ? 'var(--accent-orange)' : 'var(--accent-green)' }}>{inc.message}</span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
