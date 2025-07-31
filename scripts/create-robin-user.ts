import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Define Role enum manually to match schema
enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

const prisma = new PrismaClient();

async function createRobinUser() {
  console.log('开始创建Robin用户...');

  const userData = {
    email: 'robin@ptmind.com',
    username: 'robin',
    password: 'Ptmind@123',
    teamName: 'CN_ptmind'
  };

  try {
    console.log(`\n创建用户: ${userData.username} (${userData.email})`);

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      console.log(`用户 ${userData.email} 已存在，跳过创建`);
      return;
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        passwordHash: hashedPassword,
      },
    });
    console.log(`✓ 用户创建成功: ${user.username} (ID: ${user.id})`);

    // 查找CN_ptmind团队
    const team = await prisma.team.findFirst({
      where: { name: userData.teamName }
    });

    if (!team) {
      console.error(`❌ 团队 ${userData.teamName} 不存在！`);
      return;
    }
    console.log(`✓ 找到现有团队: ${team.name} (ID: ${team.id})`);

    // 检查是否已有成员关系
    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: team.id
        }
      }
    });

    if (existingMembership) {
      console.log(`用户 ${userData.username} 已经是团队 ${userData.teamName} 的成员`);
    } else {
      // 创建成员关系（作为普通成员）
      const membership = await prisma.membership.create({
        data: {
          userId: user.id,
          teamId: team.id,
          role: Role.MEMBER,
        },
      });
      console.log(`✓ 成员关系创建成功: ${userData.username} 加入 ${userData.teamName} (角色: ${Role.MEMBER})`);
    }

    console.log('\n🎉 Robin用户创建完成！');

    // 显示创建结果摘要
    console.log('\n📊 创建摘要:');
    const user_final = await prisma.user.findUnique({
      where: { email: userData.email },
      include: {
        memberships: {
          include: {
            team: true
          }
        }
      }
    });

    if (user_final) {
      console.log(`- ${user_final.username} (${user_final.email})`);
      user_final.memberships.forEach((membership: any) => {
        console.log(`  └─ 团队: ${membership.team.name} (角色: ${membership.role})`);
      });
    }

  } catch (error) {
    console.error('❌ 创建用户时出错:', error);
    throw error;
  }
}

async function main() {
  try {
    await createRobinUser();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 