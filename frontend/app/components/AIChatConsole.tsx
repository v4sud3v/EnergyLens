"use client";

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

import InfoTooltip from './InfoTooltip';

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
    // Optionally clear or append context message on node change
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

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate backend processing delay
    setTimeout(() => {
      let aiResponseText = '';
      const query = userMsg.text.toLowerCase();

      // Simple mock AI logic based on keywords
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
    }, 1500 + Math.random() * 1000); // 1.5 - 2.5 seconds delay
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
      backgroundColor: '#12161c',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(69, 162, 158, 0.2)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
      position: 'relative'
    }}>
      {/* Header Area */}
      <div style={{
        padding: '0 0 16px 0',
        borderBottom: '1px solid #1f2833',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#45a29e', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI Engineering Console
            </h3>
            <InfoTooltip text="Ask the diagnostic backend questions about current telemetry, anomalies, or historical trends. The AI automatically contextualizes responses based on the Active Node." />
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#8a8d91' }}>
            Direct semantic interface
          </p>
        </div>
      </div>

      {/* Sub-Component A: The Dialogue Feed */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#45a29e #12161c'
      }}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} style={{
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              width: '100%'
            }}>
              <div style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: isUser ? '#1f2833' : '#0b0c10',
                border: isUser ? '1px solid #2c3e50' : '1px solid #45a29e',
                color: isUser ? '#e0e6ed' : '#66fcf1',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                borderBottomRightRadius: isUser ? '0px' : '8px',
                borderBottomLeftRadius: isUser ? '8px' : '0px',
                boxShadow: isUser ? 'none' : '0 2px 8px rgba(69, 162, 158, 0.1)'
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#0b0c10',
              border: '1px solid #45a29e',
              color: '#66fcf1',
              fontSize: '0.9rem',
              borderBottomLeftRadius: '0px',
              fontStyle: 'italic'
            }}>
              Analyzing grid telemetry...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sub-Component B: The Command Line */}
      <div style={{
        marginTop: '16px',
        flexShrink: 0,
        display: 'flex',
        gap: '8px',
        position: 'relative'
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Query grid events..."
          style={{
            flex: 1,
            backgroundColor: '#0b0c10',
            border: '1px solid #45a29e',
            color: '#c5c6c7',
            padding: '12px 16px',
            borderRadius: '4px',
            outline: 'none',
            fontSize: '0.9rem',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#66fcf1';
            e.target.style.boxShadow = '0 0 8px rgba(102, 252, 241, 0.3)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#45a29e';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
          style={{
            backgroundColor: '#1f2833',
            color: '#66fcf1',
            border: '1px solid #45a29e',
            padding: '0 20px',
            borderRadius: '4px',
            cursor: (!inputValue.trim() || isTyping) ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.8rem',
            opacity: (!inputValue.trim() || isTyping) ? 0.5 : 1,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            if (!inputValue.trim() || isTyping) return;
            e.currentTarget.style.backgroundColor = '#45a29e';
            e.currentTarget.style.color = '#0b0c10';
          }}
          onMouseOut={(e) => {
            if (!inputValue.trim() || isTyping) return;
            e.currentTarget.style.backgroundColor = '#1f2833';
            e.currentTarget.style.color = '#66fcf1';
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
