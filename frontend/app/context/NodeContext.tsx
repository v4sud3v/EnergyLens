"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NodeContextType {
  activeNode: string;
  setActiveNode: (node: string) => void;
}

const NodeContext = createContext<NodeContextType | undefined>(undefined);

export function NodeProvider({ children }: { children: ReactNode }) {
  const [activeNode, setActiveNode] = useState("Substation North");

  return (
    <NodeContext.Provider value={{ activeNode, setActiveNode }}>
      {children}
    </NodeContext.Provider>
  );
}

export function useNodeContext() {
  const context = useContext(NodeContext);
  if (context === undefined) {
    throw new Error("useNodeContext must be used within a NodeProvider");
  }
  return context;
}
