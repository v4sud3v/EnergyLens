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
      height: '350px', 
      backgroundColor: '#12161c', 
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #1f2833',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#c5c6c7', fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Live Telemetry
      </h3>
      <div style={{ width: '100%', height: 'calc(100% - 32px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#8a8d91" 
              tick={{ fill: '#8a8d91', fontSize: 12 }} 
              tickMargin={10} 
            />
            
            {/* Left Y-Axis for Power (MW) */}
            <YAxis 
              yAxisId="left" 
              stroke="#66fcf1" 
              tick={{ fill: '#66fcf1', fontSize: 12 }}
              label={{ value: 'Active Power (MW)', angle: -90, position: 'insideLeft', fill: '#66fcf1', style: { textAnchor: 'middle' } }}
            />
            
            {/* Right Y-Axis for Voltage (kV) */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#ff9800" 
              tick={{ fill: '#ff9800', fontSize: 12 }}
              label={{ value: 'Line Voltage (kV)', angle: 90, position: 'insideRight', fill: '#ff9800', style: { textAnchor: 'middle' } }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#0b0c10', border: '1px solid #45a29e', borderRadius: '4px' }}
              itemStyle={{ color: '#c5c6c7' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }}/>
            
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="power" 
              name="Power (MW)"
              stroke="#66fcf1" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={false} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="voltage" 
              name="Voltage (kV)"
              stroke="#ff9800" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
