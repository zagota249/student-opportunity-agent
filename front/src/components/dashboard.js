import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Grid, Card, CardContent, Typography, Box, Button, Paper,
    Tabs, Tab, TextField, InputAdornment, Select, MenuItem, FormControl,
    InputLabel, Chip, Divider, Alert, CircularProgress, Checkbox, ListItemText, OutlinedInput,
    Skeleton
} from '@mui/material';
import {
    Work, School, Speed, AutoAwesome, Search, LocationOn,
    OpenInNew, CloudUpload, Save, Dashboard as DashboardIcon,
    Settings, Explore, Category, Refresh
} from '@mui/icons-material';
import { applyLinkedIn, applyIndeed, getProfile, testTinyFishConnection, searchJobs, searchScholarships } from '../services/tinyfishapi';
import api from '../services/tinyfishapi';

// Fallback internship data (used when API is unavailable) - Real companies with real career links
const fallbackInternships = [
    // USA - Top Tech Companies
    { id: 1, title: "Software Engineering Intern", company: "Google", country: "USA", type: "Remote", link: "https://careers.google.com/jobs/results/?q=intern", field: "Computer Science", skills: ["Python", "JavaScript", "Go"], deadline: "2026-04-15" },
    { id: 2, title: "Data Science Intern", company: "Microsoft", country: "USA", type: "Hybrid", link: "https://careers.microsoft.com/us/en/search-results?keywords=intern", field: "Data Science", skills: ["Python", "ML", "Azure"], deadline: "2026-04-20" },
    { id: 3, title: "Frontend Developer Intern", company: "Meta", country: "USA", type: "Remote", link: "https://www.metacareers.com/jobs?q=intern", field: "Computer Science", skills: ["React", "JavaScript"], deadline: "2026-04-25" },
    { id: 4, title: "Backend Developer Intern", company: "Amazon", country: "USA", type: "On-site", link: "https://www.amazon.jobs/en/search?base_query=intern", field: "Computer Science", skills: ["Java", "AWS"], deadline: "2026-05-01" },
    { id: 5, title: "ML Engineer Intern", company: "OpenAI", country: "USA", type: "Remote", link: "https://openai.com/careers", field: "Artificial Intelligence", skills: ["Python", "PyTorch"], deadline: "2026-05-10" },
    { id: 6, title: "DevOps Intern", company: "Netflix", country: "USA", type: "Remote", link: "https://jobs.netflix.com/search?q=intern", field: "Computer Science", skills: ["Docker", "Kubernetes"], deadline: "2026-05-15" },
    { id: 7, title: "Cybersecurity Intern", company: "IBM", country: "USA", type: "Remote", link: "https://www.ibm.com/careers", field: "Cybersecurity", skills: ["Security", "Python"], deadline: "2026-05-25" },
    { id: 8, title: "iOS Developer Intern", company: "Apple", country: "USA", type: "On-site", link: "https://jobs.apple.com/en-us/search?search=intern", field: "Mobile Development", skills: ["Swift", "iOS"], deadline: "2026-06-01" },
    { id: 9, title: "Cloud Engineer Intern", company: "Salesforce", country: "USA", type: "Hybrid", link: "https://salesforce.wd1.myworkdayjobs.com/Futureforce_Internships", field: "Cloud Computing", skills: ["AWS", "Salesforce"], deadline: "2026-05-20" },
    { id: 10, title: "Full Stack Intern", company: "Uber", country: "USA", type: "Hybrid", link: "https://www.uber.com/us/en/careers/", field: "Full Stack Development", skills: ["Node.js", "React"], deadline: "2026-05-25" },
    // UK
    { id: 11, title: "AI Research Intern", company: "DeepMind", country: "UK", type: "On-site", link: "https://deepmind.google/about/careers/", field: "Artificial Intelligence", skills: ["Python", "TensorFlow"], deadline: "2026-06-20" },
    { id: 12, title: "Finance Tech Intern", company: "Goldman Sachs", country: "UK", type: "On-site", link: "https://www.goldmansachs.com/careers/students/programs/", field: "Finance", skills: ["Python", "SQL"], deadline: "2026-06-05" },
    { id: 13, title: "Business Analyst Intern", company: "Deloitte", country: "UK", type: "Hybrid", link: "https://apply.deloitte.com/careers", field: "Business", skills: ["Excel", "SQL"], deadline: "2026-05-30" },
    { id: 14, title: "Marketing Intern", company: "Unilever", country: "UK", type: "On-site", link: "https://careers.unilever.com/", field: "Marketing", skills: ["Marketing", "Analytics"], deadline: "2026-06-01" },
    // Germany
    { id: 15, title: "Cloud Intern", company: "SAP", country: "Germany", type: "Hybrid", link: "https://jobs.sap.com/search?q=intern", field: "Cloud Computing", skills: ["Cloud", "Java"], deadline: "2026-07-01" },
    { id: 16, title: "Automotive Software Intern", company: "BMW", country: "Germany", type: "On-site", link: "https://www.bmwgroup.jobs/en.html", field: "Software Engineering", skills: ["C++", "Embedded"], deadline: "2026-07-20" },
    { id: 17, title: "Engineering Intern", company: "Siemens", country: "Germany", type: "Hybrid", link: "https://jobs.siemens.com/careers", field: "Engineering", skills: ["Python", "CAD"], deadline: "2026-06-15" },
    // Canada
    { id: 18, title: "E-commerce Intern", company: "Shopify", country: "Canada", type: "Remote", link: "https://www.shopify.com/careers", field: "Full Stack Development", skills: ["Ruby", "React"], deadline: "2026-06-30" },
    { id: 19, title: "Software Developer Intern", company: "RBC", country: "Canada", type: "Hybrid", link: "https://jobs.rbc.com/ca/en/students", field: "Computer Science", skills: ["Java", "Python"], deadline: "2026-05-15" },
    // Sweden
    { id: 20, title: "Music Tech Intern", company: "Spotify", country: "Sweden", type: "Hybrid", link: "https://www.lifeatspotify.com/jobs", field: "Computer Science", skills: ["Python", "Java"], deadline: "2026-05-20" },
    // Singapore
    { id: 21, title: "Ride-Hailing Tech Intern", company: "Grab", country: "Singapore", type: "Remote", link: "https://grab.careers/", field: "Computer Science", skills: ["Go", "Microservices"], deadline: "2026-05-20" },
    { id: 22, title: "FinTech Intern", company: "DBS Bank", country: "Singapore", type: "Hybrid", link: "https://www.dbs.com/careers/students", field: "Finance", skills: ["Python", "SQL"], deadline: "2026-06-01" },
    // UAE
    { id: 23, title: "Software Engineer Intern", company: "Careem", country: "UAE", type: "Hybrid", link: "https://www.careem.com/en-ae/careers/", field: "Computer Science", skills: ["Python", "Mobile"], deadline: "2026-05-01" },
    { id: 24, title: "Data Analyst Intern", company: "Emirates", country: "UAE", type: "On-site", link: "https://www.emiratesgroupcareers.com/students/", field: "Data Science", skills: ["SQL", "Python"], deadline: "2026-06-15" },
    // Pakistan
    { id: 25, title: "Software Developer Intern", company: "Systems Limited", country: "Pakistan", type: "On-site", link: "https://www.systemsltd.com/careers", field: "Computer Science", skills: ["Java", ".NET"], deadline: "2026-05-15" },
    { id: 26, title: "Web Developer Intern", company: "Netsol Technologies", country: "Pakistan", type: "Hybrid", link: "https://www.netsoltech.com/careers", field: "Web Development", skills: ["JavaScript", "React"], deadline: "2026-06-01" },
    { id: 27, title: "Data Science Intern", company: "Jazz", country: "Pakistan", type: "On-site", link: "https://www.jazz.com.pk/careers/", field: "Data Science", skills: ["Python", "ML"], deadline: "2026-05-30" },
    // India
    { id: 28, title: "Software Intern", company: "Infosys", country: "India", type: "Hybrid", link: "https://www.infosys.com/careers/", field: "Computer Science", skills: ["Java", "Python"], deadline: "2026-05-01" },
    { id: 29, title: "Tech Intern", company: "TCS", country: "India", type: "On-site", link: "https://www.tcs.com/careers", field: "Computer Science", skills: ["Java", "Cloud"], deadline: "2026-06-01" },
    { id: 30, title: "AI Intern", company: "Flipkart", country: "India", type: "Hybrid", link: "https://www.flipkartcareers.com/", field: "Artificial Intelligence", skills: ["Python", "ML"], deadline: "2026-05-15" },
    // China
    { id: 31, title: "AI Research Intern", company: "Alibaba", country: "China", type: "On-site", link: "https://talent.alibaba.com/", field: "Artificial Intelligence", skills: ["Python", "Deep Learning"], deadline: "2026-07-01" },
    { id: 32, title: "5G Research Intern", company: "Huawei", country: "China", type: "On-site", link: "https://career.huawei.com/", field: "Engineering", skills: ["C++", "5G"], deadline: "2026-06-15" },
    // Japan
    { id: 33, title: "Robotics Intern", company: "Sony", country: "Japan", type: "On-site", link: "https://www.sony.com/en/SonyInfo/Jobs/", field: "Robotics", skills: ["Python", "ROS"], deadline: "2026-07-10" },
    { id: 34, title: "Automotive AI Intern", company: "Toyota", country: "Japan", type: "On-site", link: "https://global.toyota/en/careers/", field: "Artificial Intelligence", skills: ["Python", "CV"], deadline: "2026-08-01" },
    // South Korea
    { id: 35, title: "Electronics Intern", company: "Samsung", country: "South Korea", type: "On-site", link: "https://www.samsung.com/sec/aboutsamsung/careers/", field: "Engineering", skills: ["C++", "Electronics"], deadline: "2026-08-01" },
    // Australia
    { id: 36, title: "Software QA Intern", company: "Atlassian", country: "Australia", type: "Remote", link: "https://www.atlassian.com/company/careers", field: "Computer Science", skills: ["Testing", "Automation"], deadline: "2026-07-05" },
    // France
    { id: 37, title: "Aerospace Intern", company: "Airbus", country: "France", type: "On-site", link: "https://www.airbus.com/en/careers", field: "Aerospace Engineering", skills: ["Python", "MATLAB"], deadline: "2026-06-01" },
    // Netherlands
    { id: 38, title: "Travel Tech Intern", company: "Booking.com", country: "Netherlands", type: "Hybrid", link: "https://careers.booking.com/", field: "Computer Science", skills: ["Python", "ML"], deadline: "2026-06-01" },
    // Remote/Global
    { id: 39, title: "Open Source Intern", company: "GitHub", country: "Remote/Global", type: "Remote", link: "https://github.com/about/careers", field: "Computer Science", skills: ["Git", "TypeScript"], deadline: "2026-05-01" },
    { id: 40, title: "DevRel Intern", company: "Twilio", country: "Remote/Global", type: "Remote", link: "https://www.twilio.com/company/jobs", field: "Computer Science", skills: ["APIs", "Python"], deadline: "2026-06-15" },
    { id: 41, title: "Remote Developer Intern", company: "GitLab", country: "Remote/Global", type: "Remote", link: "https://about.gitlab.com/jobs/", field: "DevOps", skills: ["Ruby", "DevOps"], deadline: "2026-05-20" },
    { id: 42, title: "Backend Intern", company: "Stripe", country: "Remote/Global", type: "Remote", link: "https://stripe.com/jobs", field: "Backend Development", skills: ["Ruby", "Go"], deadline: "2026-06-10" },
    { id: 43, title: "Infrastructure Intern", company: "Cloudflare", country: "Remote/Global", type: "Remote", link: "https://www.cloudflare.com/careers/", field: "Cloud Computing", skills: ["Go", "Rust"], deadline: "2026-06-20" },
    { id: 44, title: "Developer Tools Intern", company: "Vercel", country: "Remote/Global", type: "Remote", link: "https://vercel.com/careers", field: "Frontend Development", skills: ["React", "Next.js"], deadline: "2026-05-25" },
    { id: 45, title: "Database Intern", company: "MongoDB", country: "Remote/Global", type: "Remote", link: "https://www.mongodb.com/careers", field: "Database", skills: ["MongoDB", "Node.js"], deadline: "2026-06-30" },
    // WEB DEVELOPMENT - JavaScript/TypeScript/Node.js jobs
    { id: 46, title: "JavaScript Developer Intern", company: "Airbnb", country: "USA", type: "Remote", link: "https://careers.airbnb.com/", field: "Web Development", skills: ["JavaScript", "React", "Node.js"], deadline: "2026-05-15" },
    { id: 47, title: "Full Stack Developer Intern", company: "Spotify", country: "Sweden", type: "Remote", link: "https://www.lifeatspotify.com/jobs", field: "Web Development", skills: ["TypeScript", "Node.js", "React"], deadline: "2026-05-20" },
    { id: 48, title: "Node.js Backend Intern", company: "PayPal", country: "USA", type: "Hybrid", link: "https://careers.pypl.com/home/", field: "Backend Development", skills: ["Node.js", "Express.js", "MongoDB"], deadline: "2026-06-01" },
    { id: 49, title: "MERN Stack Intern", company: "Toptal", country: "Remote/Global", type: "Remote", link: "https://www.toptal.com/careers", field: "Full Stack Development", skills: ["MongoDB", "Express.js", "React", "Node.js"], deadline: "2026-05-30" },
    { id: 50, title: "React Developer Intern", company: "Discord", country: "USA", type: "Remote", link: "https://discord.com/careers", field: "Frontend Development", skills: ["React", "TypeScript", "JavaScript"], deadline: "2026-06-10" },
    { id: 51, title: "TypeScript Developer Intern", company: "Slack", country: "USA", type: "Remote", link: "https://slack.com/careers", field: "Web Development", skills: ["TypeScript", "Node.js", "React"], deadline: "2026-05-25" },
    { id: 52, title: "Frontend Engineer Intern", company: "Figma", country: "USA", type: "Remote", link: "https://www.figma.com/careers/", field: "Frontend Development", skills: ["TypeScript", "React", "Figma"], deadline: "2026-06-15" },
    { id: 53, title: "Web Developer Intern", company: "Notion", country: "USA", type: "Remote", link: "https://www.notion.so/careers", field: "Web Development", skills: ["JavaScript", "TypeScript", "React"], deadline: "2026-05-20" },
    { id: 54, title: "Express.js Developer Intern", company: "Twitch", country: "USA", type: "Remote", link: "https://www.twitch.tv/jobs", field: "Backend Development", skills: ["Node.js", "Express.js", "MongoDB"], deadline: "2026-06-05" },
    { id: 55, title: "Full Stack JS Intern", company: "Netlify", country: "Remote/Global", type: "Remote", link: "https://www.netlify.com/careers/", field: "Full Stack Development", skills: ["JavaScript", "Node.js", "React"], deadline: "2026-05-28" },
    { id: 56, title: "Docker/DevOps Intern", company: "Docker Inc", country: "USA", type: "Remote", link: "https://www.docker.com/careers/", field: "DevOps", skills: ["Docker", "Node.js", "JavaScript"], deadline: "2026-06-20" },
    { id: 57, title: "UI/UX Developer Intern", company: "Adobe", country: "USA", type: "Hybrid", link: "https://adobe.wd5.myworkdayjobs.com/external_experienced", field: "Web Development", skills: ["JavaScript", "React", "Figma"], deadline: "2026-05-15" },
    { id: 58, title: "Next.js Developer Intern", company: "HashiCorp", country: "Remote/Global", type: "Remote", link: "https://www.hashicorp.com/careers", field: "Web Development", skills: ["Next.js", "TypeScript", "Node.js"], deadline: "2026-06-10" },
    { id: 59, title: "Backend Node Intern", company: "LinkedIn", country: "USA", type: "Hybrid", link: "https://careers.linkedin.com/", field: "Backend Development", skills: ["Node.js", "Express.js", "MongoDB"], deadline: "2026-05-30" },
    { id: 60, title: "JavaScript Engineer Intern", company: "Dropbox", country: "USA", type: "Remote", link: "https://www.dropbox.com/jobs", field: "Web Development", skills: ["JavaScript", "TypeScript", "React"], deadline: "2026-06-01" },
];

