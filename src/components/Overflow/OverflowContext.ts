import { createContext, useContext } from 'react';

interface OverflowContextValue {
  hiddenMap: Map<string, 'min' | 'hidden'>;
}

const OverflowContext = createContext<OverflowContextValue | null>(null);

export function useOverflow(): OverflowContextValue {
  const ctx = useContext(OverflowContext);
  if (!ctx) {
    throw new Error('useOverflow must be used within an <Overflow> component');
  }
  return ctx;
}

export default OverflowContext;
