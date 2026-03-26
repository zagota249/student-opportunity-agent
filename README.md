# Student Opportunity Agent

AI-powered platform to find and auto-apply to internships & scholarships worldwide.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## Features

- **60+ Internships** - Google, Microsoft, Meta, Amazon, OpenAI, and more
- **20+ Scholarships** - Fulbright, Chevening, DAAD, Erasmus Mundus
- **AI Auto-Apply** - Automatically applies via LinkedIn & Indeed
- **Multiple Fields** - Data Science, AI, Web Dev, Finance, Marketing, Engineering
- **Global Coverage** - USA, UK, Germany, Canada, Japan, Pakistan, India, UAE

## Tech Stack

| Backend | Frontend | Database | AI |
|---------|----------|----------|-----|
| Node.js | React 18 | MongoDB | TinyFish AI |
| Express | Material-UI | Atlas | Browser Automation |
| JWT Auth | Axios | | |

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/zagota249/student-opportunity-agent.git
cd student-opportunity-agent

# Backend
cd backend
npm install

# Frontend
cd ../front
npm install
```

### 2. Configure Environment

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secret_key
TINYFISH_API_KEY=sk-tinyfish-your_key
RAPIDAPI_KEY=your_rapidapi_key (optional)
```

### 3. Run

```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd front
npm start
```

Open http://localhost:3000

## API Endpoints

### Auth
```
POST /api/auth/register    - Register user
POST /api/auth/login       - Login user
GET  /api/auth/profile     - Get profile
PUT  /api/auth/profile     - Update profile
```

### Jobs & Scholarships
```
GET /api/jobs/search?query=intern&location=USA    - Search jobs
GET /api/jobs/scholarships?country=UK             - Get scholarships
```

### Auto-Apply Agent
```
POST /api/agent/linkedin   - Auto-apply via LinkedIn
POST /api/agent/indeed     - Auto-apply via Indeed
GET  /api/agent/test-connection - Test TinyFish API
```

## Project Structure

```
student-opportunity-agent/
├── backend/
│   ├── controllers/      # Auth & Agent controllers
│   ├── middleware/       # Auth & Rate limiting
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── services/         # TinyFish & Job search
│   └── server.js
├── front/
│   ├── src/
│   │   ├── components/   # Dashboard UI
│   │   └── services/     # API calls
│   └── package.json
└── README.md
```

## Getting API Keys

### TinyFish AI (Required for Auto-Apply)
1. Go to [agent.tinyfish.ai](https://agent.tinyfish.ai)
2. Sign up and get API key
3. Add to `.env`: `TINYFISH_API_KEY=sk-tinyfish-xxxxx`

### RapidAPI (Optional - Live Job Search)
1. Go to [rapidapi.com/jsearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
2. Sign up (free: 200 requests/month)
3. Add to `.env`: `RAPIDAPI_KEY=your_key`

## How It Works

### Auto-Apply Flow
1. User clicks "Auto (LinkedIn)" on a job
2. Backend sends request to TinyFish AI
3. TinyFish opens real browser
4. Logs into LinkedIn with user credentials
5. Searches for the job
6. Clicks Easy Apply and fills form
7. Submits application
8. LinkedIn sends confirmation email to user

### LinkedIn 2FA
If LinkedIn sends a 6-digit code:
1. Go to Settings tab
2. Enter code in "LinkedIn OTP" field
3. Save and retry immediately

## Internship Fields

| Field | Companies |
|-------|-----------|
| Data Science | Microsoft, Jazz, Emirates |
| AI/ML | OpenAI, DeepMind, Flipkart, Toyota |
| Web Development | Airbnb, Spotify, Discord, Notion |
| Finance | Goldman Sachs, DBS Bank, PayPal |
| Marketing | Unilever |
| Engineering | Siemens, Samsung, Huawei, Airbus |
| Cybersecurity | IBM |
| Cloud | Salesforce, SAP, Cloudflare, AWS |
| DevOps | Netflix, GitLab, Docker |

## Scholarship Countries

USA, UK, Germany, Canada, Australia, Japan, South Korea, China, Switzerland, Netherlands, Sweden, Turkey, New Zealand, Europe (Erasmus)

## Rate Limits

- General API: 100 requests / 15 min
- Job Search: 10 searches / min
- Auto-Apply: 20 applications / hour

## Screenshots

### Dashboard
![Dashboard](docs/dashboard.png)

### Auto-Apply Agent
![Agent](docs/agent.png)

## Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push (`git push origin feature/NewFeature`)
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE)

## Contact

- GitHub: [@zagota249](https://github.com/zagota249)
- Email: zaim08121@gmail.com

---

Made with React, Node.js & TinyFish AI
