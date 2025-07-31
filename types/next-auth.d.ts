// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT as NextAuthJWT } from "next-auth/jwt";

// Define a type for a single Team within the User object
interface UserTeam {
  id: string;
  // Add other team properties if needed, e.g., name: string;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: {
      id: string; // Add your custom property id
      username?: string | null; // Add your custom property username
      teams?: UserTeam[] | null; // Add teams array to user in Session
    } & DefaultSession["user"]; // Keep existing properties like name, email, image
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends DefaultUser {
    username?: string | null; // Add username here if your User model has it
    teams?: UserTeam[] | null; // Add teams array to User interface
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends NextAuthJWT {
    id: string; // Add your custom property id
    username?: string | null; // Add your custom property username
    teams?: UserTeam[] | null; // Add teams array to JWT (if you pass it through the jwt callback)
  }
} 