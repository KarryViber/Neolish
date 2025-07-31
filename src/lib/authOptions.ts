import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Authorize Error: Missing credentials');
          return null;
        }
        console.log(`Authorize attempt for email: ${credentials.email}`);
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            username: true,
            passwordHash: true,
            avatar: true,
          },
        });
        if (!user) {
          console.log(`Authorize Error: User not found for email: ${credentials.email}`);
          return null;
        }
        if (!user.passwordHash) {
            console.error(`Authorize Error: User ${user.email} has no passwordHash set.`);
            return null;
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isPasswordValid) {
          console.log(`Authorize Error: Invalid password for user: ${credentials.email}`);
          return null;
        }
        console.log(`Authorize SUCCESS for user: ${credentials.email}`);
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          image: user.avatar,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account: _account, profile: _profile, isNewUser: _isNewUser, trigger, session }) {
      // 处理用户更新触发器（如调用 update() 方法）
      if (trigger === "update" && session) {
        // 如果是头像更新，直接更新token中的image
        if (session.image !== undefined) {
          token.image = session.image;
        }
        return token;
      }

      if (user && user.id) {
        token.id = user.id;
        token.username = user.username;
        token.image = user.image; // 确保JWT token包含最新的头像信息
        try {
          const userWithMemberships = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
              memberships: {
                include: {
                  team: {
                    select: { id: true, name: true },
                  },
                },
              },
            },
          });
          if (userWithMemberships && userWithMemberships.memberships && userWithMemberships.memberships.length > 0) {
            token.teams = userWithMemberships.memberships.map(membership => ({
              id: membership.team.id,
              name: membership.team.name,
            }));
            token.activeTeamId = token.teams[0].id;
          } else {
            token.teams = [];
            token.activeTeamId = null;
          }
        } catch (error) {
          console.error("Error fetching user teams in JWT callback:", error);
          token.teams = [];
          token.activeTeamId = null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const userSession = session.user as {
          id: string;
          username?: string | null;
          activeTeamId?: string | null;
          teams?: { id: string; name: string; }[] | null;
        } & typeof session.user;
        userSession.id = token.id as string;
        userSession.username = token.username as string | null | undefined;
        userSession.teams = token.teams as { id: string; name: string; }[] | null | undefined;
        userSession.activeTeamId = token.activeTeamId as string | null | undefined;
        
        // 使用token中的头像信息，避免每次都查询数据库
        // 只有在页面刷新后才会从数据库重新获取最新的头像信息
        userSession.image = token.image as string | null | undefined;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 只在开发模式下记录日志
      if (process.env.NODE_ENV === 'development') {
        console.log("[AUTH] Redirect:", { url, baseUrl });
      }
      
      try {
        // 如果URL已经是完整的baseUrl，直接返回
        if (url.startsWith(baseUrl)) {
          return url;
        }
        
        // 如果是相对路径，拼接baseUrl
        if (url.startsWith("/")) {
          return `${baseUrl}${url}`;
        }
        
        // 其他情况返回baseUrl
        return baseUrl;
      } catch (error) {
        // 出错时返回baseUrl
        return baseUrl;
      }
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 