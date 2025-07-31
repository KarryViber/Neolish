import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const email = 'test@ptmind.com';
  const username = 'test_ptminder';
  const password = 'Ptmind@123';
  const teamName = 'test_team';

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create the User
  const user = await prisma.user.create({
    data: {
      email: email,
      username: username,
      passwordHash: hashedPassword,
    },
  });
  console.log(`Created user with id: ${user.id}, email: ${user.email}`);

  // 2. Create the Team and set the user as owner
  const team = await prisma.team.create({
    data: {
      name: teamName,
      ownerId: user.id, // Link to the created user
    },
  });
  console.log(`Created team with id: ${team.id}, name: ${team.name}, ownerId: ${team.ownerId}`);

  // 3. Create Membership linking user to team as OWNER
  const membership = await prisma.membership.create({
    data: {
      userId: user.id,
      teamId: team.id,
      role: Role.OWNER, // Use the Role enum from Prisma Client
    },
  });
  console.log(`Created membership for user ${membership.userId} in team ${membership.teamId} with role ${membership.role}`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
