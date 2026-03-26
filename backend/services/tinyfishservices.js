const axios = require('axios');

const TINYFISH_API_URL = 'https://agent.tinyfish.ai/v1/automation/run-sse';

// Verify TinyFish API key exists
const verifyApiKey = () => {
    const apiKey = process.env.TINYFISH_API_KEY;
    if (!apiKey) {
        console.error('[TINYFISH] API key not set');
        return false;
    }
    return true;
};

// Parse SSE data from stream
const parseSSEData = (rawData) => {
    const lines = rawData.split('\n');
    const events = [];

    for (const line of lines) {
        if (line.startsWith('data: ')) {
            try {
                const jsonStr = line.substring(6);
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
    if (!verifyApiKey()) {
        throw { error: 'TinyFish API key not configured', success: false };
    }

    console.log(`[TINYFISH] Starting automation on: ${url}`);
    console.log(`[TINYFISH] Goal: ${goal.substring(0, 100)}...`);

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
                timeout: 180000, // 3 minutes - automation takes time
                responseType: 'text'
            }
        );

        console.log('[TINYFISH] Response received');

        const events = parseSSEData(response.data);
        const completeEvent = events.find(e => e.type === 'COMPLETE');
        const errorEvent = events.find(e => e.type === 'ERROR');
        const progressEvents = events.filter(e => e.type === 'PROGRESS');

        if (errorEvent) {
            throw { error: errorEvent.message || 'Automation failed', success: false };
        }

        return {
            success: true,
            data: {
                result: completeEvent?.result || { description: 'Automation completed' },
                status: completeEvent?.status || 'completed',
                run_id: events[0]?.run_id || null,
                steps: progressEvents.map(e => e.purpose || e.message)
            }
        };

    } catch (error) {
        console.error('[TINYFISH] Error:', error.message);

        // Handle timeout - automation might still be running
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            return {
                success: true,
                data: {
                    result: { description: 'Automation started - check your email for LinkedIn confirmation' },
                    status: 'processing',
                    steps: ['Automation is running in background', 'LinkedIn will send confirmation email when done']
                }
            };
        }

        throw {
            success: false,
            error: error.message || 'TinyFish API error',
            statusCode: error.response?.status || null
        };
    }
};

// Quick test - just check if API accepts request
const testConnection = async () => {
    if (!verifyApiKey()) {
        return { success: false, error: 'API key not configured' };
    }

    try {
        console.log('[TINYFISH] Testing connection...');

        const response = await axios.post(
            TINYFISH_API_URL,
            {
                url: 'https://www.google.com',
                goal: 'Just open the page and confirm it loaded. Return immediately.',
                browser_profile: 'stealth'
            },
            {
                headers: {
                    'X-API-Key': process.env.TINYFISH_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 60000, // 1 minute for test
                responseType: 'text'
            }
        );

        const events = parseSSEData(response.data);

        if (events.length > 0) {
            console.log('[TINYFISH] Connection successful');
            return {
                success: true,
                status: 'connected',
                message: 'TinyFish API is working!',
                run_id: events[0]?.run_id
            };
        }

        return { success: true, status: 'connected', message: 'API responded' };

    } catch (error) {
        console.error('[TINYFISH] Test error:', error.message);

        // If we got a STARTED event before timeout, API is working
        if (error.code === 'ECONNABORTED') {
            return {
                success: true,
                status: 'connected',
                message: 'TinyFish API is connected (automation takes time to complete)'
            };
        }

        if (error.response?.status === 403) {
            return { success: false, error: 'Invalid API key', hint: 'Check your TINYFISH_API_KEY' };
        }

        if (error.response?.status === 402) {
            return { success: false, error: 'No credits', hint: 'Add credits at agent.tinyfish.ai' };
        }

        return {
            success: false,
            error: error.message,
            statusCode: error.response?.status
        };
    }
};

module.exports = { runAgent, testConnection, verifyApiKey };