// Extended scholarships data with direct apply links
const scholarshipsData = [
    // USA
    { id: 1, title: "Fulbright Scholarship", country: "USA", amount: "$50,000", deadline: "2026-05-01", link: "https://foreign.fulbrightonline.org/apply", eligibility: "All Countries", field: "All Fields" },
    { id: 2, title: "Google PhD Fellowship", country: "USA", amount: "$50,000", deadline: "2026-04-15", link: "https://research.google/outreach/phd-fellowship/", eligibility: "PhD Students", field: "Computer Science" },
    { id: 3, title: "Microsoft Research PhD", country: "USA", amount: "$42,000/year", deadline: "2026-09-30", link: "https://www.microsoft.com/en-us/research/academic-program/phd-fellowship/", eligibility: "PhD Students", field: "Computer Science" },
    { id: 4, title: "Meta Fellowship", country: "USA", amount: "$42,000/year", deadline: "2026-10-01", link: "https://research.facebook.com/fellowship/", eligibility: "PhD Students", field: "Artificial Intelligence" },
    { id: 5, title: "Hubert H. Humphrey Fellowship", country: "USA", amount: "Full Funding", deadline: "2026-09-01", link: "https://www.humphreyfellowship.org/how-to-apply/", eligibility: "Mid-Career Professionals", field: "All Fields" },
    // UK
    { id: 6, title: "Chevening Scholarship", country: "UK", amount: "Full Funding", deadline: "2026-11-01", link: "https://www.chevening.org/scholarships/apply/", eligibility: "All Countries", field: "All Fields" },
    { id: 7, title: "Gates Cambridge", country: "UK", amount: "Full Funding", deadline: "2026-12-01", link: "https://www.gatescambridge.org/apply/", eligibility: "Non-UK", field: "All Fields" },
    { id: 8, title: "Rhodes Scholarship", country: "UK", amount: "Full Funding", deadline: "2026-10-01", link: "https://www.rhodeshouse.ox.ac.uk/scholarships/apply/", eligibility: "Select Countries", field: "All Fields" },
    { id: 9, title: "Commonwealth Scholarship", country: "UK", amount: "Full Funding", deadline: "2026-12-18", link: "https://cscuk.fcdo.gov.uk/apply/", eligibility: "Commonwealth Countries", field: "All Fields" },
    { id: 10, title: "GREAT Scholarships", country: "UK", amount: "£10,000", deadline: "2026-05-30", link: "https://study-uk.britishcouncil.org/scholarships/great-scholarships", eligibility: "Select Countries", field: "All Fields" },
    // Germany
    { id: 11, title: "DAAD Scholarship", country: "Germany", amount: "€850/month", deadline: "2026-10-15", link: "https://www.daad.de/en/study-and-research-in-germany/scholarships/", eligibility: "All Countries", field: "All Fields" },
    { id: 12, title: "Heinrich Böll Foundation", country: "Germany", amount: "€850/month", deadline: "2026-03-01", link: "https://www.boell.de/en/scholarships", eligibility: "All Countries", field: "All Fields" },
    { id: 13, title: "Deutschlandstipendium", country: "Germany", amount: "€300/month", deadline: "Rolling", link: "https://www.deutschlandstipendium.de/en/", eligibility: "All Countries", field: "All Fields" },
    // Australia
    { id: 14, title: "Australia Awards", country: "Australia", amount: "Full Funding", deadline: "2026-04-30", link: "https://www.australiaawards.gov.au/how-to-apply", eligibility: "Developing Countries", field: "All Fields" },
    { id: 15, title: "Destination Australia", country: "Australia", amount: "$15,000/year", deadline: "2026-06-30", link: "https://www.education.gov.au/destination-australia", eligibility: "All Countries", field: "All Fields" },
    // Europe
    { id: 16, title: "Erasmus Mundus", country: "Europe", amount: "€1,400/month", deadline: "2026-01-15", link: "https://erasmus-plus.ec.europa.eu/opportunities/individuals/students", eligibility: "All Countries", field: "All Fields" },
    // Canada
    { id: 17, title: "Vanier Canada Graduate", country: "Canada", amount: "$50,000/year", deadline: "2026-11-01", link: "https://vanier.gc.ca/en/apply-demande.html", eligibility: "All Countries", field: "Research" },
    { id: 18, title: "Trudeau Foundation", country: "Canada", amount: "$60,000/year", deadline: "2026-12-09", link: "https://www.trudeaufoundation.ca/scholarships", eligibility: "PhD Students", field: "Social Sciences" },
    // Switzerland
    { id: 19, title: "Swiss Government Excellence", country: "Switzerland", amount: "Full Funding", deadline: "2026-12-15", link: "https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html", eligibility: "All Countries", field: "Research" },
    { id: 20, title: "ETH Zurich Excellence", country: "Switzerland", amount: "CHF 12,000/semester", deadline: "2026-12-15", link: "https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html", eligibility: "Masters Students", field: "All Fields" },
    // Japan
    { id: 21, title: "Japanese MEXT", country: "Japan", amount: "Full Funding", deadline: "2026-04-15", link: "https://www.studyinjapan.go.jp/en/smap_stopj-applications-702.html", eligibility: "All Countries", field: "All Fields" },
    { id: 22, title: "JASSO Scholarship", country: "Japan", amount: "¥48,000/month", deadline: "Rolling", link: "https://www.jasso.go.jp/en/ryugaku/scholarship_j/", eligibility: "All Countries", field: "All Fields" },
    // Sweden
    { id: 23, title: "Swedish Institute", country: "Sweden", amount: "Full Funding", deadline: "2026-02-10", link: "https://si.se/en/apply/scholarships/", eligibility: "Select Countries", field: "All Fields" },
    // South Korea
    { id: 24, title: "Korean Government Scholarship (KGSP)", country: "South Korea", amount: "Full Funding", deadline: "2026-03-15", link: "https://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do", eligibility: "All Countries", field: "All Fields" },
    // Netherlands
    { id: 25, title: "Netherlands Fellowship (NFP)", country: "Netherlands", amount: "Full Funding", deadline: "2026-05-01", link: "https://www.nuffic.nl/en/subjects/orange-knowledge-programme", eligibility: "Select Countries", field: "All Fields" },
    { id: 26, title: "Holland Scholarship", country: "Netherlands", amount: "€5,000", deadline: "2026-02-01", link: "https://www.studyinholland.nl/finances/holland-scholarship", eligibility: "Non-EU", field: "All Fields" },
    // New Zealand
    { id: 27, title: "New Zealand Scholarship", country: "New Zealand", amount: "Full Funding", deadline: "2026-03-28", link: "https://www.nzscholarships.govt.nz/how-to-apply/", eligibility: "Developing Countries", field: "All Fields" },
    // China
    { id: 28, title: "Schwarzman Scholars", country: "China", amount: "Full Funding", deadline: "2026-09-15", link: "https://www.schwarzmanscholars.org/admissions/application/", eligibility: "All Countries", field: "Leadership" },
    { id: 29, title: "Chinese Government Scholarship (CSC)", country: "China", amount: "Full Funding", deadline: "2026-04-30", link: "https://www.campuschina.org/scholarships/index.html", eligibility: "All Countries", field: "All Fields" },
    // Turkey
    { id: 30, title: "Türkiye Scholarships", country: "Turkey", amount: "Full Funding", deadline: "2026-02-20", link: "https://turkiyeburslari.gov.tr/en/", eligibility: "All Countries", field: "All Fields" },
    // Malaysia
    { id: 31, title: "Malaysian Government Scholarship", country: "Malaysia", amount: "Full Funding", deadline: "2026-04-30", link: "https://biasiswa.mohe.gov.my/", eligibility: "Developing Countries", field: "All Fields" },
    // Singapore
    { id: 32, title: "Singapore International Graduate Award", country: "Singapore", amount: "$2,500/month", deadline: "Rolling", link: "https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa", eligibility: "All Countries", field: "Research" },
    // UAE
    { id: 33, title: "UAE Government Scholarship", country: "UAE", amount: "Full Funding", deadline: "2026-06-30", link: "https://www.moe.gov.ae/en/education/highereducation/pages/scholarships.aspx", eligibility: "All Countries", field: "All Fields" },
    // Pakistan (Local)
    { id: 34, title: "HEC Need Based Scholarship", country: "Pakistan", amount: "Full Tuition", deadline: "Rolling", link: "https://www.hec.gov.pk/english/scholarshipsgrants/Pages/default.aspx", eligibility: "Pakistani Students", field: "All Fields" },
    { id: 35, title: "Punjab Education Endowment Fund (PEEF)", country: "Pakistan", amount: "Full Tuition", deadline: "Rolling", link: "https://www.peef.org.pk/", eligibility: "Pakistani Students", field: "All Fields" },
    // India
    { id: 36, title: "Tata Scholarship (Cornell)", country: "USA", amount: "Full Funding", deadline: "2026-01-02", link: "https://finaid.cornell.edu/types-aid/grants-scholarships/tata-scholarship", eligibility: "Indian Students", field: "All Fields" },
    // Multiple Countries
    { id: 37, title: "Aga Khan Foundation", country: "Multiple", amount: "50% Grant", deadline: "2026-03-31", link: "https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme", eligibility: "Select Countries", field: "All Fields" },
    { id: 38, title: "Rotary Peace Fellowship", country: "Multiple", amount: "Full Funding", deadline: "2026-05-15", link: "https://www.rotary.org/en/our-programs/peace-fellowships", eligibility: "All Countries", field: "Peace Studies" },
    { id: 39, title: "Joint Japan World Bank Scholarship", country: "Multiple", amount: "Full Funding", deadline: "2026-04-30", link: "https://www.worldbank.org/en/programs/scholarships", eligibility: "Developing Countries", field: "Development" },
    { id: 40, title: "Islamic Development Bank Scholarship", country: "Multiple", amount: "Full Funding", deadline: "2026-03-31", link: "https://www.isdb.org/scholarships", eligibility: "OIC Member Countries", field: "All Fields" },
];

