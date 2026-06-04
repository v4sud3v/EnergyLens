"use client";

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import InfoTooltip from './InfoTooltip';

interface DataPoint {
  time: string;
  power: number;
  voltage: number;
}

// Generate an initial window of data
const generateInitialData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = new Date();
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      time: time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      power: 45 + Math.random() * 10, // ~45-55 MW
      voltage: 110 + Math.random() * 5, // ~110-115 kV
    });
  }
  return data;
};

export default function LiveMetricsGraph({ activeNode }: { activeNode: string }) {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    // Reset data when node changes to show it's "loading" new context
    setData(generateInitialData());
  }, [activeNode]);

  useEffect(() => {
    // Simulate incoming telemetry data every second
    const interval = setInterval(() => {
      setData((currentData) => {
        const newData = [...currentData];
        // Remove oldest
        if (newData.length >= 20) {
          newData.shift();
        }
        // Add newest
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Slightly different ranges based on node to make it feel real
        const powerBase = activeNode === 'Substation North' ? 45 : activeNode === 'Substation West' ? 60 : 30;
        const voltageBase = activeNode === 'Substation North' ? 110 : activeNode === 'Substation West' ? 120 : 66;

        newData.push({
          time,
          power: powerBase + Math.random() * 10,
          voltage: voltageBase + Math.random() * 5,
        });
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeNode]);

  return (
    <div style={{
      width: '100%', 
      height: '100%', 
      minHeight: '400px',
      backgroundColor: 'var(--card-bg)', 
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
          Live Telemetry
        </h3>
        <InfoTooltip text="Dual-axis chart continuously mapping Active Power (MW) and Line Voltage (kV) over a 20-second sliding window." />
      </div>
      <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="var(--text-secondary)" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
              tickMargin={10} 
              axisLine={false}
              tickLine={false}
            />
            
            {/* Left Y-Axis for Power (MW) */}
            <YAxis 
              yAxisId="left" 
              stroke="var(--accent-blue)" 
              tick={{ fill: 'var(--accent-blue)', fontSize: 12 }}
              label={{ value: 'Active Power (MW)', angle: -90, position: 'insideLeft', fill: 'var(--accent-blue)', style: { textAnchor: 'middle' }, offset: -5 }}
              axisLine={false}
              tickLine={false}
            />
            
            {/* Right Y-Axis for Voltage (kV) */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="var(--accent-orange)" 
              tick={{ fill: 'var(--accent-orange)', fontSize: 12 }}
              label={{ value: 'Line Voltage (kV)', angle: 90, position: 'insideRight', fill: 'var(--accent-orange)', style: { textAnchor: 'middle' }, offset: -5 }}
              domain={['dataMin - 5', 'dataMax + 5']}
              axisLine={false}
              tickLine={false}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(28, 28, 30, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="power" 
              name="Power (MW)"
              stroke="var(--accent-blue)" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={false} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="voltage" 
              name="Voltage (kV)"
              stroke="var(--accent-orange)" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
