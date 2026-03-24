import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Card, CardContent, Typography, Button, Box,
    Tabs, Tab, Chip, TextField, InputAdornment, Select, MenuItem,
    FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Search, Work, School, LocationOn, OpenInNew, AutoAwesome } from '@mui/icons-material';
import { applyLinkedIn, applyIndeed } from '../services/tinyfishapi';

// Sample internship data (in real app, fetch from API)
const internshipsData = [
    { id: 1, title: "Software Engineering Intern", company: "Google", location: "USA", type: "Remote", link: "https://careers.google.com", skills: ["Python", "JavaScript"], deadline: "2026-04-15" },
    { id: 2, title: "Data Science Intern", company: "Microsoft", location: "USA", type: "Hybrid", link: "https://careers.microsoft.com", skills: ["Python", "ML"], deadline: "2026-04-20" },
    { id: 3, title: "Frontend Developer Intern", company: "Meta", location: "USA", type: "Remote", link: "https://www.metacareers.com", skills: ["React", "JavaScript"], deadline: "2026-04-25" },
    { id: 4, title: "Backend Developer Intern", company: "Amazon", location: "USA", type: "On-site", link: "https://amazon.jobs", skills: ["Java", "AWS"], deadline: "2026-05-01" },
    { id: 5, title: "ML Engineer Intern", company: "OpenAI", location: "USA", type: "Remote", link: "https://openai.com/careers", skills: ["Python", "PyTorch"], deadline: "2026-05-10" },
    { id: 6, title: "DevOps Intern", company: "Netflix", location: "USA", type: "Remote", link: "https://jobs.netflix.com", skills: ["Docker", "K8s"], deadline: "2026-05-15" },
    { id: 7, title: "Mobile Developer Intern", company: "Spotify", location: "Sweden", type: "Hybrid", link: "https://www.lifeatspotify.com", skills: ["React Native", "iOS"], deadline: "2026-05-20" },
    { id: 8, title: "Cybersecurity Intern", company: "IBM", location: "USA", type: "Remote", link: "https://www.ibm.com/careers", skills: ["Security", "Python"], deadline: "2026-05-25" },
    { id: 9, title: "Cloud Engineer Intern", company: "Salesforce", location: "USA", type: "Hybrid", link: "https://www.salesforce.com/company/careers", skills: ["AWS", "Azure"], deadline: "2026-06-01" },
    { id: 10, title: "AI Research Intern", company: "DeepMind", location: "UK", type: "On-site", link: "https://deepmind.com/careers", skills: ["Python", "TensorFlow"], deadline: "2026-06-10" },
];

// Sample scholarships data
const scholarshipsData = [
    { id: 1, title: "Fulbright Scholarship", country: "USA", amount: "$50,000", deadline: "2026-05-01", link: "https://fulbrightprogram.org", eligibility: "All Countries", field: "All Fields" },
    { id: 2, title: "Chevening Scholarship", country: "UK", amount: "Full Funding", deadline: "2026-11-01", link: "https://www.chevening.org", eligibility: "All Countries", field: "All Fields" },
    { id: 3, title: "DAAD Scholarship", country: "Germany", amount: "€850/month", deadline: "2026-10-15", link: "https://www.daad.de", eligibility: "All Countries", field: "All Fields" },
    { id: 4, title: "Australia Awards", country: "Australia", amount: "Full Funding", deadline: "2026-04-30", link: "https://www.australiaawards.gov.au", eligibility: "Developing Countries", field: "All Fields" },
    { id: 5, title: "Erasmus Mundus", country: "Europe", amount: "€1,400/month", deadline: "2026-01-15", link: "https://erasmus-plus.ec.europa.eu", eligibility: "All Countries", field: "All Fields" },
    { id: 6, title: "Gates Cambridge", country: "UK", amount: "Full Funding", deadline: "2026-12-01", link: "https://www.gatescambridge.org", eligibility: "Non-UK", field: "All Fields" },
    { id: 7, title: "Rhodes Scholarship", country: "UK", amount: "Full Funding", deadline: "2026-10-01", link: "https://www.rhodeshouse.ox.ac.uk", eligibility: "Select Countries", field: "All Fields" },
    { id: 8, title: "Schwarzman Scholars", country: "China", amount: "Full Funding", deadline: "2026-09-15", link: "https://www.schwarzmanscholars.org", eligibility: "All Countries", field: "Leadership" },
    { id: 9, title: "Japanese MEXT Scholarship", country: "Japan", amount: "Full Funding", deadline: "2026-04-15", link: "https://www.mext.go.jp", eligibility: "All Countries", field: "All Fields" },
    { id: 10, title: "Swedish Institute Scholarship", country: "Sweden", amount: "Full Funding", deadline: "2026-02-10", link: "https://si.se/en", eligibility: "Select Countries", field: "All Fields" },
    { id: 11, title: "Commonwealth Scholarship", country: "UK", amount: "Full Funding", deadline: "2026-12-15", link: "https://cscuk.fcdo.gov.uk", eligibility: "Commonwealth", field: "All Fields" },
    { id: 12, title: "Aga Khan Foundation", country: "Multiple", amount: "50% Grant", deadline: "2026-03-31", link: "https://www.akdn.org", eligibility: "Select Countries", field: "All Fields" },
    { id: 13, title: "Rotary Peace Fellowship", country: "Multiple", amount: "Full Funding", deadline: "2026-05-15", link: "https://www.rotary.org", eligibility: "All Countries", field: "Peace Studies" },
    { id: 14, title: "Vanier Canada Graduate", country: "Canada", amount: "$50,000/year", deadline: "2026-11-01", link: "https://vanier.gc.ca", eligibility: "All Countries", field: "Research" },
    { id: 15, title: "New Zealand Scholarship", country: "New Zealand", amount: "Full Funding", deadline: "2026-03-28", link: "https://www.nzscholarships.govt.nz", eligibility: "Developing Countries", field: "All Fields" },
];