// All countries list (excluding Israel) - Complete World List
const countries = [
    'All',
    // North America
    'USA', 'Canada', 'Mexico', 'Guatemala', 'Cuba', 'Haiti', 'Dominican Republic', 'Honduras', 'Nicaragua', 'El Salvador', 'Costa Rica', 'Panama', 'Jamaica', 'Trinidad and Tobago', 'Bahamas', 'Barbados', 'Belize',
    // Europe
    'UK', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland', 'Portugal', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Greece', 'Ukraine', 'Russia', 'Turkey', 'Bulgaria', 'Croatia', 'Serbia', 'Slovakia', 'Slovenia', 'Lithuania', 'Latvia', 'Estonia', 'Cyprus', 'Luxembourg', 'Malta', 'Iceland', 'Albania', 'North Macedonia', 'Bosnia and Herzegovina', 'Montenegro', 'Moldova', 'Belarus', 'Kosovo',
    // Asia
    'China', 'Japan', 'South Korea', 'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'Taiwan', 'Hong Kong', 'Myanmar', 'Cambodia', 'Laos', 'Mongolia', 'Brunei', 'Bhutan', 'Maldives', 'Afghanistan', 'Uzbekistan', 'Kazakhstan', 'Turkmenistan', 'Tajikistan', 'Kyrgyzstan', 'Azerbaijan', 'Georgia', 'Armenia',
    // Middle East
    'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Egypt', 'Iran', 'Iraq', 'Syria', 'Yemen', 'Palestine',
    // Africa
    'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia', 'Tanzania', 'Morocco', 'Algeria', 'Tunisia', 'Egypt', 'Libya', 'Sudan', 'Uganda', 'Rwanda', 'Senegal', 'Ivory Coast', 'Cameroon', 'Zimbabwe', 'Zambia', 'Botswana', 'Namibia', 'Mozambique', 'Angola', 'Democratic Republic of Congo', 'Madagascar', 'Mauritius', 'Malawi', 'Mali', 'Niger', 'Burkina Faso', 'Benin', 'Togo', 'Sierra Leone', 'Liberia', 'Gambia', 'Guinea', 'Gabon', 'Equatorial Guinea', 'Republic of Congo', 'Central African Republic', 'Chad', 'Eritrea', 'Djibouti', 'Somalia', 'South Sudan', 'Burundi', 'Lesotho', 'Eswatini', 'Comoros', 'Cape Verde', 'Sao Tome and Principe', 'Seychelles',
    // Oceania
    'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon Islands',
    // South America
    'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname',
    // Special Options
    'Europe', 'Multiple', 'Remote/Global'
];
const fields = [
    'All Fields',
    // Computer Science & Technology (Expanded)
    'Computer Science', 'Software Engineering', 'Web Development', 'Mobile Development', 'Frontend Development', 'Backend Development', 'Full Stack Development',
    'Data Science', 'Data Analytics', 'Data Engineering', 'Machine Learning', 'Artificial Intelligence', 'Deep Learning', 'Natural Language Processing',
    'Cybersecurity', 'Information Security', 'Network Security', 'Cloud Computing', 'DevOps', 'System Administration',
    'Database Administration', 'Game Development', 'Embedded Systems', 'Internet of Things', 'Blockchain', 'Quantum Computing',
    'Computer Networks', 'Operating Systems', 'Computer Graphics', 'Human Computer Interaction', 'Robotics', 'Computer Vision',
    // Engineering
    'Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Aerospace Engineering',
    'Biomedical Engineering', 'Industrial Engineering', 'Environmental Engineering', 'Materials Engineering',
    // Business & Finance
    'Business', 'Finance', 'Accounting', 'Marketing', 'Management', 'Economics', 'Entrepreneurship', 'Human Resources', 'Supply Chain Management',
    // Sciences
    'Medicine', 'Healthcare', 'Pharmacy', 'Biotechnology', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Statistics',
    // Arts & Humanities
    'Design', 'UI/UX Design', 'Graphic Design', 'Architecture', 'Law', 'Education', 'Psychology', 'Journalism', 'Media Studies',
    // Other
    'Research', 'Leadership', 'Peace Studies', 'Environmental Science', 'Agriculture', 'Social Sciences', 'Project Management'
];

