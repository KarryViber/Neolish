import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Define Role enum manually to match schema
enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

const prisma = new PrismaClient();

interface UserToCreate {
  email: string;
  username: string;
  password: string;
  teamName: string;
  isNewTeam?: boolean;
  isTeamOwner?: boolean;
}

async function createUsers() {
  console.log('开始创建用户...');

  // 定义要创建的用户
  const usersToCreate: UserToCreate[] = [
    // UG_ptmind 团队 - 加入现有团队作为member
    {
      email: 'wenlong.zhao@ptmind.com',
      username: 'Zack',
      password: 'Ptmind@123',
      teamName: 'UG_ptmind'
      // 不设置isNewTeam和isTeamOwner，默认为member加入现有团队
    },
    {
      email: 'xiaoshi.meng@ptmind.com',
      username: 'Victoira',
      password: 'Ptmind@123',
      teamName: 'UG_ptmind'
    },
    // CN_ptmind 团队 - Leo是owner
    {
      email: 'jingyan.li@ptmind.com',
      username: 'Leo',
      password: 'Ptmind@123',
      teamName: 'CN_ptmind',
      isNewTeam: true,
      isTeamOwner: true
    },
    {
      email: 'suyuan.jia@ptmind.com',
      username: 'Nigma',
      password: 'Ptmind@123',
      teamName: 'CN_ptmind'
    },
    {
      email: 'danping.wang@ptmind.com',
      username: 'Danping',
      password: 'Ptmind@123',
      teamName: 'CN_ptmind'
    },
    {
      email: 'dun.zhang@ptmind.com',
      username: 'Jim',
      password: 'Ptmind@123',
      teamName: 'CN_ptmind'
    },
    {
      email: 'jiayao.zou@ptmind.com',
      username: 'Vicky',
      password: 'Ptmind@123',
      teamName: 'CN_ptmind'
    },
    // 新增用户 - 加入现有CN_ptmind团队
    {
      email: 'robin@ptmind.com',
      username: 'robin',
      password: 'Ptmind@123',
      teamName: 'CN_ptmind'
    }
  ];

  try {
    for (const userData of usersToCreate) {
      console.log(`\n创建用户: ${userData.username} (${userData.email})`);

      // 检查用户是否已存在
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`用户 ${userData.email} 已存在，跳过创建`);
        continue;
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

      // 处理团队
      let team;
      
      if (userData.isNewTeam) {
        // 检查团队是否已存在
        const existingTeam = await prisma.team.findFirst({
          where: { name: userData.teamName }
        });

        if (existingTeam) {
          console.log(`团队 ${userData.teamName} 已存在`);
          team = existingTeam;
        } else {
          // 创建新团队
          team = await prisma.team.create({
            data: {
              name: userData.teamName,
              ownerId: user.id,
            },
          });
          console.log(`✓ 新团队创建成功: ${team.name} (ID: ${team.id})`);
        }
      } else {
        // 查找现有团队
        team = await prisma.team.findFirst({
          where: { name: userData.teamName }
        });

        if (!team) {
          console.error(`❌ 团队 ${userData.teamName} 不存在！`);
          continue;
        }
        console.log(`✓ 找到现有团队: ${team.name} (ID: ${team.id})`);
      }

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
        // 创建成员关系
        const role = userData.isTeamOwner ? Role.OWNER : Role.MEMBER;
        const membership = await prisma.membership.create({
          data: {
            userId: user.id,
            teamId: team.id,
            role: role,
          },
        });
        console.log(`✓ 成员关系创建成功: ${userData.username} 加入 ${userData.teamName} (角色: ${role})`);
      }
    }

    console.log('\n🎉 所有用户创建完成！');

    // 显示创建结果摘要
    console.log('\n📊 创建摘要:');
    for (const userData of usersToCreate) {
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
        include: {
          memberships: {
            include: {
              team: true
            }
          }
        }
      });

      if (user) {
        console.log(`- ${user.username} (${user.email})`);
        user.memberships.forEach((membership: any) => {
          console.log(`  └─ 团队: ${membership.team.name} (角色: ${membership.role})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ 创建用户时出错:', error);
    throw error;
  }
}

async function main() {
  try {
    await createUsers();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 