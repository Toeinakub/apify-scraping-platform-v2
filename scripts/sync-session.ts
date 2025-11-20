import { apifyClient } from '../lib/apify/client';
import { updateSessionWithResults, updateSessionWithError } from '../lib/db/queries';

/**
 * Script to manually sync a session from Apify
 * Usage: npx tsx scripts/sync-session.ts <sessionId>
 */

async function syncSession(sessionId: string) {
  console.log(`Syncing session: ${sessionId}`);

  try {
    // Get session from database
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      console.error('Session not found');
      process.exit(1);
    }

    console.log('Session status:', session.status);
    console.log('Apify Run ID:', session.apifyRunId);

    if (!session.apifyRunId) {
      console.error('No Apify Run ID found');
      process.exit(1);
    }

    // Get run status from Apify
    console.log('\nFetching run from Apify...');
    const run = await apifyClient.run(session.apifyRunId).get();

    console.log('Run status:', run?.status);
    console.log('Dataset ID:', run?.defaultDatasetId);

    if (!run?.defaultDatasetId) {
      console.error('No dataset ID found');
      process.exit(1);
    }

    // Get results
    console.log('\nFetching results...');
    const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();

    console.log('Results count:', items.length);

    if (items.length > 0) {
      // Update session with results
      console.log('\nUpdating session with results...');
      await updateSessionWithResults(
        sessionId,
        items,
        {
          itemCount: items.length,
          duration: run.stats?.durationMillis,
          computeUnits: run.stats?.computeUnits,
        },
        session.apifyRunId
      );

      console.log('✓ Session updated successfully!');
    } else if (run.status === 'FAILED' || run.status === 'ABORTED' || run.status === 'TIMED-OUT') {
      // Update session with error
      console.log('\nRun failed, updating session with error...');
      await updateSessionWithError(sessionId, {
        message: `Run ${run.status.toLowerCase()}: ${run.statusMessage || 'No error message'}`,
        type: 'APIFY_ERROR',
        details: {
          status: run.status,
          statusMessage: run.statusMessage,
        },
        apifyRunId: session.apifyRunId,
      });

      console.log('✓ Session updated with error!');
    } else {
      console.log('\nNo results yet, run may still be in progress');
    }

    await prisma.$disconnect();
  } catch (error: any) {
    console.error('Error syncing session:', error.message);
    process.exit(1);
  }
}

// Get sessionId from command line args
const sessionId = process.argv[2];

if (!sessionId) {
  console.error('Usage: npx tsx scripts/sync-session.ts <sessionId>');
  process.exit(1);
}

syncSession(sessionId);