// Skills list for multi-select dropdown
const skillsList = [
    'Python', 'JavaScript', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
    'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'Express.js', 'Next.js',
    'HTML', 'CSS', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'Git',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Data Analysis',
    'REST APIs', 'Microservices', 'System Design', 'Agile', 'Scrum', 'Linux', 'DevOps',
    'Figma', 'UI/UX', 'Adobe XD', 'Photoshop', 'Illustrator',
    'Excel', 'Power BI', 'Tableau', 'R', 'MATLAB', 'Statistics',
    'Communication', 'Leadership', 'Problem Solving', 'Team Work', 'Project Management'
];

function Dashboard() {
    const [mainTab, setMainTab] = useState(0);
    const [subTab, setSubTab] = useState(0);
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('All');
    const [scholarshipCountry, setScholarshipCountry] = useState('All'); // Separate filter for scholarships
    const [field, setField] = useState('All Fields');
    const [applying, setApplying] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [resume, setResume] = useState(null);
    const [resumeName, setResumeName] = useState('');
    const [logs, setLogs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [apiStatus, setApiStatus] = useState(null); // null, 'checking', 'connected', 'error'

    // Live job fetching states
    const [liveJobs, setLiveJobs] = useState([]);
    const [liveScholarships, setLiveScholarships] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(false);
    const [jobsError, setJobsError] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [totalJobs, setTotalJobs] = useState(0);
    const [isLiveData, setIsLiveData] = useState(false);
    const [lastSearch, setLastSearch] = useState({ query: '', location: '' });

    // Load applied jobs from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        setAppliedJobs(saved);
    }, []);

    // Load saved credentials from localStorage
    const savedCredentials = JSON.parse(localStorage.getItem('jobAgentCredentials') || '{}');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        skills: [],
        linkedinEmail: savedCredentials.linkedinEmail || 'zaim08121@gmail.com',
        linkedinPassword: savedCredentials.linkedinPassword || '1122@Ptcl1122',
        linkedinOTP: '',
        indeedEmail: savedCredentials.indeedEmail || 'zaim08121@gmail.com',
        indeedPassword: '',
        education: { degree: '', institution: '', yearOfGraduation: '' }
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // LinkedIn requires BOTH email and password
    const hasLinkedIn = (user.linkedinEmail || formData.linkedinEmail) && formData.linkedinPassword;
    // Indeed only requires email (no password needed)
    const hasIndeed = !!(user.indeedEmail || formData.indeedEmail);

    // Test TinyFish API connection
    const testApiConnection = async () => {
        setApiStatus('checking');
        setLogs(prev => [...prev, '[TESTING] TinyFish API connection...']);
        try {
            const response = await testTinyFishConnection();
            if (response.data.success) {
                setApiStatus('connected');
                setLogs(prev => [...prev, '[SUCCESS] TinyFish API is connected and ready!']);
            } else {
                setApiStatus('error');
                setLogs(prev => [...prev, `[ERROR] API Error: ${response.data.error || 'Connection failed'}`]);
            }
        } catch (error) {
            setApiStatus('error');
            setLogs(prev => [...prev, `[ERROR] Cannot connect to TinyFish API: ${error.message}`]);
        }
    };

    // Fetch live jobs from API
    const fetchLiveJobs = useCallback(async (searchQuery = '', location = '', page = 1) => {
        setJobsLoading(true);
        setJobsError(null);

        try {
            const query = searchQuery || (field !== 'All Fields' ? field : 'intern');
            const loc = location || (country !== 'All' ? country : '');

            console.log(`[SEARCH] Fetching jobs: query="${query}", location="${loc}"`);

            // Try to fetch from API first
            const response = await searchJobs(query, loc, page);

            if (response.data.success && response.data.jobs && response.data.jobs.length > 0) {
                const jobs = response.data.jobs;

                // Transform API jobs to match our format
                const formattedJobs = jobs.map((job, index) => ({
                    id: job.id || `live-${Date.now()}-${index}`,
                    title: job.title,
                    company: job.company,
                    country: job.country || 'USA',
                    city: job.city || '',
                    type: job.isRemote ? 'Remote' : (job.type || 'On-site'),
                    link: job.link,
                    field: job.field || 'General',
                    skills: job.skills || [],
                    deadline: job.deadline,
                    description: job.description,
                    salary: job.salary,
                    posted: job.posted,
                    isLive: true
                }));

                setLiveJobs(formattedJobs);
                setTotalJobs(response.data.total || formattedJobs.length);
                setIsLiveData(true);
                setLastSearch({ query, location: loc });
            } else {
                // Use fallback data - filter based on search
                const filteredFallback = fallbackInternships.filter(job => {
                    const matchesQuery = !query ||
                        job.title.toLowerCase().includes(query.toLowerCase()) ||
                        job.company.toLowerCase().includes(query.toLowerCase()) ||
                        job.field.toLowerCase().includes(query.toLowerCase()) ||
                        job.skills.some(s => s.toLowerCase().includes(query.toLowerCase()));
                    const matchesLocation = !loc ||
                        job.country.toLowerCase().includes(loc.toLowerCase());
                    return matchesQuery && matchesLocation;
                });

                setLiveJobs(filteredFallback);
                setTotalJobs(filteredFallback.length);
                setIsLiveData(false);
                setLastSearch({ query, location: loc });
            }
        } catch (error) {
            console.log('[SEARCH] Using fallback data');
            // On error, use fallback data
            setLiveJobs(fallbackInternships);
            setTotalJobs(fallbackInternships.length);
            setIsLiveData(false);
            setJobsError(null); // Don't show error - we have data
        } finally {
            setJobsLoading(false);
        }
    }, [field, country]);

    // Fetch live scholarships
    const fetchLiveScholarships = useCallback(async (targetCountry = '') => {
        try {
            const response = await searchScholarships(targetCountry);
            if (response.data.success && response.data.scholarships) {
                setLiveScholarships(response.data.scholarships);
            }
        } catch (error) {
            console.error('[SCHOLARSHIPS] Error:', error);
        }
    }, []);

    // Initial data load - intentionally only runs once on mount
    useEffect(() => {
        fetchData();
        // Initial live job fetch
        fetchLiveJobs('intern', '', 1);
        fetchLiveScholarships(country !== 'All' ? country : '');

        const savedResume = localStorage.getItem('userResume');
        const savedResumeName = localStorage.getItem('userResumeName');
        if (savedResume) {
            setResume(savedResume);
            setResumeName(savedResumeName || 'Resume uploaded');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refetch jobs when search/filters change (with debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (mainTab === 1 && subTab === 0) { // Only on Opportunities > Internships tab
                const query = search || (field !== 'All Fields' ? field : 'intern');
                const loc = country !== 'All' ? country : '';
                fetchLiveJobs(query, loc, currentPage);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [search, country, field, currentPage, mainTab, subTab, fetchLiveJobs]);

    // Refetch scholarships when country changes
    useEffect(() => {
        fetchLiveScholarships(country !== 'All' ? country : '');
    }, [country, fetchLiveScholarships]);

    const fetchData = async () => {
        try {
            const profileRes = await getProfile().catch(() => ({ data: { user: {} } }));

            const profileUser = profileRes.data?.user || {};

            // Update localStorage with latest profile data
            if (profileUser.id || profileUser._id) {
                const updatedUser = {
                    ...user,
                    ...profileUser,
                    id: profileUser.id || profileUser._id
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            // Load saved credentials from localStorage (don't overwrite if they exist)
            const savedCreds = JSON.parse(localStorage.getItem('jobAgentCredentials') || '{}');

            setFormData(prev => ({
                name: profileUser.name || user.name || prev.name || '',
                email: profileUser.email || user.email || prev.email || '',
                skills: profileUser.skills || prev.skills || [],
                linkedinEmail: savedCreds.linkedinEmail || profileUser.linkedinEmail || prev.linkedinEmail || 'zaim08121@gmail.com',
                linkedinPassword: savedCreds.linkedinPassword || prev.linkedinPassword || '1122@Ptcl1122',
                indeedEmail: savedCreds.indeedEmail || profileUser.indeedEmail || prev.indeedEmail || 'zaim08121@gmail.com',
                indeedPassword: prev.indeedPassword || '',
                education: profileUser.education || prev.education || { degree: '', institution: '', yearOfGraduation: '' }
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Combine live jobs with fallback data
    const allInternships = isLiveData && liveJobs.length > 0
        ? liveJobs
        : fallbackInternships;

    // Filter internships by search, country, and field ONLY (show ALL fields)
    const filteredInternships = allInternships.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.company.toLowerCase().includes(search.toLowerCase());
        const matchesCountry = country === 'All' || item.country === country;
        const matchesField = field === 'All Fields' || item.field === field;
        return matchesSearch && matchesCountry && matchesField;
    });

    // Use live scholarships if available, otherwise use static data
    const allScholarships = liveScholarships.length > 0 ? liveScholarships : scholarshipsData;

    // Filter scholarships by search and scholarshipCountry (separate filter)
    const filteredScholarships = allScholarships.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchesCountry = scholarshipCountry === 'All' ||
            item.country === scholarshipCountry ||
            item.country === 'Remote/Global' ||
            item.country === 'Europe' ||
            (item.eligibility && item.eligibility.includes('All Countries'));
        return matchesSearch && matchesCountry;
    });

    // Calculate real-time stats (after allScholarships is defined)
    const stats = {
        totalApplied: appliedJobs.length,
        scholarshipsFound: allScholarships.length,
        hoursSaved: Math.round(appliedJobs.length * 1.5),
        liveJobs: isLiveData ? liveJobs.length : 0
    };

    // Save applied job to localStorage
    const saveAppliedJob = (item, status) => {
        const newApplied = [...appliedJobs, { ...item, status, appliedAt: new Date().toISOString() }];
        setAppliedJobs(newApplied);
        localStorage.setItem('appliedJobs', JSON.stringify(newApplied));
    };

    const handleAutoApply = async (item, platform) => {
        setApplying(item.id);

        // Check if job matches user's skills
        const userSkills = formData.skills || [];
        const jobSkills = item.skills || [];
        const matchingSkills = userSkills.filter(skill =>
            jobSkills.some(js => js.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(js.toLowerCase()))
        );

        setLogs(prev => [...prev, `[START] ${platform.toUpperCase()} automation for "${item.title}"...`]);
        setLogs(prev => [...prev, `[JOB] Title: ${item.title} | Company: ${item.company} | Field: ${item.field}`]);
        setLogs(prev => [...prev, `[JOB] Required Skills: ${jobSkills.join(', ')}`]);
        setLogs(prev => [...prev, `[USER] Your Skills: ${userSkills.join(', ')}`]);
        setLogs(prev => [...prev, `[MATCH] Matching Skills: ${matchingSkills.length > 0 ? matchingSkills.join(', ') : 'None found'}`]);

        // BLOCK: Don't apply if NO skills match AND user has skills set
        if (userSkills.length > 0 && matchingSkills.length === 0) {
            setLogs(prev => [...prev, '[BLOCKED] This job does not match your skills. Skipping...']);
            setMessage({ type: 'warning', text: `Skipped "${item.title}" - no matching skills. Add more skills in Settings or find jobs that match yours.` });
            setApplying(null);
            return;
        }

        // Check credentials first
        if (platform === 'linkedin' && !hasLinkedIn) {
            setLogs(prev => [...prev, '[ERROR] LinkedIn credentials not configured. Go to Settings tab to add them.']);
            setMessage({ type: 'error', text: 'Please add your LinkedIn email AND password in Settings first.' });
            setApplying(null);
            return;
        }
        if (platform === 'indeed' && !hasIndeed) {
            setLogs(prev => [...prev, '[ERROR] Indeed email not configured. Go to Settings tab to add it.']);
            setMessage({ type: 'error', text: 'Please add your Indeed email in Settings first.' });
            setApplying(null);
            return;
        }

        try {
            setLogs(prev => [...prev, '[APPLYING] Starting browser automation...']);
            setLogs(prev => [...prev, '[INFO] This takes 1-3 minutes - DO NOT close this page']);
            setLogs(prev => [...prev, '[INFO] TinyFish is opening a real browser and applying for you...']);
            let response;
            if (platform === 'linkedin') {
                setLogs(prev => [...prev, '[LINKEDIN] Connecting to LinkedIn...']);
                response = await applyLinkedIn({
                    jobTitle: item.title,
                    location: item.country,
                    company: item.company,
                    field: item.field,
                    skills: item.skills,
                    linkedinEmail: formData.linkedinEmail,
                    linkedinPassword: formData.linkedinPassword,
                    linkedinOTP: formData.linkedinOTP || '',
                    userSkills: formData.skills,
                    userName: formData.name
                });
            } else {
                setLogs(prev => [...prev, '[INDEED] Connecting to Indeed...']);
                response = await applyIndeed({
                    jobTitle: item.title,
                    location: item.country,
                    company: item.company,
                    field: item.field,
                    skills: item.skills,
                    indeedEmail: formData.indeedEmail || 'zaim08121@gmail.com',
                    userSkills: formData.skills,
                    userName: formData.name
                });
            }

            if (response.data.success) {
                const result = response.data.data;
                setLogs(prev => [...prev, `[SUCCESS] Applied to ${item.title} at ${item.company}!`]);
                setLogs(prev => [...prev, `[FIELD CONFIRMATION] Applied to field: ${item.field}`]);

                // Show agent steps if available
                if (result?.data?.steps?.length) {
                    result.data.steps.forEach(step => {
                        setLogs(prev => [...prev, `   -> ${step}`]);
                    });
                }

                // Show result description if available
                if (result?.data?.result?.description) {
                    setLogs(prev => [...prev, `[RESULT] ${result.data.result.description}`]);
                }

                setMessage({ type: 'success', text: `Applied to ${item.title} at ${item.company} successfully!` });
                saveAppliedJob({ ...item, matchingSkills }, 'success');
            } else {
                setLogs(prev => [...prev, `[WARNING] Application may have issues: ${response.data.message || 'Check manually'}`]);
                saveAppliedJob(item, 'pending');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            setLogs(prev => [...prev, `[ERROR] Auto-apply failed: ${errorMsg}`]);
            setMessage({ type: 'error', text: `Auto-apply failed: ${errorMsg}. Try manual apply.` });
            saveAppliedJob(item, 'failed');
        } finally {
            setApplying(null);
        }
    };

    const handleManualApply = (item) => {
        window.open(item.link, '_blank');
        // Track manual application
        const alreadyApplied = appliedJobs.some(j => j.id === item.id);
        if (!alreadyApplied) {
            saveAppliedJob(item, 'manual');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('education.')) {
            const fieldName = name.split('.')[1];
            setFormData(prev => ({ ...prev, education: { ...prev.education, [fieldName]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size must be less than 5MB' });
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                localStorage.setItem('userResume', event.target.result);
                localStorage.setItem('userResumeName', file.name);
                setResume(event.target.result);
                setResumeName(file.name);
                setMessage({ type: 'success', text: 'Resume uploaded!' });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        // Validate required fields
        if (!formData.name || formData.name.trim() === '') {
            setMessage({ type: 'error', text: 'Name is required for job applications.' });
            return;
        }
        if (!formData.skills || formData.skills.length === 0) {
            setMessage({ type: 'error', text: 'Skills are required for job matching. Select at least one skill.' });
            return;
        }
        if (!formData.education?.degree || formData.education.degree.trim() === '') {
            setMessage({ type: 'error', text: 'Degree/Field of Study is required for job applications.' });
            return;
        }
        if (!formData.education?.institution || formData.education.institution.trim() === '') {
            setMessage({ type: 'error', text: 'Institution/University name is required for job applications.' });
            return;
        }
        if (!formData.indeedEmail && !formData.linkedinEmail) {
            setMessage({ type: 'error', text: 'Please add at least one platform email (Indeed or LinkedIn) for auto-apply.' });
            return;
        }

        setSaving(true);
        try {
            // Save credentials to localStorage (passwords never go to backend)
            const credentials = {
                linkedinEmail: formData.linkedinEmail,
                linkedinPassword: formData.linkedinPassword,
                indeedEmail: formData.indeedEmail
            };
            localStorage.setItem('jobAgentCredentials', JSON.stringify(credentials));

            const updateData = {
                name: formData.name,
                skills: formData.skills,
                education: formData.education,
                linkedinEmail: formData.linkedinEmail,
                indeedEmail: formData.indeedEmail
            };
            // Don't send passwords to backend API

            await api.put('/auth/profile', updateData);
            const updatedUser = { ...user, name: formData.name, skills: formData.skills, linkedinEmail: formData.linkedinEmail, indeedEmail: formData.indeedEmail };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setMessage({ type: 'success', text: 'Profile saved! Your credentials are stored locally.' });
        } catch (error) {
            // Even if API fails, save credentials locally
            const credentials = {
                linkedinEmail: formData.linkedinEmail,
                linkedinPassword: formData.linkedinPassword,
                indeedEmail: formData.indeedEmail
            };
            localStorage.setItem('jobAgentCredentials', JSON.stringify(credentials));
            setMessage({ type: 'warning', text: 'Profile saved locally. Backend sync failed but you can still use auto-apply.' });
        } finally {
            setSaving(false);
        }
    };

    const resetFilters = () => {
        setSearch('');
        setCountry('All');
        setField('All Fields');
    };

    const statsCards = [
        { label: 'Applications', value: stats.totalApplied, icon: <Work />, color: '#6366f1' },
        { label: 'Scholarships', value: stats.scholarshipsFound, icon: <School />, color: '#10b981' },
        { label: 'Hours Saved', value: stats.hoursSaved, icon: <Speed />, color: '#ef4444' },
    ];

    if (loading) {
        return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Container>;
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
            {/* RGB Animation Keyframes */}
            <style>
                {`
                    @keyframes rgbBorder {
                        0% { border-color: #ff0000; }
                        16% { border-color: #ff8000; }
                        33% { border-color: #ffff00; }
                        50% { border-color: #00ff00; }
                        66% { border-color: #0080ff; }
                        83% { border-color: #8000ff; }
                        100% { border-color: #ff0000; }
                    }
                    @keyframes rgbText {
                        0% { color: #ff0000; }
                        16% { color: #ff8000; }
                        33% { color: #ffff00; }
                        50% { color: #00ff00; }
                        66% { color: #0080ff; }
                        83% { color: #8000ff; }
                        100% { color: #ff0000; }
                    }
                    @keyframes rgbGlow {
                        0% { box-shadow: 0 0 20px #ff0000, inset 0 0 20px rgba(255,0,0,0.1); }
                        16% { box-shadow: 0 0 20px #ff8000, inset 0 0 20px rgba(255,128,0,0.1); }
                        33% { box-shadow: 0 0 20px #ffff00, inset 0 0 20px rgba(255,255,0,0.1); }
                        50% { box-shadow: 0 0 20px #00ff00, inset 0 0 20px rgba(0,255,0,0.1); }
                        66% { box-shadow: 0 0 20px #0080ff, inset 0 0 20px rgba(0,128,255,0.1); }
                        83% { box-shadow: 0 0 20px #8000ff, inset 0 0 20px rgba(128,0,255,0.1); }
                        100% { box-shadow: 0 0 20px #ff0000, inset 0 0 20px rgba(255,0,0,0.1); }
                    }
                    .rgb-name {
                        animation: rgbText 3s linear infinite;
                        font-weight: 800;
                        text-shadow: 0 0 10px currentColor;
                    }
                `}
            </style>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    color: 'white',
                    borderRadius: 3,
                    border: '3px solid',
                    animation: 'rgbBorder 3s linear infinite, rgbGlow 3s linear infinite'
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Welcome back, <span className="rgb-name">{user.name || 'Student'}</span>!
                </Typography>
                <Typography sx={{ opacity: 0.9 }}>Your AI-powered opportunity finder - Everything in one place</Typography>
            </Paper>

            {/* Stats */}
            <Grid container spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
                {statsCards.map((stat, i) => (
                    <Grid item xs={6} md={4} key={i}>
                        <Card elevation={2} sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                                <Box sx={{ bgcolor: stat.color + '20', p: 1, borderRadius: 2, mr: 2 }}>
                                    {React.cloneElement(stat.icon, { sx: { color: stat.color } })}
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                                    <Typography variant="body2" color="textSecondary">{stat.label}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Main Tabs */}
            <Paper sx={{ borderRadius: 2 }}>
                <Tabs value={mainTab} onChange={(e, v) => setMainTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }} variant="scrollable" scrollButtons="auto">
                    <Tab icon={<DashboardIcon />} label="Overview" iconPosition="start" />
                    <Tab icon={<Explore />} label="Opportunities" iconPosition="start" />
                    <Tab icon={<AutoAwesome />} label="Auto Agent" iconPosition="start" />
                    <Tab icon={<Settings />} label="Settings" iconPosition="start" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {/* Overview Tab */}
                    {mainTab === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Opportunities</Typography>
                                    {isLiveData && (
                                        <Chip label="LIVE" size="small" color="success" sx={{ ml: 1 }} />
                                    )}
                                </Box>
                                <Grid container spacing={2}>
                                    {allInternships.slice(0, 4).map(item => (
                                        <Grid item xs={12} sm={6} key={item.id}>
                                            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                                <CardContent>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                                                    <Typography variant="body2" color="textSecondary">{item.company} • {item.country}</Typography>
                                                    <Chip label={item.field} size="small" sx={{ mt: 1, bgcolor: '#f0f0ff' }} />
                                                    <Box sx={{ mt: 1 }}>
                                                        <Button size="small" onClick={() => setMainTab(1)}>View Details</Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Quick Actions</Typography>
                                <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={() => setMainTab(1)}>Browse All Opportunities</Button>
                                <Button fullWidth variant="outlined" sx={{ mb: 1 }} onClick={() => setMainTab(2)}>Start Auto Agent</Button>
                                <Button fullWidth variant="outlined" onClick={() => setMainTab(3)}>Update Profile</Button>

                                <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Available Now</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {allInternships.length} Internships • {allScholarships.length} Scholarships
                                    {isLiveData && ' (Live)'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    From {countries.length - 1} countries
                                </Typography>
                            </Grid>
                        </Grid>
                    )}

                    {/* Opportunities Tab */}
                    {mainTab === 1 && (
                        <>
                            {/* Live Data Indicator */}
                            {isLiveData && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    Showing live job data from multiple sources (LinkedIn, Indeed, Glassdoor).
                                    {lastSearch.query && ` Search: "${lastSearch.query}"`}
                                    {lastSearch.location && ` in ${lastSearch.location}`}
                                </Alert>
                            )}

                            {jobsError && (
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    {jobsError}
                                </Alert>
                            )}

                            {/* Filters */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                                <TextField placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} size="small" sx={{ minWidth: 200 }}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <InputLabel>Country</InputLabel>
                                    <Select value={country} onChange={(e) => setCountry(e.target.value)} label="Country">
                                        {countries.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" sx={{ minWidth: 180 }}>
                                    <InputLabel>Field of Interest</InputLabel>
                                    <Select value={field} onChange={(e) => setField(e.target.value)} label="Field of Interest">
                                        {fields.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Button variant="text" size="small" onClick={resetFilters}>Reset Filters</Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={jobsLoading ? <CircularProgress size={16} /> : <Refresh />}
                                    onClick={() => fetchLiveJobs(search || 'intern', country !== 'All' ? country : '', 1)}
                                    disabled={jobsLoading}
                                >
                                    {jobsLoading ? 'Loading...' : 'Refresh Jobs'}
                                </Button>
                            </Box>

                            {/* Active Filters Display */}
                            {(country !== 'All' || field !== 'All Fields') && (
                                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="body2" sx={{ mr: 1 }}>Active filters:</Typography>
                                    {country !== 'All' && <Chip label={`Country: ${country}`} size="small" onDelete={() => setCountry('All')} />}
                                    {field !== 'All Fields' && <Chip label={`Field: ${field}`} size="small" onDelete={() => setField('All Fields')} />}
                                </Box>
                            )}

                            <Tabs value={subTab} onChange={(e, v) => setSubTab(v)} sx={{ mb: 2 }}>
                                <Tab label={`Internships (${filteredInternships.length})${isLiveData ? ' - LIVE' : ''}`} />
                                <Tab label={`Scholarships (${filteredScholarships.length})`} />
                            </Tabs>

                            {/* Loading skeleton */}
                            {jobsLoading && subTab === 0 && (
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    {[1, 2, 3].map(i => (
                                        <Grid item xs={12} md={6} lg={4} key={i}>
                                            <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                                                <Skeleton variant="text" width="60%" />
                                                <Skeleton variant="text" width="40%" />
                                                <Skeleton variant="rectangular" height={60} sx={{ mt: 1 }} />
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* No results message */}
                            {!jobsLoading && ((subTab === 0 && filteredInternships.length === 0) || (subTab === 1 && filteredScholarships.length === 0)) && (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    No {subTab === 0 ? 'internships' : 'scholarships'} found for your filters. Try adjusting your search criteria.
                                </Alert>
                            )}

                            {subTab === 0 && !jobsLoading && (
                                <Grid container spacing={2}>
                                    {filteredInternships.map(item => (
                                        <Grid item xs={12} md={6} lg={4} key={item.id}>
                                            <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', border: item.isLive ? '2px solid #10b981' : undefined }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                            {item.isLive && <Chip label="LIVE" size="small" color="success" sx={{ height: 20 }} />}
                                                            <Chip label={item.type} size="small" />
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="body2" color="textSecondary">{item.company}</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                                                        <LocationOn fontSize="small" color="action" />
                                                        <Typography variant="body2">{item.country}{item.city ? `, ${item.city}` : ''}</Typography>
                                                        <Category fontSize="small" color="action" sx={{ ml: 1 }} />
                                                        <Typography variant="body2">{item.field}</Typography>
                                                    </Box>
                                                    {item.salary && item.salary !== 'Not specified' && (
                                                        <Typography variant="body2" sx={{ mt: 0.5, color: '#10b981' }}>{item.salary}</Typography>
                                                    )}
                                                    <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                        {(item.skills || []).map(s => <Chip key={s} label={s} size="small" sx={{ bgcolor: '#f0f0ff' }} />)}
                                                    </Box>
                                                    <Typography variant="caption" sx={{ color: '#f59e0b', display: 'block', mt: 1 }}>Deadline: {item.deadline}</Typography>
                                                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {hasLinkedIn && (
                                                            <Button size="small" variant="contained" color="primary" onClick={() => handleAutoApply(item, 'linkedin')} disabled={applying === item.id}>
                                                                {applying === item.id ? 'Applying...' : 'Auto (LinkedIn)'}
                                                            </Button>
                                                        )}
                                                        {hasIndeed && (
                                                            <Button size="small" variant="contained" color="secondary" onClick={() => handleAutoApply(item, 'indeed')} disabled={applying === item.id}>
                                                                {applying === item.id ? 'Applying...' : 'Auto (Indeed)'}
                                                            </Button>
                                                        )}
                                                        <Button size="small" variant="outlined" startIcon={<OpenInNew />} onClick={() => handleManualApply(item)}>
                                                            Manual Apply
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {subTab === 1 && (
                                <>
                                    {/* Scholarship Country Filter */}
                                    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <FormControl size="small" sx={{ minWidth: 200 }}>
                                            <InputLabel>Filter by Country</InputLabel>
                                            <Select
                                                value={scholarshipCountry}
                                                label="Filter by Country"
                                                onChange={(e) => setScholarshipCountry(e.target.value)}
                                            >
                                                <MenuItem value="All">All Countries</MenuItem>
                                                <MenuItem value="USA">USA</MenuItem>
                                                <MenuItem value="UK">UK</MenuItem>
                                                <MenuItem value="Germany">Germany</MenuItem>
                                                <MenuItem value="Canada">Canada</MenuItem>
                                                <MenuItem value="Australia">Australia</MenuItem>
                                                <MenuItem value="Europe">Europe</MenuItem>
                                                <MenuItem value="Japan">Japan</MenuItem>
                                                <MenuItem value="South Korea">South Korea</MenuItem>
                                                <MenuItem value="China">China</MenuItem>
                                                <MenuItem value="Switzerland">Switzerland</MenuItem>
                                                <MenuItem value="Netherlands">Netherlands</MenuItem>
                                                <MenuItem value="Sweden">Sweden</MenuItem>
                                                <MenuItem value="Turkey">Turkey</MenuItem>
                                                <MenuItem value="New Zealand">New Zealand</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Typography variant="body2" color="text.secondary">
                                            Showing {filteredScholarships.length} scholarships
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        {filteredScholarships.map(item => (
                                            <Grid item xs={12} md={6} lg={4} key={item.id}>
                                                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                                                    <CardContent>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                                            <LocationOn fontSize="small" color="action" />
                                                            <Typography variant="body2">{item.country}</Typography>
                                                        </Box>
                                                        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                            <Chip label={item.amount} color="success" size="small" />
                                                            <Chip label={item.field} size="small" sx={{ bgcolor: '#f0f0ff' }} />
                                                        </Box>
                                                        <Typography variant="body2" sx={{ mt: 1 }}><strong>Eligibility:</strong> {item.eligibility}</Typography>
                                                        <Typography variant="caption" sx={{ color: '#f59e0b', display: 'block', mt: 1 }}>Deadline: {item.deadline}</Typography>
                                                        <Button fullWidth variant="contained" sx={{ mt: 2 }} startIcon={<OpenInNew />} onClick={() => handleManualApply(item)}>
                                                            Apply Now
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            )}

                            {!hasLinkedIn && !hasIndeed && subTab === 0 && filteredInternships.length > 0 && (
                                <Alert severity="info" sx={{ mt: 3 }}>
                                    <strong>Enable Auto-Apply:</strong> Add your LinkedIn credentials (email + password) or Indeed email in the <strong>Settings</strong> tab.
                                    You can still apply manually by clicking "Manual Apply" button.
                                </Alert>
                            )}
                        </>
                    )}

                    {/* Auto Agent Tab */}
                    {mainTab === 2 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>AI Auto-Apply Agent</Typography>

                            {/* API Status */}
                            <Alert
                                severity={apiStatus === 'connected' ? 'success' : apiStatus === 'error' ? 'error' : 'info'}
                                sx={{ mb: 2 }}
                            >
                                {apiStatus === 'connected' && 'TinyFish API is connected and ready!'}
                                {apiStatus === 'error' && 'TinyFish API connection failed. Check your API key.'}
                                {apiStatus === 'checking' && 'Checking API connection...'}
                                {!apiStatus && 'Click "Test Connection" to verify TinyFish API is working.'}
                            </Alert>

                            {!hasLinkedIn && !hasIndeed && (
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    <strong>Credentials Required:</strong> Add your LinkedIn credentials (email + password) OR just your Indeed email in Settings tab to enable auto-apply.
                                </Alert>
                            )}

                            {(hasLinkedIn || hasIndeed) && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {hasLinkedIn && 'LinkedIn credentials configured. '}
                                    {hasIndeed && 'Indeed credentials configured.'}
                                </Alert>
                            )}

                            {/* Your Profile Summary for Matching */}
                            <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Your Profile (Used for Job Matching)</Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Skills:</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                            {formData.skills && formData.skills.length > 0 ? (
                                                formData.skills.map((skill, i) => (
                                                    <Chip key={i} label={skill} size="small" color="primary" variant="outlined" />
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="error">Not set - Add in Settings</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                    <Divider orientation="vertical" flexItem />
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Education:</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {formData.education?.degree || 'Not set'} {formData.education?.institution ? `from ${formData.education.institution}` : ''}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Agent Logs */}
                            <Paper sx={{ p: 2, bgcolor: '#1a1a1a', color: '#0f0', fontFamily: 'monospace', minHeight: 200, maxHeight: 300, overflow: 'auto', mb: 2 }}>
                                {logs.length === 0 ? (
                                    <Typography sx={{ fontFamily: 'monospace', color: '#666' }}>Agent logs will appear here...</Typography>
                                ) : (
                                    logs.map((log, i) => <Typography key={i} sx={{ fontFamily: 'monospace' }}>{log}</Typography>)
                                )}
                            </Paper>

                            {/* Applied Jobs Confirmation Box */}
                            {appliedJobs.length > 0 && (
                                <Paper sx={{ p: 2, mb: 2, border: '2px solid #10b981', borderRadius: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#10b981' }}>
                                        Applied Jobs Confirmation ({appliedJobs.length} jobs)
                                    </Typography>
                                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                        {appliedJobs.slice(-10).map((job, i) => (
                                            <Box key={i} sx={{ p: 1, mb: 1, bgcolor: '#f0fdf4', borderRadius: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{job.title}</Typography>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                                    <Chip label={job.company} size="small" color="primary" variant="outlined" />
                                                    <Chip label={`Field: ${job.field}`} size="small" color="success" variant="outlined" />
                                                    <Chip label={job.country} size="small" variant="outlined" />
                                                    <Chip
                                                        label={job.status === 'success' ? 'Applied' : job.status === 'manual' ? 'Manual' : job.status}
                                                        size="small"
                                                        color={job.status === 'success' ? 'success' : 'default'}
                                                    />
                                                </Box>
                                                {job.matchingSkills && job.matchingSkills.length > 0 && (
                                                    <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
                                                        Matched Skills: {job.matchingSkills.join(', ')}
                                                    </Typography>
                                                )}
                                                <Typography variant="caption" color="textSecondary">
                                                    {new Date(job.appliedAt).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Button size="small" color="error" sx={{ mt: 1 }} onClick={() => {
                                        setAppliedJobs([]);
                                        localStorage.removeItem('appliedJobs');
                                    }}>
                                        Clear History
                                    </Button>
                                </Paper>
                            )}

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        testApiConnection();
                                        // Auto-reset after 60 seconds if stuck
                                        setTimeout(() => {
                                            setApiStatus(prev => prev === 'checking' ? 'error' : prev);
                                        }, 60000);
                                    }}
                                    disabled={apiStatus === 'checking'}
                                >
                                    {apiStatus === 'checking' ? 'Testing...' : 'Test Connection'}
                                </Button>

                                {/* LinkedIn Auto-Apply Button */}
                                {hasLinkedIn && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            setLogs(['LinkedIn Agent started at ' + new Date().toLocaleTimeString(), 'Searching for opportunities on LinkedIn...']);
                                            filteredInternships.slice(0, 3).forEach((item, i) => {
                                                setTimeout(() => handleAutoApply(item, 'linkedin'), (i + 1) * 5000);
                                            });
                                        }}
                                    >
                                        Auto-Apply (LinkedIn)
                                    </Button>
                                )}

                                {/* Indeed Auto-Apply Button */}
                                {hasIndeed && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            setLogs(['Indeed Agent started at ' + new Date().toLocaleTimeString(), 'Searching for opportunities on Indeed...']);
                                            filteredInternships.slice(0, 3).forEach((item, i) => {
                                                setTimeout(() => handleAutoApply(item, 'indeed'), (i + 1) * 5000);
                                            });
                                        }}
                                    >
                                        Auto-Apply (Indeed)
                                    </Button>
                                )}

                                {/* Show message if no platform configured */}
                                {!hasLinkedIn && !hasIndeed && (
                                    <Button variant="contained" disabled>
                                        No Platform Configured
                                    </Button>
                                )}

                                <Button variant="outlined" onClick={() => setLogs([])}>Clear Logs</Button>

                                {/* Reset button if stuck */}
                                {apiStatus === 'checking' && (
                                    <Button
                                        variant="text"
                                        color="warning"
                                        size="small"
                                        onClick={() => {
                                            setApiStatus(null);
                                            setLogs(prev => [...prev, '[RESET] Connection status reset']);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                )}
                            </Box>

                            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                                <strong>How it works:</strong> The TinyFish AI agent will open a browser, login to your account, search for jobs matching your criteria, and apply automatically.
                            </Typography>
                        </Box>
                    )}

                    {/* Settings Tab */}
                    {mainTab === 3 && (
                        <Box>
                            {message.text && <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>{message.text}</Alert>}

                            <Alert severity="info" sx={{ mb: 2 }}>
                                Fields marked with <span style={{ color: 'red' }}>*</span> are required for auto-apply to work properly.
                            </Alert>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Profile <span style={{ color: 'red' }}>*</span></Typography>
                                    <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} required helperText="Required for job applications" />
                                    <TextField fullWidth label="Email" value={formData.email} disabled sx={{ mb: 2 }} />

                                    {/* Skills Multi-Select */}
                                    <FormControl fullWidth sx={{ mb: 2 }} required>
                                        <InputLabel>Select Your Skills *</InputLabel>
                                        <Select
                                            multiple
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                            input={<OutlinedInput label="Select Your Skills *" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} size="small" />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                                        >
                                            {skillsList.map((skill) => (
                                                <MenuItem key={skill} value={skill}>
                                                    <Checkbox checked={formData.skills.indexOf(skill) > -1} />
                                                    <ListItemText primary={skill} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                                            Required - Select skills that match your expertise ({formData.skills.length} selected)
                                        </Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Education <span style={{ color: 'red' }}>*</span></Typography>
                                    <TextField fullWidth label="Degree/Field of Study" name="education.degree" value={formData.education.degree} onChange={handleChange} sx={{ mb: 2 }} required helperText="Required - e.g., Computer Science, Software Engineering" />
                                    <TextField fullWidth label="Institution/University" name="education.institution" value={formData.education.institution} onChange={handleChange} sx={{ mb: 2 }} required helperText="Required - Your university name" />
                                    <TextField fullWidth label="Graduation Year" name="education.yearOfGraduation" type="number" value={formData.education.yearOfGraduation} onChange={handleChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Resume</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Button variant="outlined" component="label" startIcon={<CloudUpload />}>
                                            Upload Resume
                                            <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                                        </Button>
                                        {resume && <Typography color="success.main">{resumeName}</Typography>}
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Job Platform Credentials (for Auto-Apply)</Typography>

                                    {/* LinkedIn Section */}
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#0077b5' }}>LinkedIn (Requires Email + Password)</Typography>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={4}>
                                            <TextField fullWidth label="LinkedIn Email" name="linkedinEmail" value={formData.linkedinEmail} onChange={handleChange} helperText="Your LinkedIn login email" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField fullWidth label="LinkedIn Password" name="linkedinPassword" type="password" value={formData.linkedinPassword} onChange={handleChange} placeholder="Enter to update" helperText="Required for LinkedIn auto-apply" />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="LinkedIn OTP Code"
                                                name="linkedinOTP"
                                                value={formData.linkedinOTP || ''}
                                                onChange={handleChange}
                                                placeholder="6-digit code"
                                                helperText="Enter 2FA code from email/SMS"
                                                inputProps={{ maxLength: 6 }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        <strong>LinkedIn 2FA:</strong> If LinkedIn sends you a 6-digit code, enter it above and click Save, then try auto-apply again.
                                    </Alert>

                                    {/* Indeed Section */}
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#2164f3' }}>Indeed (Email Only - No Password Needed)</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Indeed Email" name="indeedEmail" value={formData.indeedEmail} onChange={handleChange} required helperText="Required - Used for guest applications" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Alert severity="info" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                Indeed uses guest apply mode - no password needed!
                                            </Alert>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" startIcon={<Save />} onClick={handleSaveProfile} disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}

export default Dashboard;
