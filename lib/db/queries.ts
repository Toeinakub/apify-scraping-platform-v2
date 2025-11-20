export async function updateSessionWithResults(
    sessionId: string,
    items: any[],
    stats: { itemCount: number; duration?: number; computeUnits?: number },
    apifyRunId: string
) {
    console.log('Mock updateSessionWithResults', sessionId, items.length);
    return Promise.resolve();
}

export async function updateSessionWithError(
    sessionId: string,
    error: { message: string; type: string; details: any; apifyRunId: string }
) {
    console.log('Mock updateSessionWithError', sessionId, error.message);
    return Promise.resolve();
}
