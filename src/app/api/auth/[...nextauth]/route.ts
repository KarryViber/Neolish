import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // Import from the new location
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter'; // 需要安装 @next-auth/prisma-adapter
import { prisma } from '@/lib/prisma'; // 确保你的 Prisma Client 实例路径正确
import bcrypt from 'bcryptjs';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 