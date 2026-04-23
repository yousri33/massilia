import type {
  AuthSession,
  DiagnosticAnswers,
  MassiliaUser,
  StoredFile,
  ChatMessage,
} from './types';

const KEYS = {
  AUTH_SESSION: 'massilia_auth_session',
  ACCOUNTS: 'massilia_accounts',
  DIAGNOSTIC: 'massilia_diagnostic_answers',
  files: (userId: string) => `massilia_files_${userId}`,
  chat: (userId: string) => `massilia_chat_history_${userId}`,
} as const;

function safeGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full — silently ignore
  }
}

function safeRemove(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

// ─── Auth Session ────────────────────────────────────────────────────────────

export function getSession(): AuthSession | null {
  return safeGet<AuthSession>(KEYS.AUTH_SESSION);
}

export function setSession(session: AuthSession): void {
  safeSet(KEYS.AUTH_SESSION, session);
}

export function clearSession(): void {
  safeRemove(KEYS.AUTH_SESSION);
}

// ─── Known Accounts (email → { passwordHash, userId }) ───────────────────────

type AccountsMap = Record<string, { passwordHash: string; userId: string }>;

export function getAccounts(): AccountsMap {
  return safeGet<AccountsMap>(KEYS.ACCOUNTS) ?? {};
}

export function setAccounts(accounts: AccountsMap): void {
  safeSet(KEYS.ACCOUNTS, accounts);
}

export function getAccountByEmail(email: string): { passwordHash: string; userId: string } | null {
  return getAccounts()[email.toLowerCase()] ?? null;
}

export function registerAccount(
  email: string,
  passwordHash: string,
  userId: string,
  user: MassiliaUser,
): void {
  const accounts = getAccounts();
  accounts[email.toLowerCase()] = { passwordHash, userId };
  safeSet(KEYS.ACCOUNTS, accounts);
  // Also persist the user object keyed by id for later retrieval
  safeSet(`massilia_user_${userId}`, user);
}

export function getUserById(userId: string): MassiliaUser | null {
  return safeGet<MassiliaUser>(`massilia_user_${userId}`);
}

export function persistUser(user: MassiliaUser): void {
  safeSet(`massilia_user_${user.id}`, user);
}

// ─── Diagnostic Answers ───────────────────────────────────────────────────────

export function getDiagnostic(): DiagnosticAnswers | null {
  return safeGet<DiagnosticAnswers>(KEYS.DIAGNOSTIC);
}

export function setDiagnostic(answers: DiagnosticAnswers): void {
  safeSet(KEYS.DIAGNOSTIC, answers);
}

// ─── Files ────────────────────────────────────────────────────────────────────

export function getFiles(userId: string): StoredFile[] {
  return safeGet<StoredFile[]>(KEYS.files(userId)) ?? [];
}

export function setFiles(userId: string, files: StoredFile[]): void {
  safeSet(KEYS.files(userId), files);
}

// ─── Chat History ─────────────────────────────────────────────────────────────

export function getChatHistory(userId: string): ChatMessage[] {
  return safeGet<ChatMessage[]>(KEYS.chat(userId)) ?? [];
}

export function setChatHistory(userId: string, messages: ChatMessage[]): void {
  // Keep last 100 messages to avoid localStorage bloat
  const trimmed = messages.slice(-100);
  safeSet(KEYS.chat(userId), trimmed);
}

// ─── Storage Usage ────────────────────────────────────────────────────────────

export function getTotalStorageUsage(): number {
  if (typeof window === 'undefined') return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('massilia_')) {
      total += (localStorage.getItem(key)?.length ?? 0) * 2; // UTF-16
    }
  }
  return total;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
