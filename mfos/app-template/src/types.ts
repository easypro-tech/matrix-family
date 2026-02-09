/*
 * Project: MFOS App Template
 * Company: Matrix Family (matrix.family)
 * Dev: Brabus (EasyProTech)
 * Date: 2026-02-09 UTC
 * Status: Updated - Complete API types
 * Telegram: https://t.me/EasyProTech
 *
 * MFOS API type definitions
 * These types describe the mfos prop available to your app
 */

import type React from 'react';

// ============================================================
// USER & STORAGE
// ============================================================

/**
 * User information
 */
export type MFOSUser = {
  /** Matrix user ID (e.g., @user:matrix.family) */
  userId: string;
  /** Display name (if set) */
  displayName?: string;
  /** Avatar URL (if set) */
  avatarUrl?: string;
};

/**
 * Storage API - isolated per app
 * Keys are automatically namespaced as mfos.{appId}.{key}
 */
export type MFOSStorage = {
  /** Get value by key */
  get(key: string): string | null;
  /** Set value */
  set(key: string, value: string): void;
  /** Remove value */
  remove(key: string): void;
  /** Clear all app storage */
  clear(): void;
  /** Get all keys */
  keys(): string[];
  /** Get total storage size in bytes */
  size(): number;
  
  /** IndexedDB storage (requires storage.indexeddb permission) */
  indexeddb: MFOSIndexedDB;
};

/**
 * IndexedDB API - for larger data storage
 */
export type MFOSIndexedDB = {
  /** Get value by key */
  get(key: string): Promise<unknown | null>;
  /** Set value */
  set(key: string, value: unknown): Promise<void>;
  /** Remove value */
  remove(key: string): Promise<void>;
  /** Clear all IndexedDB storage */
  clear(): Promise<void>;
  /** Get all keys */
  keys(): Promise<string[]>;
  /** Get total storage size in bytes */
  size(): Promise<number>;
};

/**
 * Auth API - Gateway authentication
 */
export type MFOSAuthAPI = {
  /** Get auth token for Gateway requests */
  getToken(): Promise<string | null>;
  /** Check if user is authenticated */
  isAuthenticated(): boolean;
};

/**
 * Permissions API
 */
export type MFOSPermissions = {
  /** Check if permission is granted */
  check(permission: string): boolean;
  /** Check multiple permissions at once */
  checkAll(permissions: string[]): Record<string, boolean>;
  /** Request permission from user */
  request(permission: string): Promise<boolean>;
  /** Request multiple permissions at once */
  requestAll(permissions: string[]): Promise<Record<string, boolean>>;
  /** List all granted permissions */
  listGranted(): string[];
};

// ============================================================
// NETWORK API
// ============================================================

/**
 * Network helpers (via Security Gateway)
 */
export type MFOSNetworkAPI = {
  /** Create WebSocket connection via gateway */
  websocket(url: string): Promise<WebSocket>;
};

/**
 * WebApp embedding helpers (via Security Gateway)
 */
export type MFOSWebAppAPI = {
  /** Get gateway-proxied URL for embedding external content */
  getUrl(url: string): string;
};

// ============================================================
// LOCALIZATION API
// ============================================================

/**
 * Localization API
 * See: https://mfos.tech/docs/localization
 */
export type MFOSi18nAPI = {
  /** Current language code (e.g., "ru", "en") */
  language: string;
  /** Available locales for this app */
  locales: string[];
  /** Translate key with optional interpolation */
  t(key: string, params?: Record<string, string | number>): string;
  /** Check if key exists in current locale */
  exists(key: string): boolean;
};

// ============================================================
// UI API (Design System)
// ============================================================

/**
 * UI Components from HushMe Design System
 * Available via mfos.ui.components
 *
 * IMPORTANT: Tailwind/className utilities are NOT available in MFOS runtime.
 * Always use inline styles with CSS variables for custom styling.
 * The `style` prop accepts React.CSSProperties.
 */
