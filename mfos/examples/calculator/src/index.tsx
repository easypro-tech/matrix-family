/*
 * Project: MFOS Calculator Example
 * Company: Matrix Family (matrix.family)
 * Dev: Brabus (EasyProTech)
 * Date: 2026-02-09 UTC
 * Status: Created
 * Telegram: https://t.me/EasyProTech
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MFOSApi, CalculatorMode, CalculatorState } from './types';

type AppProps = {
  mfos: MFOSApi;
};

// Storage keys
const STORAGE_KEYS = {
  history: 'calc.history',
  mode: 'calc.mode',
  memory: 'calc.memory',
} as const;

// Initial calculator state
const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  memory: 0,
  history: [],
  error: null,
};

export default function App({ mfos }: AppProps) {
  // Translation helper
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      return mfos.i18n?.t?.(key, params) ?? key;
    },
    [mfos.i18n]
  );

  // Calculator state - initialize with defaults, load from storage in useEffect
  const [state, setState] = useState<CalculatorState>(initialState);
  const [mode, setMode] = useState<CalculatorMode>('basic');

  // Load saved state from storage on mount
  useEffect(() => {
    try {
      const savedHistory = mfos.storage.get(STORAGE_KEYS.history);
      const savedMemory = mfos.storage.get(STORAGE_KEYS.memory);
      const savedMode = mfos.storage.get(STORAGE_KEYS.mode);
      
      if (savedHistory || savedMemory) {
        setState(prev => ({
          ...prev,
          history: savedHistory ? JSON.parse(savedHistory) : [],
          memory: savedMemory ? parseFloat(savedMemory) : 0,
        }));
      }
      if (savedMode) {
        setMode(savedMode as CalculatorMode);
      }
    } catch { /* ignore */ }
  }, [mfos.storage]);

  // Persist state changes
  useEffect(() => {
    try {
      mfos.storage.set(STORAGE_KEYS.history, JSON.stringify(state.history.slice(-20)));
    } catch { /* ignore */ }
  }, [state.history, mfos.storage]);

  useEffect(() => {
    try {
      mfos.storage.set(STORAGE_KEYS.memory, String(state.memory));
    } catch { /* ignore */ }
  }, [state.memory, mfos.storage]);

  useEffect(() => {
    try {
      mfos.storage.set(STORAGE_KEYS.mode, mode);
    } catch { /* ignore */ }
  }, [mode, mfos.storage]);

  // UI Components
  const { DSButton, TabMenu } = mfos.ui.components;

  // Calculate result
  const calculate = useCallback((left: number, right: number, op: string): number | null => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '×': return left * right;
      case '÷':
        if (right === 0) return null; // Division by zero
        return left / right;
      case '^': return Math.pow(left, right);
      case 'mod': return left % right;
      default: return right;
    }
  }, []);

  // Input handlers
  const inputDigit = useCallback((digit: string) => {
    setState(prev => {
      if (prev.error) return { ...prev, display: digit, error: null, waitingForOperand: false };
      if (prev.waitingForOperand) {
        return { ...prev, display: digit, waitingForOperand: false };
      }
      return {
        ...prev,
        display: prev.display === '0' ? digit : prev.display + digit,
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState(prev => {
      if (prev.error) return { ...prev, display: '0.', error: null, waitingForOperand: false };
      if (prev.waitingForOperand) {
        return { ...prev, display: '0.', waitingForOperand: false };
      }
      if (!prev.display.includes('.')) {
        return { ...prev, display: prev.display + '.' };
      }
      return prev;
    });
  }, []);

  const inputOperator = useCallback((op: string) => {
    setState(prev => {
      if (prev.error) return prev;
      const currentValue = parseFloat(prev.display);

      if (prev.previousValue === null) {
        return {
          ...prev,
          previousValue: currentValue,
          operator: op,
          waitingForOperand: true,
        };
      }

      if (prev.operator && !prev.waitingForOperand) {
        const result = calculate(prev.previousValue, currentValue, prev.operator);
        if (result === null) {
          return {
            ...prev,
            display: '0',
            error: t('calc.error.divideByZero'),
            previousValue: null,
            operator: null,
            waitingForOperand: false,
          };
        }
        return {
          ...prev,
          display: String(result),
          previousValue: result,
          operator: op,
          waitingForOperand: true,
        };
      }

      return { ...prev, operator: op, waitingForOperand: true };
    });
  }, [calculate, t]);

  const performCalculation = useCallback(() => {
    setState(prev => {
      if (prev.error || prev.operator === null || prev.previousValue === null) {
        return prev;
      }

      const currentValue = parseFloat(prev.display);
      const result = calculate(prev.previousValue, currentValue, prev.operator);

      if (result === null) {
        return {
          ...prev,
          display: '0',
          error: t('calc.error.divideByZero'),
          previousValue: null,
          operator: null,
          waitingForOperand: false,
        };
      }

      const expression = `${prev.previousValue} ${prev.operator} ${currentValue} = ${result}`;
      return {
        ...prev,
        display: String(result),
        previousValue: null,
        operator: null,
        waitingForOperand: true,
        history: [...prev.history, expression],
      };
    });
  }, [calculate, t]);

  const clear = useCallback(() => {
    setState(prev => ({
      ...initialState,
      memory: prev.memory,
      history: prev.history,
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState(initialState);
    try {
      mfos.storage.remove(STORAGE_KEYS.history);
    } catch { /* ignore */ }
  }, [mfos.storage]);

  const toggleSign = useCallback(() => {
    setState(prev => {
      if (prev.error) return prev;
      const value = parseFloat(prev.display);
      return { ...prev, display: String(-value) };
    });
  }, []);

  const percent = useCallback(() => {
    setState(prev => {
      if (prev.error) return prev;
      const value = parseFloat(prev.display);
      return { ...prev, display: String(value / 100), waitingForOperand: true };
    });
  }, []);

  // Scientific functions
  const scientificFn = useCallback((fn: string) => {
    setState(prev => {
      if (prev.error) return prev;
      const value = parseFloat(prev.display);
      let result: number;

      switch (fn) {
        case 'sin': result = Math.sin(value * Math.PI / 180); break;
        case 'cos': result = Math.cos(value * Math.PI / 180); break;
        case 'tan': result = Math.tan(value * Math.PI / 180); break;
        case 'sqrt':
          if (value < 0) {
            return { ...prev, display: '0', error: t('calc.error.invalidInput'), waitingForOperand: true };
          }
          result = Math.sqrt(value);
          break;
        case 'log':
          if (value <= 0) {
            return { ...prev, display: '0', error: t('calc.error.invalidInput'), waitingForOperand: true };
          }
          result = Math.log10(value);
          break;
        case 'ln':
          if (value <= 0) {
            return { ...prev, display: '0', error: t('calc.error.invalidInput'), waitingForOperand: true };
          }
          result = Math.log(value);
          break;
        case 'x²': result = value * value; break;
        case '1/x':
          if (value === 0) {
            return { ...prev, display: '0', error: t('calc.error.divideByZero'), waitingForOperand: true };
          }
          result = 1 / value;
          break;
        case 'π': result = Math.PI; break;
        case 'e': result = Math.E; break;
        default: return prev;
      }

      return { ...prev, display: String(result), waitingForOperand: true };
    });
  }, [t]);

  // Memory functions
  const memoryOp = useCallback((op: string) => {
    setState(prev => {
      const value = parseFloat(prev.display);
      switch (op) {
        case 'MC': return { ...prev, memory: 0 };
        case 'MR': return { ...prev, display: String(prev.memory), waitingForOperand: true };
        case 'M+': return { ...prev, memory: prev.memory + value };
        case 'M-': return { ...prev, memory: prev.memory - value };
        default: return prev;
      }
    });
  }, []);

  // Mode tabs
  const modeTabs = useMemo(() => [
    { id: 'basic', label: t('calc.mode.basic') },
    { id: 'scientific', label: t('calc.mode.scientific') },
  ], [t]);

  // Button styles - adaptive based on mode
  const getButtonStyle = (isScientific: boolean): React.CSSProperties => ({
    height: isScientific ? '36px' : '44px',
    fontSize: isScientific ? '14px' : '16px',
    fontWeight: 500,
    width: '100%',
    minWidth: 0,
    padding: isScientific ? '4px 2px' : '8px',
  });

  // Button component
  const CalcButton = useCallback(({ 
    label, 
    onClick, 
    variant = 'ghost',
    active = false,
    scientific = false,
  }: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    active?: boolean;
    scientific?: boolean;
  }) => (
    <DSButton
      variant={active ? 'primary' : variant}
      onClick={onClick}
      style={getButtonStyle(scientific)}
    >
      {label}
    </DSButton>
  ), [DSButton]);

  // Grid styles (inline because Tailwind not available in MFOS runtime)
  const gridStyles = {
    basic: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '6px',
    } as React.CSSProperties,
    scientific: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '3px',
    } as React.CSSProperties,
    span2: {
      gridColumn: 'span 2',
    } as React.CSSProperties,
  };

  // Render basic buttons
  const renderBasicButtons = () => (
    <div style={gridStyles.basic}>
      <CalcButton label={t('calc.btn.clear')} onClick={clear} variant="secondary" />
      <CalcButton label="±" onClick={toggleSign} variant="secondary" />
      <CalcButton label="%" onClick={percent} variant="secondary" />
      <CalcButton label="÷" onClick={() => inputOperator('÷')} variant="primary" active={state.operator === '÷'} />

      <CalcButton label="7" onClick={() => inputDigit('7')} />
      <CalcButton label="8" onClick={() => inputDigit('8')} />
      <CalcButton label="9" onClick={() => inputDigit('9')} />
      <CalcButton label="×" onClick={() => inputOperator('×')} variant="primary" active={state.operator === '×'} />

      <CalcButton label="4" onClick={() => inputDigit('4')} />
      <CalcButton label="5" onClick={() => inputDigit('5')} />
      <CalcButton label="6" onClick={() => inputDigit('6')} />
      <CalcButton label="−" onClick={() => inputOperator('-')} variant="primary" active={state.operator === '-'} />

      <CalcButton label="1" onClick={() => inputDigit('1')} />
      <CalcButton label="2" onClick={() => inputDigit('2')} />
      <CalcButton label="3" onClick={() => inputDigit('3')} />
      <CalcButton label="+" onClick={() => inputOperator('+')} variant="primary" active={state.operator === '+'} />

      <div style={gridStyles.span2}>
        <CalcButton label="0" onClick={() => inputDigit('0')} />
      </div>
      <CalcButton label="." onClick={inputDecimal} />
      <CalcButton label="=" onClick={performCalculation} variant="primary" />
    </div>
  );

  // Render scientific buttons
  const renderScientificButtons = () => (
    <div style={gridStyles.scientific}>
      {/* Row 1: Memory */}
      <CalcButton label="MC" onClick={() => memoryOp('MC')} variant="secondary" scientific />
      <CalcButton label="MR" onClick={() => memoryOp('MR')} variant="secondary" scientific />
      <CalcButton label="M+" onClick={() => memoryOp('M+')} variant="secondary" scientific />
      <CalcButton label="M−" onClick={() => memoryOp('M-')} variant="secondary" scientific />
      <CalcButton label={t('calc.btn.clear')} onClick={clear} variant="danger" scientific />

      {/* Row 2: Trig */}
      <CalcButton label="sin" onClick={() => scientificFn('sin')} variant="secondary" scientific />
      <CalcButton label="cos" onClick={() => scientificFn('cos')} variant="secondary" scientific />
      <CalcButton label="tan" onClick={() => scientificFn('tan')} variant="secondary" scientific />
      <CalcButton label="√" onClick={() => scientificFn('sqrt')} variant="secondary" scientific />
      <CalcButton label="÷" onClick={() => inputOperator('÷')} variant="primary" active={state.operator === '÷'} scientific />

      {/* Row 3: Log */}
      <CalcButton label="log" onClick={() => scientificFn('log')} variant="secondary" scientific />
      <CalcButton label="ln" onClick={() => scientificFn('ln')} variant="secondary" scientific />
      <CalcButton label="x²" onClick={() => scientificFn('x²')} variant="secondary" scientific />
      <CalcButton label="xʸ" onClick={() => inputOperator('^')} variant="secondary" active={state.operator === '^'} scientific />
      <CalcButton label="×" onClick={() => inputOperator('×')} variant="primary" active={state.operator === '×'} scientific />

      {/* Row 4 */}
      <CalcButton label="π" onClick={() => scientificFn('π')} variant="secondary" scientific />
      <CalcButton label="7" onClick={() => inputDigit('7')} scientific />
      <CalcButton label="8" onClick={() => inputDigit('8')} scientific />
      <CalcButton label="9" onClick={() => inputDigit('9')} scientific />
      <CalcButton label="−" onClick={() => inputOperator('-')} variant="primary" active={state.operator === '-'} scientific />

      {/* Row 5 */}
      <CalcButton label="e" onClick={() => scientificFn('e')} variant="secondary" scientific />
      <CalcButton label="4" onClick={() => inputDigit('4')} scientific />
      <CalcButton label="5" onClick={() => inputDigit('5')} scientific />
      <CalcButton label="6" onClick={() => inputDigit('6')} scientific />
      <CalcButton label="+" onClick={() => inputOperator('+')} variant="primary" active={state.operator === '+'} scientific />

      {/* Row 6 */}
      <CalcButton label="1/x" onClick={() => scientificFn('1/x')} variant="secondary" scientific />
      <CalcButton label="1" onClick={() => inputDigit('1')} scientific />
      <CalcButton label="2" onClick={() => inputDigit('2')} scientific />
      <CalcButton label="3" onClick={() => inputDigit('3')} scientific />
      <CalcButton label="=" onClick={performCalculation} variant="primary" scientific />

      {/* Row 7 */}
      <CalcButton label="±" onClick={toggleSign} variant="secondary" scientific />
      <div style={gridStyles.span2}>
        <CalcButton label="0" onClick={() => inputDigit('0')} scientific />
      </div>
      <CalcButton label="." onClick={inputDecimal} scientific />
      <CalcButton label="AC" onClick={clearAll} variant="danger" scientific />
    </div>
  );

  // Container styles
  const containerStyles = {
    outerWrapper: {
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '8px',
      backgroundColor: 'var(--bg-color)',
      overflow: 'auto',
    } as React.CSSProperties,
    root: {
      width: '100%',
      maxWidth: mode === 'scientific' ? '360px' : '280px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
    } as React.CSSProperties,
    tabsWrapper: {
      padding: '8px',
      borderBottom: '1px solid var(--border-color)',
    } as React.CSSProperties,
    error: {
      margin: '8px 8px 0',
      padding: '8px',
      borderRadius: '4px',
      backgroundColor: 'var(--color-danger-muted)',
      color: 'var(--color-danger)',
      fontSize: '14px',
    } as React.CSSProperties,
    displayArea: {
      padding: '16px',
      borderBottom: '1px solid var(--border-color)',
    } as React.CSSProperties,
    expression: {
      fontSize: '12px',
      color: 'var(--secondary-text-color)',
      textAlign: 'right' as const,
      minHeight: '16px',
    } as React.CSSProperties,
    display: {
      fontSize: '32px',
      fontFamily: 'monospace',
      textAlign: 'right' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    } as React.CSSProperties,
    displayError: {
      color: 'var(--color-danger)',
    } as React.CSSProperties,
    memoryIndicator: {
      fontSize: '12px',
      color: 'var(--accent-color)',
      textAlign: 'right' as const,
      marginTop: '4px',
    } as React.CSSProperties,
    buttonsWrapper: {
      flex: 1,
      padding: '8px',
      overflow: 'auto',
    } as React.CSSProperties,
    history: {
      maxHeight: '56px',
      overflowY: 'auto' as const,
      padding: '8px',
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'var(--hover-bg-color)',
    } as React.CSSProperties,
    historyEntry: {
      fontSize: '12px',
      color: 'var(--secondary-text-color)',
      fontFamily: 'monospace',
    } as React.CSSProperties,
  };

  return (
    <div style={containerStyles.outerWrapper}>
      <div style={containerStyles.root}>
        {/* Mode tabs */}
        <div style={containerStyles.tabsWrapper}>
          <TabMenu
            tabs={modeTabs}
            activeTab={mode}
            onTabChange={(id) => setMode(id as CalculatorMode)}
          />
        </div>

        {/* Error message */}
        {state.error && (
          <div style={containerStyles.error}>
            {state.error}
          </div>
        )}

        {/* Display */}
        <div style={containerStyles.displayArea}>
          {/* Expression */}
          <div style={containerStyles.expression}>
            {state.previousValue !== null && `${state.previousValue} ${state.operator || ''}`}
          </div>
          {/* Value */}
          <div style={{
            ...containerStyles.display,
            ...(state.error ? containerStyles.displayError : {}),
          }}>
            {state.display}
          </div>
          {/* Memory indicator */}
          {state.memory !== 0 && (
            <div style={containerStyles.memoryIndicator}>
              M: {state.memory}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={containerStyles.buttonsWrapper}>
          {mode === 'scientific' ? renderScientificButtons() : renderBasicButtons()}
        </div>

        {/* History */}
        {state.history.length > 0 && (
          <div style={containerStyles.history}>
            {state.history.slice(-5).reverse().map((entry, idx) => (
              <div key={idx} style={containerStyles.historyEntry}>
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
