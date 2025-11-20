import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import type { Session as AppSession } from '@/types';

type ListedSession = {
  id: string;
  title: string;
  type: AppSession['type'];
  status: AppSession['status'];
  apifyRunId: string | null;
  createdAt: Date;
  startedAt: Date | null;
  parameters: Prisma.JsonValue;
};

/**
 * Script to list all running sessions
 * Usage: npx tsx scripts/list-running-sessions.ts
 */

async function listRunningSessions() {
  const prisma = new PrismaClient();

  try {
    const sessions: ListedSession[] = await prisma.session.findMany({
      where: { status: 'RUNNING' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        apifyRunId: true,
        createdAt: true,
        startedAt: true,
        parameters: true,
      },
    });

    console.log(`Found ${sessions.length} running session(s):\n`);

    sessions.forEach((session: ListedSession, index) => {
      console.log(`${index + 1}. Session ID: ${session.id}`);
      console.log(`   Title: ${session.title}`);
      console.log(`   Type: ${session.type}`);
      console.log(`   Status: ${session.status}`);
      console.log(`   Apify Run ID: ${session.apifyRunId || 'N/A'}`);
      console.log(`   Created: ${session.createdAt}`);
      console.log(`   Started: ${session.startedAt || 'N/A'}`);

      const params = session.parameters as any;
      if (params?.urls && Array.isArray(params.urls)) {
        console.log(`   URLs: ${params.urls.length} URL(s)`);
        params.urls.forEach((url: string, i: number) => {
          console.log(`     ${i + 1}. ${url}`);
        });
      } else if (params?.url) {
        console.log(`   URL: ${params.url}`);
      }

      console.log('');
    });

    if (sessions.length > 0) {
      console.log('\nTo sync a session, run:');
      console.log('npx tsx scripts/sync-session.ts <sessionId>');
    }

    await prisma.$disconnect();
  } catch (error: any) {
    console.error('Error listing sessions:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

listRunningSessions();
