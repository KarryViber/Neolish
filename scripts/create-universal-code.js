const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 生成随机激活码的函数
function generateActivationCode(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function createUniversalCode() {
  try {
    // 生成唯一的激活码
    let code;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      code = generateActivationCode();
      const existingCode = await prisma.activationCode.findUnique({
        where: { code }
      });
      isUnique = !existingCode;
      attempts++;
    } while (!isUnique && attempts < maxAttempts);

    if (!isUnique) {
      throw new Error('Failed to generate unique code after 10 attempts');
    }

    const newCode = await prisma.activationCode.create({
      data: {
        code: code,
        email: '*', // 使用 * 表示任意邮箱
        isUniversal: true,
        teamId: null // 万能激活码不绑定团队
      }
    });

    console.log('✅ Universal activation code created successfully!');
    console.log('📋 Code:', newCode.code);
    console.log('📧 Email:', newCode.email);
    console.log('🌍 Universal:', newCode.isUniversal);
    console.log('📅 Created:', newCode.createdAt);
    
    return newCode;

  } catch (error) {
    console.error('❌ Error creating universal activation code:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 运行脚本
if (require.main === module) {
  createUniversalCode()
    .then(() => {
      console.log('\n🎉 Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createUniversalCode }; 