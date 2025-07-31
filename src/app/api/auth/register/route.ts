import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from "@prisma/client"; // Import Role enum if you defined it
import { validatePasswordStrength } from "@/utils/passwordStrength";

// Define the expected shape of the request body using Zod with password strength validation
const registerUserSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((password) => {
      const strength = validatePasswordStrength(password);
      return strength.isValid;
    }, {
      message: "Password does not meet security requirements"
    }),
  username: z.string().min(1, { message: "Username cannot be empty" }), // Username is now required
  activationCode: z.string().min(1, { message: "Activation code cannot be empty" }), // Activation code is required
});

export async function POST(request: NextRequest) {
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body. Must be JSON.' }, { status: 400 });
  }

  // Validate the request body against the schema
  const validation = registerUserSchema.safeParse(requestBody);

  if (!validation.success) {
    return NextResponse.json(
      { 
        error: 'Invalid input data', 
        details: validation.error.flatten().fieldErrors 
      }, 
      { status: 400 }
    );
  }

  const { email, password, username, activationCode } = validation.data;

  try {
    // 1. Validate Activation Code first
    const validCode = await prisma.activationCode.findUnique({
      where: { code: activationCode },
    });

    // 检查是否是万能激活码 (使用类型断言以避免TypeScript错误)
    const isUniversalCode = (validCode as any).isUniversal || false;
    
    // 对于普通激活码，检查是否已被使用；万能激活码可以重复使用
    if (!validCode || (!isUniversalCode && validCode.isUsed)) {
      return NextResponse.json(
        { error: 'Invalid or already used activation code' }, 
        { status: 400 }
      );
    }
    
    // Optional: Check if the email in the code matches the registration email (不适用于万能激活码)
    // if (!isUniversalCode && validCode.email.toLowerCase() !== email.toLowerCase()) {
    //   return NextResponse.json(
    //     { error: 'Activation code is not for this email address' }, 
    //     { status: 403 } // Forbidden
    //   );
    // }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If user exists, only invalidate ordinary codes, keep universal codes for reuse
      if (!isUniversalCode) {
        await prisma.activationCode.update({
          where: { code: activationCode },
          data: { isUsed: true },
        });
      }
      return NextResponse.json(
        { error: 'This email is already registered' }, 
        { status: 409 } // 409 Conflict
      );
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Use a transaction to: create user, handle team membership based on code type
    const newUser = await prisma.$transaction(async (tx) => {
      // Create the user
      const createdUser = await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          username: username,
        },
        select: { 
          id: true,
          email: true,
          username: true,
          createdAt: true,
        }
      });

      if (isUniversalCode) {
        // 万能激活码：创建默认团队并设置用户为所有者
        const defaultTeam = await tx.team.create({
          data: {
            name: `${username}'s Team`, // 默认团队名称
            ownerId: createdUser.id,
          },
        });

        await tx.membership.create({
          data: {
            userId: createdUser.id,
            teamId: defaultTeam.id,
            role: Role.OWNER, // 用户是自己团队的所有者
          },
        });
      } else {
        // 普通激活码：加入指定团队
        if (validCode.teamId) {
          await tx.membership.create({
            data: {
              userId: createdUser.id,
              teamId: validCode.teamId,
              role: Role.MEMBER, // Invited users join as MEMBER by default
            },
          });
        }
      }

      // 只有普通激活码才标记为已使用，万能激活码可以重复使用
      if (!isUniversalCode) {
        await tx.activationCode.update({
          where: { id: validCode.id },
          data: { isUsed: true },
        });
      }

      return { user: createdUser, isUniversalCode };
    });

    console.log(`User registered: ${newUser.user.email}, universal code: ${newUser.isUniversalCode}`);

    // Return the newly created user data with additional info
    return NextResponse.json({ 
      user: newUser.user, 
      isUniversalCode: newUser.isUniversalCode 
    }, { status: 201 });

  } catch (error: any) {
    // Handle potential transaction errors or other issues
    console.error("Error during user registration transaction:", error);
    if (error.code === 'P2002') { // Unique constraint violation (e.g., username if made unique)
      return NextResponse.json({ error: 'Username might already be taken.'}, { status: 409 });
    }
    if (error.code === 'P2025' || error.message.includes('Record to delete does not exist')) { 
         return NextResponse.json(
            { error: 'Activation code might have been used already.' }, 
            { status: 400 }
         );
    }
    return NextResponse.json(
      { error: 'Registration failed. Please try again later.' , details: error.message }, 
      { status: 500 }
    );
  }
} 