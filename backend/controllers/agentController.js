const { runAgent, testConnection } = require('../services/tinyfishservices');

// Default email for the user
const DEFAULT_EMAIL = 'zaim08121@gmail.com';

const applyLinkedIn = async (req, res) => {
    try {
        const { jobTitle, location, company, field, skills, linkedinEmail, linkedinPassword, linkedinOTP, userSkills, userName } = req.body;
        const user = req.user || {};

        // Use credentials from request body or fall back to user profile
        const email = linkedinEmail || user.linkedinEmail;
        const password = linkedinPassword || user.linkedinPassword;
        const otpCode = linkedinOTP || '';

        // Validate credentials
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'LinkedIn credentials required. Please add email AND password in Settings.'
            });
        }

        // Get user's skills
        const skillsList = userSkills?.length ? userSkills.join(', ') : (user.skills?.length ? user.skills.join(', ') : '');
        const name = userName || user.name || 'Applicant';

        console.log(`[LINKEDIN] Applying to: "${jobTitle}" at ${company}`);
        console.log(`[LINKEDIN] Using email: ${email}`);
        console.log(`[LINKEDIN] OTP provided: ${otpCode ? 'Yes' : 'No'}`);

        const goal = `
            APPLY TO JOB ON LINKEDIN:

            USER CREDENTIALS:
            - Email: ${email}
            - Password: ${password}
            ${otpCode ? `- 2FA/OTP Code: ${otpCode} (USE THIS IF LINKEDIN ASKS FOR VERIFICATION CODE)` : ''}

            USER PROFILE:
            - Name: ${name}
            - Skills: ${skillsList || 'General'}

            JOB TO APPLY:
            - Job Title: "${jobTitle}"
            - Company: "${company}"
            - Field: "${field}"
            - Location: "${location}"
            - Required Skills: ${skills?.join(', ') || 'Not specified'}

            STEPS:
            1. Go to linkedin.com
            2. Login with email: ${email} and password: ${password}
            3. IF LinkedIn asks for verification/2FA code: ${otpCode ? `Enter this code: ${otpCode}` : 'STOP and return error saying OTP required'}
            4. Search for "${jobTitle}" at "${company}" in ${location}
            5. Find the matching job posting
            6. Click "Easy Apply" button
            7. Fill in any required fields with user info
            8. Submit the application
            9. Confirm application was successful
            10. Return: job title, company, and confirmation status
        `;

        const result = await runAgent('https://www.linkedin.com', goal, { ...user, linkedinEmail: email, linkedinPassword: password });

        console.log(`[LINKEDIN] Application completed for ${jobTitle} at ${company}`);
        res.json({ success: true, data: result });

    } catch (error) {
        console.error('[LINKEDIN] Error:', error);
        res.status(500).json({
            success: false,
            message: error.error || error.message || 'Failed to run LinkedIn automation',
            error: error.details || null
        });
    }
};

const applyIndeed = async (req, res) => {
    try {
        const { jobTitle, location, company, field, skills, indeedEmail, userSkills, userName } = req.body;
        const user = req.user || {};

        // Use email from request body or fall back to default
        const email = indeedEmail || user.indeedEmail || DEFAULT_EMAIL;
        const name = userName || user.name || 'Applicant';
        const skillsList = userSkills?.length ? userSkills.join(', ') : (user.skills?.length ? user.skills.join(', ') : '');

        console.log(`[INDEED] Applying to: "${jobTitle}" at ${company}`);
        console.log(`[INDEED] Using email: ${email}`);

        const goal = `
            APPLY TO JOB ON INDEED (Guest Mode - No Login Required):

            USER PROFILE:
            - Name: ${name}
            - Email: ${email}
            - Skills: ${skillsList || 'General'}

            JOB TO APPLY:
            - Job Title: "${jobTitle}"
            - Company: "${company}"
            - Field: "${field}"
            - Location: "${location}"
            - Required Skills: ${skills?.join(', ') || 'Not specified'}

            STEPS:
            1. Go to indeed.com
            2. Search for "${jobTitle}" at "${company}" in ${location}
            3. Find the matching job posting
            4. Click "Apply" or "Apply now" button
            5. If asked to sign in, look for "Continue as guest" option
            6. Fill in the application form:
               - Name: ${name}
               - Email: ${email}
            7. Submit the application
            8. IMPORTANT: After successful application, confirmation will be sent to ${email}
            9. Return: job title, company, and confirmation status
        `;

        const result = await runAgent('https://www.indeed.com', goal, { ...user, indeedEmail: email });

        console.log(`[INDEED] Application completed for ${jobTitle} at ${company}`);
        res.json({ success: true, data: result });

    } catch (error) {
        console.error('[INDEED] Error:', error);
        res.status(500).json({
            success: false,
            message: error.error || error.message || 'Failed to run Indeed automation',
            error: error.details || null
        });
    }
};

// Test TinyFish API connection
const testApiConnection = async (req, res) => {
    try {
        const result = await testConnection();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'API connection test failed',
            error: error.message
        });
    }
};

module.exports = { applyLinkedIn, applyIndeed, testApiConnection };