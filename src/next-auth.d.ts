import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as NextAuthJWT } from 'next-auth/jwt';

interface UserTeam {
  id: string;
  name: string;
  // Add other team properties if needed, e.g., role
  role?: string; // Example: 'OWNER', 'MEMBER'
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id: string;
      username?: string | null;
      activeTeamId?: string | null;
      teams?: UserTeam[] | null;
    } & DefaultSession['user']; // Keep other default user properties
  }

  interface User extends DefaultUser {
    username?: string | null;
    activeTeamId?: string | null;
    teams?: UserTeam[] | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    id?: string;
    username?: string | null;
    activeTeamId?: string | null;
    teams?: UserTeam[] | null;
  }
}
