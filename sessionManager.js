/**
 * Session Manager for Hotmeet Chat
 * Manages conversation sessions, message counts, and premium suggestion logic
 */

// In-memory session storage
const sessions = new Map();

// Generate unique session ID
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create a new chat session
function createSession(profileId, profileData) {
    const sessionId = generateSessionId();

    // Random trigger between 5-8 user messages
    const premiumTriggerAt = Math.floor(Math.random() * 4) + 5; // 5, 6, 7, or 8

    const session = {
        sessionId,
        profileId,
        profileData,
        userMessageCount: 0,          // Only counts user messages
        history: [],                   // Full conversation history
        premiumTriggerAt,             // When to suggest premium
        shouldSuggestPremium: false,  // Flag for current message
        premiumAlreadySuggested: false, // One-time flag
        createdAt: new Date()
    };

    sessions.set(sessionId, session);
    console.log(`[Session] Created: ${sessionId} (premium trigger at ${premiumTriggerAt} msgs)`);

    return session;
}

// Get session by ID
function getSession(sessionId) {
    return sessions.get(sessionId);
}

// Add message to session history
function addMessage(sessionId, role, content) {
    const session = sessions.get(sessionId);
    if (!session) return null;

    session.history.push({ role, content });

    // Count user messages and check premium trigger
    if (role === 'user') {
        session.userMessageCount++;

        // Check if we should trigger premium suggestion
        if (!session.premiumAlreadySuggested &&
            session.userMessageCount >= session.premiumTriggerAt) {
            session.shouldSuggestPremium = true;
            console.log(`[Session] ${sessionId} - Premium trigger activated at message ${session.userMessageCount}`);
        }
    }

    // After assistant responds with premium suggestion, mark as done
    if (role === 'assistant' && session.shouldSuggestPremium) {
        session.shouldSuggestPremium = false;
        session.premiumAlreadySuggested = true;
        console.log(`[Session] ${sessionId} - Premium suggestion delivered`);
    }

    return session;
}

// Check if should suggest premium in next response
function shouldSuggestPremium(sessionId) {
    const session = sessions.get(sessionId);
    return session ? session.shouldSuggestPremium : false;
}

// Check if premium was already suggested
function wasPremiumSuggested(sessionId) {
    const session = sessions.get(sessionId);
    return session ? session.premiumAlreadySuggested : false;
}

// Get conversation history for AI context
function getHistory(sessionId, limit = 10) {
    const session = sessions.get(sessionId);
    if (!session) return [];

    // Return last N messages for context
    return session.history.slice(-limit);
}

// Get session stats
function getSessionStats(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return null;

    return {
        sessionId: session.sessionId,
        messageCount: session.userMessageCount,
        premiumSuggested: session.premiumAlreadySuggested,
        shouldShowPremiumButton: session.premiumAlreadySuggested
    };
}

// Clean up old sessions (call periodically)
function cleanupOldSessions(maxAgeMs = 3600000) { // 1 hour default
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of sessions) {
        if (now - session.createdAt.getTime() > maxAgeMs) {
            sessions.delete(sessionId);
            cleaned++;
        }
    }

    if (cleaned > 0) {
        console.log(`[Session] Cleaned ${cleaned} old sessions`);
    }
}

// Cleanup every 30 minutes
setInterval(() => cleanupOldSessions(), 1800000);

export {
    createSession,
    getSession,
    addMessage,
    shouldSuggestPremium,
    wasPremiumSuggested,
    getHistory,
    getSessionStats,
    cleanupOldSessions
};
