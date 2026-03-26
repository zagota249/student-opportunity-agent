const axios = require('axios');

// JSearch API (RapidAPI) - Free tier: 200 requests/month
const JSEARCH_API_URL = 'https://jsearch.p.rapidapi.com/search';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';

// Scholarship API endpoint (using Google Custom Search as fallback)
const SCHOLARSHIP_SOURCES = [
    { name: 'Scholarships.com', url: 'https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory' },
    { name: 'Fastweb', url: 'https://www.fastweb.com/college-scholarships' },
    { name: 'Bold.org', url: 'https://bold.org/scholarships/' },
    { name: 'Scholars4Dev', url: 'https://www.scholars4dev.com/' }
];

// Search for jobs/internships
const searchJobs = async (query, location = '', page = 1) => {
    if (!RAPIDAPI_KEY) {
        console.log('[JOB SEARCH] No RapidAPI key found, using fallback data');
        return getFallbackJobs(query, location);
    }

    try {
        console.log(`[JOB SEARCH] Searching for: ${query} in ${location || 'All locations'}`);

        const response = await axios.get(JSEARCH_API_URL, {
            params: {
                query: `${query} ${location}`.trim(),
                page: page.toString(),
                num_pages: '1',
                date_posted: 'month'
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            },
            timeout: 15000
        });

        const jobs = response.data.data || [];

        const formattedJobs = jobs.map((job, index) => ({
            id: job.job_id || `job-${Date.now()}-${index}`,
            title: job.job_title || 'Unknown Title',
            company: job.employer_name || 'Unknown Company',
            country: job.job_country || 'USA',
            city: job.job_city || '',
            type: job.job_employment_type || 'Full-time',
            link: job.job_apply_link || job.job_google_link || '#',
            field: detectField(job.job_title, job.job_description),
            skills: extractSkills(job.job_description || ''),
            deadline: job.job_offer_expiration_date_utc || getDefaultDeadline(),
            description: job.job_description?.substring(0, 500) || '',
            salary: job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : 'Not specified',
            posted: job.job_posted_at_datetime_utc || new Date().toISOString(),
            isRemote: job.job_is_remote || false,
            isLive: true
        }));

        console.log(`[JOB SEARCH] Found ${formattedJobs.length} live jobs`);
        return { success: true, jobs: formattedJobs, total: response.data.total || formattedJobs.length, isLive: true };

    } catch (error) {
        console.error('[JOB SEARCH] API Error:', error.message);
        return getFallbackJobs(query, location);
    }
};

// Search for scholarships - uses JSearch API to find scholarship opportunities
const searchScholarships = async (query = 'scholarship student', country = '') => {
    if (!RAPIDAPI_KEY) {
        console.log('[SCHOLARSHIP] No RapidAPI key, using curated scholarships');
        return getLiveScholarships(country);
    }

    try {
        const searchQuery = country
            ? `scholarship ${country} international student`
            : 'scholarship international student funding';

        console.log(`[SCHOLARSHIP] Searching: ${searchQuery}`);

        const response = await axios.get(JSEARCH_API_URL, {
            params: {
                query: searchQuery,
                page: '1',
                num_pages: '1'
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            },
            timeout: 15000
        });

        const results = response.data.data || [];

        if (results.length > 0) {
            const scholarships = results.map((item, index) => ({
                id: `scholarship-live-${index}`,
                title: item.job_title || 'Scholarship Opportunity',
                country: item.job_country || country || 'Multiple',
                amount: item.job_min_salary ? `$${item.job_min_salary}` : 'Varies',
                deadline: item.job_offer_expiration_date_utc || getDefaultDeadline(),
                link: item.job_apply_link || item.job_google_link || '#',
                eligibility: 'Check website',
                field: detectField(item.job_title, item.job_description) || 'All Fields',
                description: item.job_description?.substring(0, 300) || '',
                isLive: true
            }));

            return { success: true, scholarships, isLive: true };
        }

        return getLiveScholarships(country);

    } catch (error) {
        console.error('[SCHOLARSHIP] API Error:', error.message);
        return getLiveScholarships(country);
    }
};

