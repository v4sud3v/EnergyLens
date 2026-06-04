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
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface ForecastData {
  timeLabel: string;
  timestamp: number;
  actual: number | null;
  forecast: number | null;
}

const generateData = (nodeName: string): ForecastData[] => {
  const data: ForecastData[] = [];
  const now = new Date();
  const basePower = nodeName === 'Substation North' ? 120 : nodeName === 'Substation West' ? 150 : 90;
  
  // Decide if there's a predicted spike (70% chance)
  const hasSpike = Math.random() > 0.3;
  const spikeHour = 12 + Math.floor(Math.random() * 8); // Between +12h and +20h

  // Generate 48 hours of past data
  for (let i = -48; i <= 0; i++) {
    const time = new Date(now.getTime() + i * 3600000);
    const hourLabel = i === 0 ? 'Now' : i % 12 === 0 ? `${Math.abs(i)}h ago` : '';
    
    // Add some sine wave for daily cycle + noise
    const cycle = Math.sin((time.getHours() / 24) * Math.PI * 2) * 20;
    const noise = (Math.random() - 0.5) * 10;
    const value = basePower + cycle + noise;

    data.push({
      timeLabel: hourLabel,
      timestamp: time.getTime(),
      actual: value,
      forecast: i === 0 ? value : null // connect the lines at Now
    });
  }

  // Generate 24 hours of future data
  const currentActual = data[data.length - 1].actual as number;
  for (let i = 1; i <= 24; i++) {
    const time = new Date(now.getTime() + i * 3600000);
    const hourLabel = i % 12 === 0 ? `+${i}h` : '';
    
    let cycle = Math.sin((time.getHours() / 24) * Math.PI * 2) * 20;
    let noise = (Math.random() - 0.5) * 10;
    
    // Inject massive spike
    if (hasSpike && Math.abs(i - spikeHour) <= 2) {
      const spikeMultiplier = 2 - Math.abs(i - spikeHour) * 0.5; // peaks at spikeHour
      cycle += 80 * spikeMultiplier;
    }

    const value = basePower + cycle + noise;

    data.push({
      timeLabel: hourLabel,
      timestamp: time.getTime(),
      actual: null,
      forecast: value
    });
  }

  return data;
};

export default function TimelineForecast({ activeNode }: { activeNode: string }) {
  const [data, setData] = useState<ForecastData[]>([]);

  useEffect(() => {
    setData(generateData(activeNode));
  }, [activeNode]);

  return (
    <div style={{
      width: '100%', 
      height: '350px', 
      backgroundColor: '#12161c', 
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #1f2833',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      marginTop: '24px' // Adding margin to separate from the Status Trackers
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: '#c5c6c7', fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          48/24 Demand Forecast
        </h3>
        <span style={{ fontSize: '0.8rem', color: '#8a8d91', textTransform: 'uppercase' }}>
          Predictive Analytics Engine Active
        </span>
      </div>
      
      <div style={{ width: '100%', height: 'calc(100% - 36px)' }}>
        <ResponsiveContainer width="99%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(unixTime) => {
                const point = data.find(d => d.timestamp === unixTime);
                return point && point.timeLabel ? point.timeLabel : '';
              }}
              stroke="#8a8d91" 
              tick={{ fill: '#8a8d91', fontSize: 12 }} 
              tickMargin={10} 
            />
            
            <YAxis 
              stroke="#8a8d91" 
              tick={{ fill: '#8a8d91', fontSize: 12 }}
              label={{ value: 'Demand (MW)', angle: -90, position: 'insideLeft', fill: '#8a8d91', style: { textAnchor: 'middle' } }}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#0b0c10', border: '1px solid #45a29e', borderRadius: '4px' }}
              itemStyle={{ color: '#c5c6c7' }}
              labelFormatter={(label) => new Date(label as number).toLocaleString([], { dateStyle: 'short', timeStyle: 'short'})}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }}/>
            
            <ReferenceLine x={data.find(d => d.timeLabel === 'Now')?.timestamp} stroke="#45a29e" strokeDasharray="3 3" label={{ position: 'top', value: 'CURRENT TIME', fill: '#45a29e', fontSize: 10 }} />

            <Line 
              type="monotone" 
              dataKey="actual" 
              name="Historical Demand"
              stroke="#66fcf1" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true} 
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name="Predicted Forecast"
              stroke="#ff3d00" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 8, fill: '#ff3d00' }}
              isAnimationActive={true} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