function Opportunities() {
    const [tab, setTab] = useState(0);
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('All');
    const [applying, setApplying] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const hasLinkedIn = user.linkedinEmail && user.linkedinPassword;
    const hasIndeed = user.indeedEmail && user.indeedPassword;

    const countries = ['All', 'USA', 'UK', 'Germany', 'Canada', 'Australia', 'Sweden', 'Japan', 'China', 'Europe', 'Multiple'];

    const filteredInternships = internshipsData.filter(item =>
        (item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.company.toLowerCase().includes(search.toLowerCase())) &&
        (country === 'All' || item.location === country)
    );

    const filteredScholarships = scholarshipsData.filter(item =>
        (item.title.toLowerCase().includes(search.toLowerCase())) &&
        (country === 'All' || item.country === country)
    );

    const handleAutoApply = async (item, platform) => {
        setApplying(item.id);
        try {
            if (platform === 'linkedin') {
                await applyLinkedIn({ jobTitle: item.title, location: item.location });
            } else {
                await applyIndeed({ jobTitle: item.title, location: item.location });
            }
            alert(`Successfully applied to ${item.title}!`);
        } catch (error) {
            alert('Auto-apply failed. Please try manual apply.');
        } finally {
            setApplying(null);
        }
    };

    const handleManualApply = (item) => {
        window.open(item.link, '_blank');
    };

    const openApplyDialog = (item) => {
        setSelectedItem(item);
        setDialogOpen(true);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Discover Opportunities
                </Typography>
                <Typography color="textSecondary">
                    Find internships and scholarships worldwide
                </Typography>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Search opportunities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: 200 }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                    }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Country</InputLabel>
                    <Select value={country} onChange={(e) => setCountry(e.target.value)} label="Country">
                        {countries.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>

            {/* Tabs */}
            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab icon={<Work />} label={`Internships (${filteredInternships.length})`} />
                <Tab icon={<School />} label={`Scholarships (${filteredScholarships.length})`} />
            </Tabs>

            {/* Internships Tab */}
            {tab === 0 && (
                <Grid container spacing={3}>
                    {filteredInternships.map(item => (
                        <Grid item xs={12} md={6} key={item.id}>
                            <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                                            <Typography color="textSecondary">{item.company}</Typography>
                                        </Box>
                                        <Chip label={item.type} size="small" color="primary" variant="outlined" />
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                        <LocationOn fontSize="small" color="action" />
                                        <Typography variant="body2" color="textSecondary">{item.location}</Typography>
                                    </Box>

                                    <Box sx={{ mt: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {item.skills.map(skill => (
                                            <Chip key={skill} label={skill} size="small" sx={{ bgcolor: '#f0f0ff' }} />
                                        ))}
                                    </Box>

                                    <Typography variant="body2" sx={{ mt: 2, color: '#f59e0b' }}>
                                        Deadline: {item.deadline}
                                    </Typography>

                                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                        {hasLinkedIn ? (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<AutoAwesome />}
                                                onClick={() => handleAutoApply(item, 'linkedin')}
                                                disabled={applying === item.id}
                                                sx={{ bgcolor: '#0077b5' }}
                                            >
                                                {applying === item.id ? 'Applying...' : 'Auto Apply (LinkedIn)'}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<OpenInNew />}
                                                onClick={() => handleManualApply(item)}
                                            >
                                                Apply on LinkedIn
                                            </Button>
                                        )}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<OpenInNew />}
                                            onClick={() => handleManualApply(item)}
                                        >
                                            Company Site
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Scholarships Tab */}
            {tab === 1 && (
                <Grid container spacing={3}>
                    {filteredScholarships.map(item => (
                        <Grid item xs={12} md={6} lg={4} key={item.id}>
                            <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{item.title}</Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <LocationOn fontSize="small" color="action" />
                                        <Typography variant="body2" color="textSecondary">{item.country}</Typography>
                                    </Box>

                                    <Chip label={item.amount} color="success" size="small" sx={{ mb: 1 }} />

                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        <strong>Eligibility:</strong> {item.eligibility}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Field:</strong> {item.field}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#f59e0b', mt: 1 }}>
                                        Deadline: {item.deadline}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        startIcon={<OpenInNew />}
                                        onClick={() => handleManualApply(item)}
                                    >
                                        Apply Now
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* No credentials warning */}
            {!hasLinkedIn && tab === 0 && (
                <Box sx={{ mt: 4, p: 3, bgcolor: '#fff3cd', borderRadius: 2, border: '1px solid #ffc107' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Want to auto-apply to internships?
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Add your LinkedIn credentials in your profile to enable automatic job applications.
                    </Typography>
                    <Button variant="outlined" sx={{ mt: 2 }} href="/profile">
                        Update Profile
                    </Button>
                </Box>
            )}
        </Container>
    );
}

export default Opportunities;
