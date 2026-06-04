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
  ReferenceLine,
  ResponsiveContainer
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

import InfoTooltip from './InfoTooltip';

export default function TimelineForecast({ activeNode }: { activeNode: string }) {
  const [data, setData] = useState<ForecastData[]>([]);

  useEffect(() => {
    setData(generateData(activeNode));
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
            48/24 Demand Forecast
          </h3>
          <InfoTooltip text="Visualizes 48 hours of historical actuals against 24 hours of future predictions. Watch for orange dashed spikes indicating predicted grid instability." />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Predictive Analytics Engine Active
        </span>
      </div>
      
      <div style={{ flex: 1, width: '100%', minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(unixTime) => {
                const point = data.find(d => d.timestamp === unixTime);
                return point && point.timeLabel ? point.timeLabel : '';
              }}
              stroke="var(--text-secondary)" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
              tickMargin={10} 
              axisLine={false}
              tickLine={false}
            />
            
            <YAxis 
              stroke="var(--foreground)" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              label={{ value: 'Demand (MW)', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', offset: -5 }}
              domain={[60, 160]}
              axisLine={false}
              tickLine={false}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(28, 28, 30, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
              itemStyle={{ color: 'var(--foreground)' }}
              labelFormatter={(label) => new Date(label as number).toLocaleString([], { dateStyle: 'short', timeStyle: 'short'})}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            
            <ReferenceLine x={data.find(d => d.timeLabel === 'Now')?.timestamp} stroke="var(--accent-blue)" strokeDasharray="3 3" label={{ position: 'top', value: 'CURRENT TIME', fill: 'var(--accent-blue)', fontSize: 10 }} />

            {/* Historical Actuals */}
            <Line 
              type="monotone" 
              dataKey="actual" 
              name="Historical Actuals"
              stroke="var(--accent-blue)" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={false} 
            />
            
            {/* Future Predictions */}
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name="Predicted Demand"
              stroke="var(--accent-orange)" 
              strokeWidth={3}
              strokeDasharray="5 5"
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
