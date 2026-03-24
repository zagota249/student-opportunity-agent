const axios = require('axios');

const TINYFISH_API_URL = 'https://agent.tinyfish.ai/v1/automation/run-sse';

// Verify TinyFish API key exists
const verifyApiKey = () => {
    const apiKey = process.env.TINYFISH_API_KEY;
    if (!apiKey) {
        console.error('❌ TINYFISH_API_KEY is not set in environment variables');
        return false;
    }
    console.log('✅ TinyFish API Key found:', apiKey.substring(0, 15) + '...');
    return true;
};

// Parse SSE data from stream
const parseSSEData = (rawData) => {
    const lines = rawData.split('\n');
    const events = [];

    for (const line of lines) {
        if (line.startsWith('data: ')) {
            try {
                const jsonStr = line.substring(6); // Remove 'data: ' prefix
                const parsed = JSON.parse(jsonStr);
                events.push(parsed);
            } catch (e) {
                // Skip non-JSON lines
            }
        }
    }

    return events;
};

const runAgent = async (url, goal, user) => {
    // Verify API key before making request
    if (!verifyApiKey()) {
        throw new Error('TinyFish API key is not configured');
    }

    console.log(`🤖 Running TinyFish agent on: ${url}`);
    console.log(`🎯 Goal: ${goal.substring(0, 100)}...`);
    console.log(`👤 User: ${user?.email || 'Unknown'}`);

    try {
        const response = await axios.post(
            TINYFISH_API_URL,
            {
                url: url,
                goal: goal,
                browser_profile: 'stealth',
                proxy_config: { enabled: true, country_code: 'US' }
            },
            {
                headers: {
                    'X-API-Key': process.env.TINYFISH_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 300000,  // 5 minutes timeout for automation
                responseType: 'text' // Handle SSE as text
            }
        );

        console.log('✅ TinyFish API response received');

        // Parse SSE events from response
        const events = parseSSEData(response.data);
        const completeEvent = events.find(e => e.type === 'COMPLETE');
        const progressEvents = events.filter(e => e.type === 'PROGRESS');

        return {
            success: true,
            data: {
                result: completeEvent?.result || null,
                status: completeEvent?.status || 'unknown',
                run_id: events[0]?.run_id || null,
                steps: progressEvents.map(e => e.purpose)
            }
        };

    } catch (error) {
        console.error('❌ TinyFish API Error:', error.message);

        // Provide detailed error information
        const errorDetails = {
            success: false,
            error: error.message,
            statusCode: error.response?.status || null,
            details: error.response?.data || null
        };

        // Log for debugging
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }

        throw errorDetails;
    }
};

// Test API connection
const testConnection = async () => {
    if (!verifyApiKey()) {
        return { success: false, error: 'API key not configured' };
    }

    try {
        // Quick test - just verify API accepts request
        const response = await axios.post(
            TINYFISH_API_URL,
            {
                url: 'https://www.google.com',
                goal: 'Open the page. Done.',
                browser_profile: 'stealth'
            },
            {
                headers: {
                    'X-API-Key': process.env.TINYFISH_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 30000, // 30 second timeout for quick test
                responseType: 'text'
            }
        );

        // If we get here, API accepted the request
        const events = parseSSEData(response.data);
        const startedEvent = events.find(e => e.type === 'STARTED');

        if (startedEvent || events.length > 0) {
            return {
                success: true,
                status: 'TinyFish API is connected and working!',
                run_id: startedEvent?.run_id || 'connected'
            };
        }

        return { success: true, status: 'TinyFish API responded successfully' };

    } catch (error) {
        console.error('TinyFish test error:', error.response?.status, error.message);

        // 403 = Invalid API key
        if (error.response?.status === 403) {
            return {
                success: false,
                error: 'Invalid API key (403 Forbidden)',
                hint: 'Your API key is invalid or expired. Please get a new key from agent.tinyfish.ai'
            };
        }

        // 401 = Unauthorized
        if (error.response?.status === 401) {
            return {
                success: false,
                error: 'Unauthorized (401)',
                hint: 'API key authentication failed. Check your key format.'
            };
        }

        // 429 = Rate limited
        if (error.response?.status === 429) {
            return {
                success: false,
                error: 'Rate limited (429)',
                hint: 'Too many requests. Wait a moment and try again.'
            };
        }

        // 402 = Payment required / quota exceeded
        if (error.response?.status === 402) {
            return {
                success: false,
                error: 'Payment required (402)',
                hint: 'Your TinyFish account has no credits. Add credits at agent.tinyfish.ai'
            };
        }

        // Timeout - could be network issue but API is likely working
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            return {
                success: false,
                error: 'Request timeout',
                hint: 'The API is responding slowly. Your API key is likely valid. Try again.'
            };
        }

        return {
            success: false,
            error: error.message,
            statusCode: error.response?.status,
            hint: 'Check your TinyFish account and API key'
        };
    }
};

module.exports = { runAgent, testConnection, verifyApiKey };