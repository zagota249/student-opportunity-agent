import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Card, CardContent, Typography, Box, Button, Paper,
    Tabs, Tab, TextField, InputAdornment, Select, MenuItem, FormControl,
    InputLabel, Chip, Divider, Alert, CircularProgress
} from '@mui/material';
import {
    Work, School, Speed, AutoAwesome, Search, LocationOn,
    OpenInNew, CloudUpload, Save, Dashboard as DashboardIcon,
    Settings, Explore, Category
} from '@mui/icons-material';
import { applyLinkedIn, applyIndeed, getProfile, testTinyFishConnection } from '../services/tinyfishapi';
import api from '../services/tinyfishapi';

// Extended internship data with direct apply links
const internshipsData = [
    // USA
    { id: 1, title: "Software Engineering Intern", company: "Google", country: "USA", type: "Remote", link: "https://careers.google.com/jobs/results/?q=intern", field: "Computer Science", skills: ["Python", "JavaScript"], deadline: "2026-04-15" },
    { id: 2, title: "Data Science Intern", company: "Microsoft", country: "USA", type: "Hybrid", link: "https://careers.microsoft.com/us/en/search-results?keywords=intern", field: "Data Science", skills: ["Python", "ML"], deadline: "2026-04-20" },
    { id: 3, title: "Frontend Developer Intern", company: "Meta", country: "USA", type: "Remote", link: "https://www.metacareers.com/jobs?q=intern", field: "Computer Science", skills: ["React", "JavaScript"], deadline: "2026-04-25" },
    { id: 4, title: "Backend Developer Intern", company: "Amazon", country: "USA", type: "On-site", link: "https://www.amazon.jobs/en/search?base_query=intern", field: "Computer Science", skills: ["Java", "AWS"], deadline: "2026-05-01" },
    { id: 5, title: "ML Engineer Intern", company: "OpenAI", country: "USA", type: "Remote", link: "https://openai.com/careers#jobs", field: "Artificial Intelligence", skills: ["Python", "PyTorch"], deadline: "2026-05-10" },
    { id: 6, title: "DevOps Intern", company: "Netflix", country: "USA", type: "Remote", link: "https://jobs.netflix.com/search?q=intern", field: "Computer Science", skills: ["Docker", "K8s"], deadline: "2026-05-15" },
    { id: 7, title: "Cybersecurity Intern", company: "IBM", country: "USA", type: "Remote", link: "https://www.ibm.com/careers/search?q=intern", field: "Cybersecurity", skills: ["Security", "Python"], deadline: "2026-05-25" },
    { id: 8, title: "Product Design Intern", company: "Apple", country: "USA", type: "On-site", link: "https://jobs.apple.com/en-us/search?search=intern", field: "Design", skills: ["Figma", "UI/UX"], deadline: "2026-06-25" },
    // UK
    { id: 9, title: "Business Analyst Intern", company: "Deloitte", country: "UK", type: "Hybrid", link: "https://apply.deloitte.com/careers/SearchJobs?q=intern", field: "Business", skills: ["Excel", "SQL"], deadline: "2026-05-30" },
    { id: 10, title: "Marketing Intern", company: "Unilever", country: "UK", type: "On-site", link: "https://careers.unilever.com/search-jobs?q=intern", field: "Marketing", skills: ["Digital Marketing", "Analytics"], deadline: "2026-06-01" },
    { id: 11, title: "Finance Intern", company: "Goldman Sachs", country: "UK", type: "On-site", link: "https://www.goldmansachs.com/careers/students/programs/", field: "Finance", skills: ["Financial Modeling", "Excel"], deadline: "2026-06-05" },
    { id: 12, title: "AI Research Intern", company: "DeepMind", country: "UK", type: "On-site", link: "https://deepmind.google/about/careers/", field: "Artificial Intelligence", skills: ["Python", "TensorFlow"], deadline: "2026-06-20" },
    // Germany
    { id: 13, title: "Research Intern", company: "Max Planck Institute", country: "Germany", type: "On-site", link: "https://www.mpg.de/career/positions", field: "Research", skills: ["Research", "Writing"], deadline: "2026-06-10" },
    { id: 14, title: "Engineering Intern", company: "Siemens", country: "Germany", type: "Hybrid", link: "https://jobs.siemens.com/careers?query=intern", field: "Engineering", skills: ["CAD", "Engineering"], deadline: "2026-06-15" },
    { id: 15, title: "Cloud Intern", company: "SAP", country: "Germany", type: "Hybrid", link: "https://jobs.sap.com/search?q=intern", field: "Computer Science", skills: ["Cloud", "Java"], deadline: "2026-07-01" },
    { id: 16, title: "Automotive Intern", company: "BMW", country: "Germany", type: "On-site", link: "https://www.bmwgroup.jobs/en.html", field: "Engineering", skills: ["Automotive", "Engineering"], deadline: "2026-07-20" },
    // Canada
    { id: 17, title: "Data Engineer Intern", company: "Shopify", country: "Canada", type: "Remote", link: "https://www.shopify.com/careers/search?q=intern", field: "Data Science", skills: ["Python", "SQL"], deadline: "2026-06-30" },
    { id: 18, title: "Software Developer Intern", company: "RBC", country: "Canada", type: "Hybrid", link: "https://jobs.rbc.com/ca/en/students", field: "Computer Science", skills: ["Java", "Python"], deadline: "2026-05-15" },
    // Sweden
    { id: 19, title: "Mobile Developer Intern", company: "Spotify", country: "Sweden", type: "Hybrid", link: "https://www.lifeatspotify.com/jobs?q=intern", field: "Computer Science", skills: ["React Native", "iOS"], deadline: "2026-05-20" },
    { id: 20, title: "Game Developer Intern", company: "DICE/EA", country: "Sweden", type: "On-site", link: "https://www.ea.com/careers/students", field: "Computer Science", skills: ["C++", "Unity"], deadline: "2026-06-01" },
    // Japan
    { id: 21, title: "Robotics Intern", company: "Sony", country: "Japan", type: "On-site", link: "https://www.sony.com/en/SonyInfo/Jobs/", field: "Engineering", skills: ["Robotics", "Python"], deadline: "2026-07-10" },
    { id: 22, title: "Technology Intern", company: "Toyota", country: "Japan", type: "On-site", link: "https://global.toyota/en/careers/", field: "Engineering", skills: ["Automotive", "AI"], deadline: "2026-08-01" },
    // Switzerland
    { id: 23, title: "Healthcare Data Intern", company: "Roche", country: "Switzerland", type: "Hybrid", link: "https://careers.roche.com/global/en/search-results?keywords=intern", field: "Healthcare", skills: ["Data Analysis", "R"], deadline: "2026-07-15" },
    { id: 24, title: "Research Intern", company: "CERN", country: "Switzerland", type: "On-site", link: "https://careers.cern/students", field: "Research", skills: ["Physics", "Python"], deadline: "2026-03-15" },
    // Australia
    { id: 25, title: "QA Engineer Intern", company: "Atlassian", country: "Australia", type: "Remote", link: "https://www.atlassian.com/company/careers/all-jobs?search=intern", field: "Computer Science", skills: ["Testing", "Automation"], deadline: "2026-07-05" },
    { id: 26, title: "Mining Tech Intern", company: "BHP", country: "Australia", type: "On-site", link: "https://www.bhp.com/careers/graduates-students", field: "Engineering", skills: ["Engineering", "Data"], deadline: "2026-08-15" },
    // UAE
    { id: 27, title: "Software Engineer Intern", company: "Careem", country: "UAE", type: "Hybrid", link: "https://www.careem.com/en-ae/careers/", field: "Computer Science", skills: ["Python", "Mobile"], deadline: "2026-05-01" },
    { id: 28, title: "Data Analyst Intern", company: "Emirates", country: "UAE", type: "On-site", link: "https://www.emiratesgroupcareers.com/students/", field: "Data Science", skills: ["SQL", "Python"], deadline: "2026-06-15" },
    { id: 29, title: "Finance Intern", company: "ADNOC", country: "UAE", type: "On-site", link: "https://www.adnoc.ae/careers", field: "Finance", skills: ["Finance", "Excel"], deadline: "2026-07-01" },
    { id: 30, title: "Marketing Intern", company: "Noon", country: "UAE", type: "Hybrid", link: "https://www.noon.com/careers", field: "Marketing", skills: ["Digital Marketing", "Analytics"], deadline: "2026-05-20" },
    // Saudi Arabia
    { id: 31, title: "Tech Intern", company: "Aramco", country: "Saudi Arabia", type: "On-site", link: "https://www.aramco.com/en/careers/professionals", field: "Engineering", skills: ["Engineering", "Tech"], deadline: "2026-06-01" },
    { id: 32, title: "IT Intern", company: "NEOM", country: "Saudi Arabia", type: "On-site", link: "https://www.neom.com/en-us/careers", field: "Computer Science", skills: ["Cloud", "AI"], deadline: "2026-08-01" },
    // Pakistan
    { id: 33, title: "Software Developer Intern", company: "Systems Limited", country: "Pakistan", type: "On-site", link: "https://www.systemsltd.com/careers", field: "Computer Science", skills: ["Java", ".NET"], deadline: "2026-05-15" },
    { id: 34, title: "Web Developer Intern", company: "Netsol Technologies", country: "Pakistan", type: "Hybrid", link: "https://www.netsoltech.com/careers", field: "Computer Science", skills: ["JavaScript", "React"], deadline: "2026-06-01" },
    { id: 35, title: "Data Science Intern", company: "Jazz", country: "Pakistan", type: "On-site", link: "https://www.jazz.com.pk/careers/", field: "Data Science", skills: ["Python", "ML"], deadline: "2026-05-30" },
    { id: 36, title: "Engineering Intern", company: "Engro Corporation", country: "Pakistan", type: "On-site", link: "https://www.engro.com/careers/", field: "Engineering", skills: ["Chemical", "Engineering"], deadline: "2026-07-01" },
    { id: 37, title: "Banking Intern", company: "HBL", country: "Pakistan", type: "On-site", link: "https://www.hbl.com/careers", field: "Finance", skills: ["Finance", "Banking"], deadline: "2026-06-15" },
    // India
    { id: 38, title: "Software Intern", company: "Infosys", country: "India", type: "Hybrid", link: "https://www.infosys.com/careers/apply.html", field: "Computer Science", skills: ["Java", "Python"], deadline: "2026-05-01" },
    { id: 39, title: "Tech Intern", company: "TCS", country: "India", type: "On-site", link: "https://www.tcs.com/careers", field: "Computer Science", skills: ["Programming", "Cloud"], deadline: "2026-06-01" },
    { id: 40, title: "AI Intern", company: "Flipkart", country: "India", type: "Hybrid", link: "https://www.flipkartcareers.com/", field: "Artificial Intelligence", skills: ["Python", "ML"], deadline: "2026-05-15" },
    // Singapore
    { id: 41, title: "FinTech Intern", company: "DBS Bank", country: "Singapore", type: "Hybrid", link: "https://www.dbs.com/careers/students", field: "Finance", skills: ["FinTech", "Python"], deadline: "2026-06-01" },
    { id: 42, title: "Software Intern", company: "Grab", country: "Singapore", type: "Remote", link: "https://grab.careers/", field: "Computer Science", skills: ["Go", "Microservices"], deadline: "2026-05-20" },
    // China
    { id: 43, title: "AI Research Intern", company: "Alibaba", country: "China", type: "On-site", link: "https://talent.alibaba.com/", field: "Artificial Intelligence", skills: ["Python", "Deep Learning"], deadline: "2026-07-01" },
    { id: 44, title: "Hardware Intern", company: "Huawei", country: "China", type: "On-site", link: "https://career.huawei.com/", field: "Engineering", skills: ["Hardware", "5G"], deadline: "2026-06-15" },
    // South Korea
    { id: 45, title: "Electronics Intern", company: "Samsung", country: "South Korea", type: "On-site", link: "https://www.samsung.com/sec/aboutsamsung/careers/", field: "Engineering", skills: ["Electronics", "AI"], deadline: "2026-08-01" },
    { id: 46, title: "Gaming Intern", company: "NCSoft", country: "South Korea", type: "On-site", link: "https://global.ncsoft.com/eng/recruit/", field: "Computer Science", skills: ["Game Dev", "C++"], deadline: "2026-07-15" },
    // France
    { id: 47, title: "Aerospace Intern", company: "Airbus", country: "France", type: "On-site", link: "https://www.airbus.com/en/careers", field: "Aerospace Engineering", skills: ["Aerospace", "Engineering"], deadline: "2026-06-01" },
    { id: 48, title: "Luxury Brand Intern", company: "LVMH", country: "France", type: "On-site", link: "https://www.lvmh.com/talents/", field: "Marketing", skills: ["Marketing", "Luxury"], deadline: "2026-05-15" },
    // Netherlands
    { id: 49, title: "Tech Intern", company: "Booking.com", country: "Netherlands", type: "Hybrid", link: "https://careers.booking.com/early-careers/", field: "Computer Science", skills: ["Python", "ML"], deadline: "2026-06-01" },
    { id: 50, title: "Semiconductor Intern", company: "ASML", country: "Netherlands", type: "On-site", link: "https://www.asml.com/en/careers/students", field: "Engineering", skills: ["Physics", "Engineering"], deadline: "2026-07-01" },
    // Remote/Global
    { id: 51, title: "Open Source Intern", company: "GitHub", country: "Remote/Global", type: "Remote", link: "https://github.com/about/careers", field: "Computer Science", skills: ["Git", "Open Source"], deadline: "2026-05-01" },
    { id: 52, title: "DevRel Intern", company: "Twilio", country: "Remote/Global", type: "Remote", link: "https://www.twilio.com/company/jobs", field: "Computer Science", skills: ["APIs", "Communication"], deadline: "2026-06-15" },
    { id: 53, title: "Remote Developer Intern", company: "GitLab", country: "Remote/Global", type: "Remote", link: "https://about.gitlab.com/jobs/", field: "Computer Science", skills: ["DevOps", "Ruby"], deadline: "2026-05-20" },
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
    // Technology
    'Computer Science', 'Data Science', 'Artificial Intelligence', 'Cybersecurity', 'Software Engineering', 'Web Development', 'Mobile Development',
    // Engineering
    'Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Aerospace Engineering',
    // Business & Finance
    'Business', 'Finance', 'Accounting', 'Marketing', 'Management', 'Economics', 'Entrepreneurship',
    // Sciences
    'Medicine', 'Healthcare', 'Pharmacy', 'Biotechnology', 'Biology', 'Chemistry', 'Physics', 'Mathematics',
    // Arts & Humanities
    'Design', 'Architecture', 'Law', 'Education', 'Psychology', 'Journalism', 'Media Studies',
    // Other
    'Research', 'Leadership', 'Peace Studies', 'Environmental Science', 'Agriculture', 'Social Sciences'
];