export type MFOSUiComponents = {
  // Interactive
  DSButton: React.ComponentType<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }>;
  DSIconButton: React.ComponentType<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }>;

  // Inline Panel (for chat header extensions)
  InlinePanel: React.ComponentType<{ children?: React.ReactNode; style?: React.CSSProperties }>;
  InlinePanelHeader: React.ComponentType<{ children?: React.ReactNode; style?: React.CSSProperties }>;
  InlinePanelBody: React.ComponentType<{ children?: React.ReactNode; style?: React.CSSProperties }>;
  InlinePanelFooter: React.ComponentType<{ children?: React.ReactNode; style?: React.CSSProperties }>;
  InlinePanelInput: React.ComponentType<{
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    style?: React.CSSProperties;
  }>;
  InlinePanelLabel: React.ComponentType<{ children?: React.ReactNode; style?: React.CSSProperties }>;

  // Settings
  SettingsRow: React.ComponentType<{ children?: React.ReactNode; style?: React.CSSProperties }>;
  SettingsGroup: React.ComponentType<{
    title?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }>;
  SettingsToggle: React.ComponentType<{
    label?: string;
    description?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    style?: React.CSSProperties;
  }>;
  SettingsDivider: React.ComponentType<{ style?: React.CSSProperties }>;

  // Panel
  PanelContent: React.ComponentType<{ children?: React.ReactNode; style?: React.CSSProperties }>;
  PanelSection: React.ComponentType<{
    title?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }>;

  // Layout
  Stack: React.ComponentType<{
    direction?: 'row' | 'column';
    gap?: number | string;
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }>;
  Grid: React.ComponentType<{
    cols?: number;
    gap?: number | string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }>;
  Center: React.ComponentType<{ children?: React.ReactNode; style?: React.CSSProperties }>;

  // Cards
  AppCard: React.ComponentType<{
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }>;
  ListItem: React.ComponentType<{
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }>;

  // Menu
  TabMenu: React.ComponentType<{
    tabs: Array<{ id: string; label: string }>;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    style?: React.CSSProperties;
  }>;
  FilterChips: React.ComponentType<{
    chips: Array<{ id: string; label: string }>;
    selected?: string[];
    onSelectionChange?: (selected: string[]) => void;
    style?: React.CSSProperties;
  }>;

  // Modal
  Modal: React.ComponentType<{
    open?: boolean;
    onClose?: () => void;
    title?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }>;

  // Accordion
  AccordionItem: React.ComponentType<{
    title?: string;
    expanded?: boolean;
    onToggle?: () => void;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }>;
  AccordionGroup: React.ComponentType<{
    allowMultiple?: boolean;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }>;
};

/**
 * Lucide icon component type
 */
export type LucideIcon = React.ComponentType<{
  size?: number;
  style?: React.CSSProperties;
  strokeWidth?: number;
}>;

/**
 * UI API - Design System access
 * See: https://mfos.tech/docs/extension-points
 *
 * IMPORTANT: Tailwind is NOT available in MFOS runtime.
 * Use inline styles with CSS variables for all styling.
 */
export type MFOSUiAPI = {
  /** HushMe Design System components */
  components: MFOSUiComponents;
  /** All Lucide icons (Bot, Send, Settings, etc.) */
  icons: Record<string, LucideIcon>;
};

// ============================================================
// MATRIX API TYPES
// ============================================================

export type MatrixEvent = {
  eventId: string;
  type: string;
  content: Record<string, unknown>;
  sender: string;
  timestamp: number;
  roomId: string;
};

export type MessageContent = {
  msgtype: 'm.text' | 'm.image' | 'm.file' | 'm.audio' | 'm.video' | 'm.notice';
  body: string;
  url?: string;
  info?: Record<string, unknown>;
  'm.relates_to'?: {
    rel_type: string;
    event_id: string;
    key?: string;
  };
};

export type RoomMember = {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  membership: 'join' | 'invite' | 'leave' | 'ban';
  powerLevel: number;
};

export type RoomInfo = {
  roomId: string;
  name?: string;
  topic?: string;
  avatarUrl?: string;
  memberCount: number;
  isDirect: boolean;
  isEncrypted: boolean;
};

