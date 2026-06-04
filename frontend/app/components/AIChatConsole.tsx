"use client";

import React, { useState, useEffect, useRef } from 'react';
import InfoTooltip from './InfoTooltip';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function AIChatConsole({ activeNode }: { activeNode: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `EnergyLens Engineering Assistant online. Active context set to ${activeNode}. How can I assist you with grid operations today?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `[System]: Active monitoring context switched to ${activeNode}.`
      }
    ]);
  }, [activeNode]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      const query = userMsg.text.toLowerCase();

      if (query.includes('spike') || query.includes('anomaly')) {
        aiResponseText = `I have analyzed the current telemetry for ${activeNode}. The anomaly score indicates a potential voltage irregularity on feeder line 4. I recommend reviewing the recent thermal imaging logs.`;
      } else if (query.includes('status')) {
        aiResponseText = `Current status for ${activeNode}: All main transformers are operating within nominal thermal limits. Active Power is stable, but Line Voltage is showing minor harmonic distortion.`;
      } else {
        aiResponseText = `I have logged your inquiry regarding "${userMsg.text}". Running historical comparisons across the ${activeNode} data lake. I will notify you if any predictive thresholds are breached.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: aiResponseText
        }
      ]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      backgroundColor: 'var(--card-bg)',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      position: 'relative'
    }}>
      {/* Header Area */}
      <div style={{
        padding: '0 0 16px 0',
        borderBottom: '1px solid var(--border-color)',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--foreground)', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
              AI Engineering Console
            </h3>
            <InfoTooltip text="Ask the diagnostic backend questions about current telemetry, anomalies, or historical trends. The AI automatically contextualizes responses based on the Active Node." />
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Direct semantic interface
          </p>
        </div>
      </div>

      {/* Sub-Component A: The Dialogue Feed */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div key={msg.id} style={{
              display: 'flex',
              justifyContent: isAI ? 'flex-start' : 'flex-end',
              width: '100%'
            }}>
              <div style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: isAI ? 'rgba(255, 255, 255, 0.05)' : 'var(--accent-blue)',
                color: isAI ? 'var(--foreground)' : '#ffffff',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                borderBottomLeftRadius: isAI ? '4px' : '16px',
                borderBottomRightRadius: isAI ? '16px' : '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                {msg.text}
              </div>
            </div>
          )
        })}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              borderBottomLeftRadius: '4px'
            }}>
              Processing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sub-Component B: The Command Line */}
      <div style={{
        flexShrink: 0,
        paddingTop: '16px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '12px'
      }}>
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Query data for ${activeNode}...`}
          style={{
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: 'var(--foreground)',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
          style={{
            backgroundColor: 'var(--accent-blue)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '0 20px',
            fontWeight: 600,
            cursor: (!inputValue.trim() || isTyping) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(10, 132, 255, 0.3)',
            opacity: (!inputValue.trim() || isTyping) ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
