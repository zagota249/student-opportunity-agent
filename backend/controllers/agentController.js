const { runAgent, testConnection } = require('../services/tinyfishservices');

// Default Indeed email for the user
const DEFAULT_INDEED_EMAIL = 'zaim08121@gmail.com';

const applyLinkedIn = async (req, res) => {
    try {
        const { jobTitle, location, company, field, skills } = req.body;
        const user = req.user;

        // Validate user has LinkedIn credentials
        if (!user.linkedinEmail || !user.linkedinPassword) {
            return res.status(400).json({
                success: false,
                message: 'LinkedIn credentials not configured. Please update your profile settings.'
            });
        }

        // Get user's profile skills and education for matching
        const userSkills = user.skills?.length ? user.skills.join(', ') : '';
        const userDegree = user.education?.degree || '';
        const userField = user.education?.institution ? `${userDegree} from ${user.education.institution}` : userDegree;

        console.log(`📋 LinkedIn job search: "${jobTitle}" at ${company} in ${location}`);
        console.log(`🎯 Job Field: ${field}`);
        console.log(`👤 User Skills: ${userSkills || 'Not specified'}`);
        console.log(`🎓 User Education: ${userField || 'Not specified'}`);

        const goal = `
            IMPORTANT: Apply ONLY to jobs that match the USER'S RESUME/PROFILE:

            USER PROFILE:
            - Skills: ${userSkills || 'General'}
            - Education: ${userField || 'Student'}

            JOB TO APPLY:
            - Job Title: "${jobTitle}"
            - Company: "${company}"
            - Field: "${field}"
            - Location: "${location}"
            - Required Skills: ${skills?.join(', ') || 'Not specified'}

            STRICT RULES:
            1. Go to linkedin.com
            2. Login with email: ${user.linkedinEmail} and password: ${user.linkedinPassword}
            3. Search for "${jobTitle}" at "${company}" in ${location}
            4. ONLY apply if the job field "${field}" matches user's skills: ${userSkills || 'any'}
            5. DO NOT apply to jobs in unrelated fields
            6. Verify the job requires skills the user has before applying
            7. Use Easy Apply only
            8. Return: job title, company, and whether it matched user's profile
        `;

        const result = await runAgent('https://www.linkedin.com', goal, user);
        res.json({ success: true, data: result });

    } catch (error) {
        console.error('LinkedIn Apply Error:', error);
        res.status(500).json({
            success: false,
            message: error.error || error.message || 'Failed to run LinkedIn automation',
            error: error.details || null
        });
    }
};

const applyIndeed = async (req, res) => {
    try {
        const { jobTitle, location, company, field, skills } = req.body;
        const user = req.user;

        // Use user's Indeed email or default to zaim08121@gmail.com
        const indeedEmail = user.indeedEmail || DEFAULT_INDEED_EMAIL;

        // Indeed only requires email, no password needed
        if (!indeedEmail) {
            return res.status(400).json({
                success: false,
                message: 'Indeed email not configured. Please update your profile settings.'
            });
        }

        // Get user's profile skills and education for matching
        const userSkills = user.skills?.length ? user.skills.join(', ') : '';
        const userDegree = user.education?.degree || '';
        const userField = user.education?.institution ? `${userDegree} from ${user.education.institution}` : userDegree;
        const userName = user.name || 'Applicant';

        console.log(`📋 Indeed job search: "${jobTitle}" at ${company} in ${location}`);
        console.log(`🎯 Job Field: ${field}`);
        console.log(`👤 User Skills: ${userSkills || 'Not specified'}`);
        console.log(`🎓 User Education: ${userField || 'Not specified'}`);
        console.log(`📧 Using Indeed email: ${indeedEmail}`);

        const goal = `
            IMPORTANT: Apply to jobs on Indeed WITHOUT LOGGING IN (guest apply mode).
            Indeed requires OTP for login, so DO NOT attempt to login.

            USER PROFILE:
            - Name: ${userName}
            - Email: ${indeedEmail}
            - Skills: ${userSkills || 'General'}
            - Education: ${userField || 'Student'}

            JOB TO APPLY:
            - Job Title: "${jobTitle}"
            - Company: "${company}"
            - Field: "${field}"
            - Location: "${location}"
            - Required Skills: ${skills?.join(', ') || 'Not specified'}

            STEPS:
            1. Go to indeed.com
            2. Search for "${jobTitle}" at "${company}" in ${location}
            3. Find the job posting that matches
            4. Click "Apply" or "Apply now" button
            5. If asked to sign in, look for "Continue as guest" or "Apply without account" option
            6. Fill in the application form:
               - Name: ${userName}
               - Email: ${indeedEmail}
               - Fill other required fields as needed
            7. ONLY apply if the job field "${field}" matches user's skills: ${userSkills || 'any'}
            8. DO NOT apply to jobs in unrelated fields
            9. Submit the application
            10. Return: job title, company, confirmation status
        `;

        const result = await runAgent('https://www.indeed.com', goal, user);

        console.log('✅ Indeed automation completed:', result);
        res.json({ success: true, data: result });

    } catch (error) {
        console.error('❌ Indeed Apply Error:', error);

        // Handle different error formats
        const errorMessage = error.error || error.message || 'Failed to run Indeed automation';
        const errorDetails = error.details || error.statusCode || null;

        res.status(500).json({
            success: false,
            message: errorMessage,
            error: errorDetails
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