export type UserProfile = {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
};

export type StateEvent = {
  type: string;
  stateKey: string;
  content: Record<string, unknown>;
  sender: string;
};

/**
 * Matrix API - requires matrix.* permissions
 */
export type MFOSMatrixAPI = {
  messages: {
    read(roomId: string, limit?: number): Promise<MatrixEvent[]>;
    send(roomId: string, content: MessageContent): Promise<string>;
    sendReaction(roomId: string, eventId: string, reaction: string): Promise<string>;
  };
  state: {
    get(roomId: string, type: string, stateKey?: string): Promise<StateEvent | null>;
    set(roomId: string, type: string, content: Record<string, unknown>, stateKey?: string): Promise<void>;
    getMembers(roomId: string): Promise<RoomMember[]>;
  };
  accountData: {
    get(type: string): Promise<Record<string, unknown> | null>;
    set(type: string, content: Record<string, unknown>): Promise<void>;
    getRoom(roomId: string, type: string): Promise<Record<string, unknown> | null>;
    setRoom(roomId: string, type: string, content: Record<string, unknown>): Promise<void>;
  };
  profile: {
    get(userId?: string): Promise<UserProfile>;
    setDisplayName(name: string): Promise<void>;
    setAvatarUrl(mxcUrl: string): Promise<void>;
  };
  rooms: {
    list(): Promise<RoomInfo[]>;
    getInfo(roomId: string): Promise<RoomInfo | null>;
    join(roomIdOrAlias: string): Promise<string>;
    leave(roomId: string): Promise<void>;
  };
};

// ============================================================
// CRYPTO API TYPES
// ============================================================

export type DeviceKeys = {
  deviceId: string;
  userId: string;
  displayName?: string;
  ed25519Key: string;
  curve25519Key: string;
  verified: 'verified' | 'unverified' | 'blocked';
  lastSeen?: number;
};

export type UserVerificationInfo = {
  userId: string;
  verified: 'verified' | 'unverified' | 'unknown';
  crossSigned: boolean;
  masterKey?: string;
  devices: DeviceKeys[];
};

export type EncryptRequest = {
  data: string | ArrayBuffer;
  roomId: string;
};

export type EncryptResult = {
  ciphertext: string;
  sessionId: string;
  senderKey: string;
  algorithm: 'megolm';
};

export type DecryptRequest = {
  ciphertext: string;
  roomId: string;
  senderKey: string;
  sessionId: string;
};

export type DecryptResult = {
  plaintext: string;
  senderVerified: boolean;
  senderId: string;
  senderDeviceId: string;
};

export type SignRequest = {
  data: string | ArrayBuffer;
  algorithm?: 'ed25519';
};

export type SignResult = {
  signature: string;
  deviceId: string;
  userId: string;
  algorithm: 'ed25519';
  publicKey: string;
};

export type VerifyRequest = {
  data: string | ArrayBuffer;
  signature: string;
  userId: string;
  deviceId?: string;
  algorithm?: 'ed25519';
};

export type VerifyResult = {
  valid: boolean;
  signerVerified: boolean;
  signerDeviceId?: string;
  error?: string;
};

/**
 * Crypto API - requires crypto.* permissions
 */
export type MFOSCryptoAPI = {
  encrypt(request: EncryptRequest): Promise<EncryptResult>;
  decrypt(request: DecryptRequest): Promise<DecryptResult>;
  sign(request: SignRequest): Promise<SignResult>;
  verify(request: VerifyRequest): Promise<VerifyResult>;
  getUserVerification(userId: string): Promise<UserVerificationInfo>;
  getDeviceKeys(userId: string): Promise<DeviceKeys[]>;
  secureStore: {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, expiresIn?: number): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
  };
};

// ============================================================
// CLIENT API TYPES (Provider Apps)
// ============================================================

export type VoiceConfig = {
  provider: string;
  enabled: boolean;
  settings?: {
    serverUrl?: string;
    preferH264?: boolean;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
  };
};

export type ThemeConfig = {
  activeThemeId?: string;
  customizations?: Record<string, string>;
};

