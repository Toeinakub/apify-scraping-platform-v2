import { PrismaClient } from '@prisma/client';

/**
 * Script to delete a session
 * Usage: npx tsx scripts/delete-session.ts <sessionId>
 */

async function deleteSession(sessionId: string) {
  const prisma = new PrismaClient();

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        title: true,
        status: true,
      },
    });

    if (!session) {
      console.error('Session not found');
      await prisma.$disconnect();
      process.exit(1);
    }

    console.log('Deleting session:');
    console.log('  ID:', session.id);
    console.log('  Title:', session.title);
    console.log('  Status:', session.status);
    console.log('');

    await prisma.session.delete({
      where: { id: sessionId },
    });

    console.log('✓ Session deleted successfully!');

    await prisma.$disconnect();
  } catch (error: any) {
    console.error('Error deleting session:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Get sessionId from command line args
const sessionId = process.argv[2];

if (!sessionId) {
  console.error('Usage: npx tsx scripts/delete-session.ts <sessionId>');
  process.exit(1);
}

deleteSession(sessionId);
