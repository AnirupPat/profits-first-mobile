export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  pan?: string;
}

export type AuthStatus = 'loading' | 'unauthed' | 'authed';

export interface AuthSession {
  token: string;
  user: User;
  inviteCode: string;
  signedInAt: string;
}