export type SoundsConfig = {
  notification?: string;
  message?: string;
  call?: string;
};

export type ModalOptions = {
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

export type ClientInfo = {
  version: string;
  platform: 'web' | 'desktop' | 'mobile';
  language: string;
  theme: 'light' | 'dark' | 'system';
};

/**
 * Extension point identifiers
 */
export type ExtensionPointId = 'chat_header_inline';

/**
 * Chat header inline panel registration
 */
export type ChatHeaderInlineRegistration = {
  /** Unique ID for this registration */
  id: string;
  /** Tooltip text */
  tooltip: string;
  /** Icon name from Lucide (e.g., "Bot", "Sparkles") */
  icon: string;
  /** Icon position: left of room name, or right of actions */
  position?: 'left' | 'right';
  /** Panel component to render when clicked */
  component: React.ComponentType<{ roomId: string; onClose: () => void }>;
};

/**
 * Client API - for Provider apps
 * See: https://mfos.tech/docs/extension-points
 */
export type MFOSClientAPI = {
  /** Register as VoIP provider (requires client.voice.write) */
  setVoice(config: VoiceConfig): Promise<void>;
  /** Apply theme customizations (requires client.theme.write) */
  setTheme(config: ThemeConfig): Promise<void>;
  /** Configure notification sounds (requires client.sounds.write) */
  setSounds(config: SoundsConfig): Promise<void>;
  /** Navigate to HushMe internal route */
  navigate(path: string): void;
  /** Show toast notification */
  showToast(message: string, type?: 'info' | 'success' | 'error'): void;
  /** Show modal dialog */
  showModal(options: ModalOptions): Promise<boolean>;
  /** Get client information */
  getClientInfo(): ClientInfo;
  /**
   * Register extension at extension point (Provider apps only)
   * See: https://mfos.tech/docs/extension-points
   */
  registerExtension(
    extensionPointId: ExtensionPointId,
    registration: ChatHeaderInlineRegistration
  ): void;
  /**
   * Unregister extension from extension point
   */
  unregisterExtension(extensionPointId: ExtensionPointId, registrationId: string): void;
};

// ============================================================
// MAIN API
// ============================================================

/**
 * Main MFOS API object
 * Passed to your app as the mfos prop
 *
 * @example
 * ```tsx
 * export default function App({ mfos }: { mfos: MFOSApi }) {
 *   const { Bot } = mfos.ui.icons;
 *   return <div>Hello, {mfos.user.displayName}!</div>;
 * }
 * ```
 */
export type MFOSApi = {
  /** Current user information */
  user: MFOSUser;

  /** Isolated app storage */
  storage: MFOSStorage;

  /** Permission management */
  permissions: MFOSPermissions;

  /**
   * Proxied fetch for external requests
   * All requests go through Security Gateway
   * Requires network.fetch permission
   */
  fetch(url: string, options?: RequestInit): Promise<Response>;

  /**
   * Network helpers (WebSocket via gateway)
   * Requires network.websocket permission
   */
  network: MFOSNetworkAPI;

  /**
   * WebApp embedding helpers
   * For embedding external content via Security Gateway
   */
  webapp: MFOSWebAppAPI;

  /**
   * Localization API
   * Loads translations from app's locales/ folder
   * See: https://mfos.tech/docs/localization
   */
  i18n: MFOSi18nAPI;

  /**
   * UI Design System API
   * Access to HushMe components and Lucide icons
   * See: https://mfos.tech/docs/extension-points
   */
  ui: MFOSUiAPI;

  /**
   * Auth API
   * Gateway authentication tokens
   */
  auth: MFOSAuthAPI;

  /**
   * Matrix API (optional)
   * Available if app has matrix.* permissions
   */
  matrix?: MFOSMatrixAPI;

  /**
   * Crypto API (optional)
   * E2EE operations, secure storage
   * Available if app has crypto.* permissions
   */
  crypto?: MFOSCryptoAPI;

  /**
   * Client API (optional)
   * Client integration for Provider apps
   * Extension registration, navigation, toasts
   */
  client?: MFOSClientAPI;
};