function Dashboard() {
    const [mainTab, setMainTab] = useState(0);
    const [subTab, setSubTab] = useState(0);
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('All');
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

    // Load applied jobs from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        setAppliedJobs(saved);
    }, []);

    // Calculate real-time stats
    const stats = {
        totalApplied: appliedJobs.length,
        scholarshipsFound: scholarshipsData.length,
        hoursSaved: Math.round(appliedJobs.length * 1.5) // Each application saves ~1.5 hours
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        skills: '',
        linkedinEmail: '',
        linkedinPassword: '',
        indeedEmail: '',
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
        setLogs(prev => [...prev, '🔄 Testing TinyFish API connection...']);
        try {
            const response = await testTinyFishConnection();
            if (response.data.success) {
                setApiStatus('connected');
                setLogs(prev => [...prev, '✅ TinyFish API is connected and ready!']);
            } else {
                setApiStatus('error');
                setLogs(prev => [...prev, `❌ API Error: ${response.data.error || 'Connection failed'}`]);
            }
        } catch (error) {
            setApiStatus('error');
            setLogs(prev => [...prev, `❌ Cannot connect to TinyFish API: ${error.message}`]);
        }
    };

    useEffect(() => {
        fetchData();
        const savedResume = localStorage.getItem('userResume');
        const savedResumeName = localStorage.getItem('userResumeName');
        if (savedResume) {
            setResume(savedResume);
            setResumeName(savedResumeName || 'Resume uploaded');
        }
    }, []);

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

            setFormData({
                name: profileUser.name || user.name || '',
                email: profileUser.email || user.email || '',
                skills: profileUser.skills?.join(', ') || '',
                linkedinEmail: profileUser.linkedinEmail || '',
                linkedinPassword: '',
                indeedEmail: profileUser.indeedEmail || '',
                indeedPassword: '',
                education: profileUser.education || { degree: '', institution: '', yearOfGraduation: '' }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter internships by search, country, and field
    const filteredInternships = internshipsData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.company.toLowerCase().includes(search.toLowerCase());
        const matchesCountry = country === 'All' || item.country === country;
        const matchesField = field === 'All Fields' || item.field === field;
        return matchesSearch && matchesCountry && matchesField;
    });

    // Filter scholarships by search, country, and field
    const filteredScholarships = scholarshipsData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchesCountry = country === 'All' || item.country === country || item.country === 'Multiple' || item.country === 'Europe';
        const matchesField = field === 'All Fields' || item.field === 'All Fields' || item.field === field;
        return matchesSearch && matchesCountry && matchesField;
    });

    // Save applied job to localStorage
    const saveAppliedJob = (item, status) => {
        const newApplied = [...appliedJobs, { ...item, status, appliedAt: new Date().toISOString() }];
        setAppliedJobs(newApplied);
        localStorage.setItem('appliedJobs', JSON.stringify(newApplied));
    };

    const handleAutoApply = async (item, platform) => {
        setApplying(item.id);
        setLogs(prev => [...prev, `🚀 Starting ${platform} automation for "${item.title}"...`]);

        // Check credentials first
        if (platform === 'linkedin' && !hasLinkedIn) {
            setLogs(prev => [...prev, '❌ LinkedIn credentials not configured. Go to Settings tab to add them.']);
            setMessage({ type: 'error', text: 'Please add your LinkedIn email AND password in Settings first.' });
            setApplying(null);
            return;
        }
        if (platform === 'indeed' && !hasIndeed) {
            setLogs(prev => [...prev, '❌ Indeed email not configured. Go to Settings tab to add it.']);
            setMessage({ type: 'error', text: 'Please add your Indeed email in Settings first.' });
            setApplying(null);
            return;
        }

        try {
            setLogs(prev => [...prev, `📡 Sending request to TinyFish API...`]);
            setLogs(prev => [...prev, `🎯 Target: ${item.title} at ${item.company} (${item.field})`]);
            let response;
            if (platform === 'linkedin') {
                response = await applyLinkedIn({
                    jobTitle: item.title,
                    location: item.country,
                    company: item.company,
                    field: item.field,
                    skills: item.skills
                });
            } else {
                response = await applyIndeed({
                    jobTitle: item.title,
                    location: item.country,
                    company: item.company,
                    field: item.field,
                    skills: item.skills
                });
            }

            if (response.data.success) {
                const result = response.data.data;
                setLogs(prev => [...prev, `✅ Successfully applied to ${item.title} at ${item.company}!`]);

                // Show agent steps if available
                if (result?.data?.steps?.length) {
                    result.data.steps.forEach(step => {
                        setLogs(prev => [...prev, `   → ${step}`]);
                    });
                }

                // Show result description if available
                if (result?.data?.result?.description) {
                    setLogs(prev => [...prev, `📋 Result: ${result.data.result.description}`]);
                }

                setMessage({ type: 'success', text: `Applied to ${item.title} at ${item.company} successfully!` });
                saveAppliedJob(item, 'success');
            } else {
                setLogs(prev => [...prev, `⚠️ Application may have issues: ${response.data.message || 'Check manually'}`]);
                saveAppliedJob(item, 'pending');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            setLogs(prev => [...prev, `❌ Auto-apply failed: ${errorMsg}`]);
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
        setSaving(true);
        try {
            const updateData = {
                name: formData.name,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                education: formData.education,
                linkedinEmail: formData.linkedinEmail,
                indeedEmail: formData.indeedEmail
            };
            if (formData.linkedinPassword) updateData.linkedinPassword = formData.linkedinPassword;
            if (formData.indeedPassword) updateData.indeedPassword = formData.indeedPassword;

            await api.put('/auth/profile', updateData);
            const updatedUser = { ...user, name: formData.name, linkedinEmail: formData.linkedinEmail, indeedEmail: formData.indeedEmail };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setMessage({ type: 'success', text: 'Profile saved!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save profile' });
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
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Recent Opportunities</Typography>
                                <Grid container spacing={2}>
                                    {internshipsData.slice(0, 4).map(item => (
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
                                    {internshipsData.length} Internships • {scholarshipsData.length} Scholarships
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
                            {/* Filters */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                                <TextField placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} size="small" sx={{ minWidth: 200 }}
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
                                <Tab label={`Internships (${filteredInternships.length})`} />
                                <Tab label={`Scholarships (${filteredScholarships.length})`} />
                            </Tabs>

                            {/* No results message */}
                            {((subTab === 0 && filteredInternships.length === 0) || (subTab === 1 && filteredScholarships.length === 0)) && (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    No {subTab === 0 ? 'internships' : 'scholarships'} found for your filters. Try adjusting your search criteria.
                                </Alert>
                            )}

                            {subTab === 0 && (
                                <Grid container spacing={2}>
                                    {filteredInternships.map(item => (
                                        <Grid item xs={12} md={6} lg={4} key={item.id}>
                                            <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                                                        <Chip label={item.type} size="small" />
                                                    </Box>
                                                    <Typography variant="body2" color="textSecondary">{item.company}</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                                                        <LocationOn fontSize="small" color="action" />
                                                        <Typography variant="body2">{item.country}</Typography>
                                                        <Category fontSize="small" color="action" sx={{ ml: 1 }} />
                                                        <Typography variant="body2">{item.field}</Typography>
                                                    </Box>
                                                    <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                        {item.skills.map(s => <Chip key={s} label={s} size="small" sx={{ bgcolor: '#f0f0ff' }} />)}
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
                                    {hasLinkedIn && '✅ LinkedIn credentials configured. '}
                                    {hasIndeed && '✅ Indeed credentials configured.'}
                                </Alert>
                            )}

                            {/* Your Profile Summary for Matching */}
                            <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>📋 Your Profile (Used for Job Matching)</Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">Skills:</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {formData.skills || 'Not set - Add in Settings'}
                                        </Typography>
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
                                        ✅ Applied Jobs Confirmation ({appliedJobs.length} jobs)
                                    </Typography>
                                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                        {appliedJobs.slice(-10).map((job, i) => (
                                            <Box key={i} sx={{ p: 1, mb: 1, bgcolor: '#f0fdf4', borderRadius: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{job.title}</Typography>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                                    <Chip label={job.company} size="small" color="primary" variant="outlined" />
                                                    <Chip label={job.field} size="small" color="success" variant="outlined" />
                                                    <Chip label={job.country} size="small" variant="outlined" />
                                                    <Chip
                                                        label={job.status === 'success' ? '✓ Applied' : job.status === 'manual' ? '📝 Manual' : job.status}
                                                        size="small"
                                                        color={job.status === 'success' ? 'success' : 'default'}
                                                    />
                                                </Box>
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
                                            setLogs([`🤖 LinkedIn Agent started at ${new Date().toLocaleTimeString()}`, '🔍 Searching on LinkedIn...']);
                                            filteredInternships.slice(0, 3).forEach((item, i) => {
                                                setTimeout(() => handleAutoApply(item, 'linkedin'), (i + 1) * 5000);
                                            });
                                        }}
                                    >
                                        🔗 Auto-Apply (LinkedIn)
                                    </Button>
                                )}

                                {/* Indeed Auto-Apply Button */}
                                {hasIndeed && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            setLogs([`🤖 Indeed Agent started at ${new Date().toLocaleTimeString()}`, '🔍 Searching on Indeed...']);
                                            filteredInternships.slice(0, 3).forEach((item, i) => {
                                                setTimeout(() => handleAutoApply(item, 'indeed'), (i + 1) * 5000);
                                            });
                                        }}
                                    >
                                        📋 Auto-Apply (Indeed)
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
                                            setLogs(prev => [...prev, '🔄 Reset connection status']);
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

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Profile</Typography>
                                    <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} />
                                    <TextField fullWidth label="Email" value={formData.email} disabled sx={{ mb: 2 }} />
                                    <TextField fullWidth label="Skills (comma separated)" name="skills" value={formData.skills} onChange={handleChange} sx={{ mb: 2 }} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Education</Typography>
                                    <TextField fullWidth label="Degree" name="education.degree" value={formData.education.degree} onChange={handleChange} sx={{ mb: 2 }} />
                                    <TextField fullWidth label="Institution" name="education.institution" value={formData.education.institution} onChange={handleChange} sx={{ mb: 2 }} />
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
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="LinkedIn Email" name="linkedinEmail" value={formData.linkedinEmail} onChange={handleChange} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="LinkedIn Password" name="linkedinPassword" type="password" value={formData.linkedinPassword} onChange={handleChange} placeholder="Enter to update" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Indeed Email" name="indeedEmail" value={formData.indeedEmail} onChange={handleChange} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Indeed Password" name="indeedPassword" type="password" value={formData.indeedPassword} onChange={handleChange} placeholder="Enter to update" />
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
