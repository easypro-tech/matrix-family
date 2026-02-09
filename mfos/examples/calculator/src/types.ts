/*
 * Project: MFOS Calculator Example
 * Company: Matrix Family (matrix.family)
 * Dev: Brabus (EasyProTech)
 * Date: 2026-02-09 UTC
 * Status: Created
 */

import type React from 'react';

export type MFOSUser = {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
};

export type MFOSStorage = {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  clear(): void;
};

export type MFOSi18nAPI = {
  language: string;
  t(key: string, params?: Record<string, string | number>): string;
};

export type MFOSUiComponents = {
  DSButton: React.ComponentType<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
  }>;
  Stack: React.ComponentType<{
    direction?: 'row' | 'column';
    gap?: number | string;
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    children?: React.ReactNode;
    className?: string;
  }>;
  TabMenu: React.ComponentType<{
    tabs: Array<{ id: string; label: string }>;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
  }>;
};

export type LucideIcon = React.ComponentType<{
  size?: number;
  className?: string;
}>;

export type MFOSUiAPI = {
  components: MFOSUiComponents;
  icons: Record<string, LucideIcon>;
  cn: (...classes: Array<string | undefined | null | boolean>) => string;
};

export type MFOSApi = {
  user: MFOSUser;
  storage: MFOSStorage;
  i18n: MFOSi18nAPI;
  ui: MFOSUiAPI;
};

export type CalculatorMode = 'basic' | 'scientific';

export type CalculatorState = {
  display: string;
  previousValue: number | null;
  operator: string | null;
  waitingForOperand: boolean;
  memory: number;
  history: string[];
  error: string | null;
};