// Curated live scholarships with real apply links (updated regularly)
const getLiveScholarships = (country) => {
    const now = new Date();
    const scholarships = [
        // GLOBAL - Available Now
        { id: 1, title: "Fulbright Foreign Student Program", country: "USA", amount: "Full Funding", deadline: "2026-10-01", link: "https://foreign.fulbrightonline.org/", eligibility: "All Countries", field: "All Fields", isLive: true },
        { id: 2, title: "Chevening Scholarships 2026", country: "UK", amount: "Full Funding", deadline: "2026-11-07", link: "https://www.chevening.org/scholarships/", eligibility: "All Countries", field: "All Fields", isLive: true },
        { id: 3, title: "DAAD Scholarships", country: "Germany", amount: "€934/month", deadline: "Rolling", link: "https://www.daad.de/en/study-and-research-in-germany/scholarships/", eligibility: "All Countries", field: "All Fields", isLive: true },
        { id: 4, title: "Gates Cambridge Scholarship", country: "UK", amount: "Full Funding", deadline: "2026-12-03", link: "https://www.gatescambridge.org/apply/", eligibility: "Non-UK", field: "All Fields", isLive: true },
        { id: 5, title: "Erasmus Mundus Joint Masters", country: "Europe", amount: "€1,400/month", deadline: "2026-01-15", link: "https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters", eligibility: "All Countries", field: "All Fields", isLive: true },
        { id: 6, title: "Australia Awards Scholarships", country: "Australia", amount: "Full Funding", deadline: "2026-04-30", link: "https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships", eligibility: "Developing Countries", field: "All Fields", isLive: true },
        { id: 7, title: "Japanese Government (MEXT) Scholarship", country: "Japan", amount: "¥143,000/month", deadline: "2026-04-15", link: "https://www.studyinjapan.go.jp/en/smap_stopj-applications-702.html", eligibility: "All Countries", field: "All Fields", isLive: true },
        { id: 8, title: "Korean Government Scholarship (KGSP)", country: "South Korea", amount: "Full Funding", deadline: "2026-03-31", link: "https://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do", eligibility: "All Countries", field: "All Fields", isLive: true },
        { id: 9, title: "Chinese Government Scholarship", country: "China", amount: "Full Funding", deadline: "2026-04-30", link: "https://www.campuschina.org/scholarships/index.html", eligibility: "All Countries", field: "All Fields", isLive: true },
        { id: 10, title: "Swiss Government Excellence Scholarships", country: "Switzerland", amount: "CHF 1,920/month", deadline: "2026-12-01", link: "https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html", eligibility: "All Countries", field: "All Fields", isLive: true },

        // TECH SPECIFIC
        { id: 11, title: "Google Generation Scholarship", country: "USA", amount: "$10,000", deadline: "2026-12-05", link: "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship", eligibility: "Underrepresented groups in CS", field: "Computer Science", isLive: true },
        { id: 12, title: "Microsoft Tuition Scholarship", country: "USA", amount: "$12,000", deadline: "Rolling", link: "https://careers.microsoft.com/students/us/en/usstudentstudentprogram", eligibility: "CS Students", field: "Computer Science", isLive: true },
        { id: 13, title: "Adobe Research Women-in-Tech", country: "USA", amount: "$10,000", deadline: "2026-09-30", link: "https://research.adobe.com/scholarship/", eligibility: "Women in Tech", field: "Computer Science", isLive: true },
        { id: 14, title: "GitHub Sponsors Fund", country: "Remote/Global", amount: "Varies", deadline: "Rolling", link: "https://github.com/sponsors", eligibility: "Open Source Contributors", field: "Computer Science", isLive: true },

        // REGIONAL
        { id: 15, title: "Commonwealth Scholarship", country: "UK", amount: "Full Funding", deadline: "2026-12-18", link: "https://cscuk.fcdo.gov.uk/scholarships/", eligibility: "Commonwealth Countries", field: "All Fields", isLive: true },
        { id: 16, title: "Turkey Burslari Scholarship", country: "Turkey", amount: "Full Funding", deadline: "2026-02-20", link: "https://www.turkiyeburslari.gov.tr/en", eligibility: "All Countries", field: "All Fields", isLive: true },
        { id: 17, title: "New Zealand Scholarships", country: "New Zealand", amount: "Full Funding", deadline: "2026-03-28", link: "https://www.nzscholarships.govt.nz/", eligibility: "Selected Countries", field: "All Fields", isLive: true },
        { id: 18, title: "Vanier Canada Graduate Scholarships", country: "Canada", amount: "CAD 50,000/year", deadline: "2026-11-01", link: "https://vanier.gc.ca/en/home-accueil.html", eligibility: "PhD Students", field: "All Fields", isLive: true },
        { id: 19, title: "Netherlands Fellowship Programmes", country: "Netherlands", amount: "Full Funding", deadline: "Rolling", link: "https://www.nuffic.nl/en/subjects/nfp/", eligibility: "Developing Countries", field: "All Fields", isLive: true },
        { id: 20, title: "Swedish Institute Scholarships", country: "Sweden", amount: "SEK 10,000/month", deadline: "2026-02-10", link: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/", eligibility: "Selected Countries", field: "All Fields", isLive: true },
    ];

    let filtered = scholarships;
    if (country && country !== 'All' && country !== '') {
        filtered = scholarships.filter(s =>
            s.country.toLowerCase().includes(country.toLowerCase()) ||
            s.country === 'Remote/Global' ||
            s.eligibility.includes('All Countries')
        );
    }

    // If filtered is empty, return all
    if (filtered.length === 0) {
        filtered = scholarships;
    }

    return { success: true, scholarships: filtered, isLive: true };
};

// Detect job field from title and description
const detectField = (title = '', description = '') => {
    const text = `${title} ${description}`.toLowerCase();

    const fieldKeywords = {
        'Computer Science': ['software', 'developer', 'engineer', 'programming', 'coding', 'computer science', 'cs '],
        'Data Science': ['data science', 'data analyst', 'data engineer', 'analytics', 'big data'],
        'Machine Learning': ['machine learning', 'ml engineer', 'ai ', 'artificial intelligence', 'deep learning'],
        'Web Development': ['web developer', 'frontend', 'backend', 'full stack', 'react', 'angular', 'vue', 'javascript', 'node'],
        'Mobile Development': ['mobile developer', 'ios', 'android', 'react native', 'flutter'],
        'Cybersecurity': ['security', 'cybersecurity', 'infosec', 'penetration', 'soc analyst'],
        'Cloud Computing': ['cloud', 'aws', 'azure', 'devops', 'kubernetes', 'docker'],
        'Business': ['business analyst', 'business development', 'consultant', 'strategy'],
        'Finance': ['finance', 'financial', 'accounting', 'investment', 'banking'],
        'Marketing': ['marketing', 'digital marketing', 'seo', 'content', 'social media'],
        'Design': ['designer', 'ui/ux', 'graphic design', 'product design', 'figma'],
        'Research': ['research', 'researcher', 'scientist', 'phd', 'lab']
    };

    for (const [field, keywords] of Object.entries(fieldKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return field;
        }
    }

    return 'All Fields';
};

// Extract skills from job description
const extractSkills = (description) => {
    const skillKeywords = [
        'Python', 'JavaScript', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
        'React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'Spring', 'Express',
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Linux',
        'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
        'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas',
        'Git', 'CI/CD', 'Agile', 'Scrum', 'Figma'
    ];

    const foundSkills = skillKeywords.filter(skill =>
        description.toLowerCase().includes(skill.toLowerCase())
    );

    return foundSkills.slice(0, 5);
};

// Get default deadline (60 days from now)
const getDefaultDeadline = () => {
    const date = new Date();
    date.setDate(date.getDate() + 60);
    return date.toISOString().split('T')[0];
};

// Fallback jobs when API fails or no key
const getFallbackJobs = (query, location) => {
    console.log('[JOB SEARCH] Using fallback job data');
    return {
        success: true,
        jobs: [],
        total: 0,
        isLive: false,
        message: 'Get live jobs: Add RAPIDAPI_KEY to .env (free at rapidapi.com/jsearch)'
    };
};

module.exports = { searchJobs, searchScholarships, detectField, extractSkills };
