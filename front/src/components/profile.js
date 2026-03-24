import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, TextField, Button, Box, Grid,
    Avatar, Divider, Alert, CircularProgress
} from '@mui/material';
import { CloudUpload, Save, Person } from '@mui/icons-material';
import { getProfile } from '../services/tinyfishapi';
import api from '../services/tinyfishapi';

function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [resume, setResume] = useState(null);
    const [resumeName, setResumeName] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        skills: '',
        linkedinEmail: '',
        linkedinPassword: '',
        indeedEmail: '',
        indeedPassword: '',
        education: {
            degree: '',
            institution: '',
            yearOfGraduation: ''
        }
    });

    useEffect(() => {
        fetchProfile();
        // Load resume from localStorage
        const savedResume = localStorage.getItem('userResume');
        const savedResumeName = localStorage.getItem('userResumeName');
        if (savedResume) {
            setResume(savedResume);
            setResumeName(savedResumeName || 'Resume uploaded');
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            const user = response.data.user;
            setFormData({
                name: user.name || '',
                email: user.email || '',
                skills: user.skills?.join(', ') || '',
                linkedinEmail: user.linkedinEmail || '',
                linkedinPassword: '',
                indeedEmail: user.indeedEmail || '',
                indeedPassword: '',
                education: {
                    degree: user.education?.degree || '',
                    institution: user.education?.institution || '',
                    yearOfGraduation: user.education?.yearOfGraduation || ''
                }
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Load from localStorage as fallback
            const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
            setFormData(prev => ({
                ...prev,
                name: savedUser.name || '',
                email: savedUser.email || '',
                linkedinEmail: savedUser.linkedinEmail || '',
                indeedEmail: savedUser.indeedEmail || ''
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('education.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                education: { ...prev.education, [field]: value }
            }));
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
                const base64 = event.target.result;
                localStorage.setItem('userResume', base64);
                localStorage.setItem('userResumeName', file.name);
                setResume(base64);
                setResumeName(file.name);
                setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const updateData = {
                name: formData.name,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                education: formData.education,
                linkedinEmail: formData.linkedinEmail,
                indeedEmail: formData.indeedEmail
            };

            // Only include passwords if they were entered
            if (formData.linkedinPassword) {
                updateData.linkedinPassword = formData.linkedinPassword;
            }
            if (formData.indeedPassword) {
                updateData.indeedPassword = formData.indeedPassword;
            }

            await api.put('/auth/profile', updateData);

            // Update localStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = {
                ...currentUser,
                name: formData.name,
                linkedinEmail: formData.linkedinEmail,
                indeedEmail: formData.indeedEmail
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const downloadResume = () => {
        if (resume) {
            const link = document.createElement('a');
            link.href = resume;
            link.download = resumeName || 'resume';
            link.click();
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: '#6366f1', mr: 3 }}>
                        <Person sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>My Profile</Typography>
                        <Typography color="textSecondary">Manage your account settings</Typography>
                    </Box>
                </Box>

                {message.text && (
                    <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: '', text: '' })}>
                        {message.text}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Basic Information</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formData.email}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Skills (comma separated)"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Python, Machine Learning"
                            />
                        </Grid>
                    </Grid>

                    {/* Education */}
                    <Divider sx={{ my: 4 }} />
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Education</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Degree"
                                name="education.degree"
                                value={formData.education.degree}
                                onChange={handleChange}
                                placeholder="BS Computer Science"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Institution"
                                name="education.institution"
                                value={formData.education.institution}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Graduation Year"
                                name="education.yearOfGraduation"
                                type="number"
                                value={formData.education.yearOfGraduation}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    {/* Resume Upload */}
                    <Divider sx={{ my: 4 }} />
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Resume</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUpload />}
                        >
                            Upload Resume
                            <input
                                type="file"
                                hidden
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                            />
                        </Button>
                        {resume && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" color="success.main">
                                    {resumeName}
                                </Typography>
                                <Button size="small" onClick={downloadResume}>Download</Button>
                            </Box>
                        )}
                    </Box>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Supported formats: PDF, DOC, DOCX (Max 5MB)
                    </Typography>

                    {/* Job Platform Credentials */}
                    <Divider sx={{ my: 4 }} />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Job Platform Credentials</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Add your credentials to enable auto-apply feature
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="LinkedIn Email"
                                name="linkedinEmail"
                                type="email"
                                value={formData.linkedinEmail}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="LinkedIn Password"
                                name="linkedinPassword"
                                type="password"
                                value={formData.linkedinPassword}
                                onChange={handleChange}
                                placeholder="Enter to update"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Indeed Email"
                                name="indeedEmail"
                                type="email"
                                value={formData.indeedEmail}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Indeed Password"
                                name="indeedPassword"
                                type="password"
                                value={formData.indeedPassword}
                                onChange={handleChange}
                                placeholder="Enter to update"
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={<Save />}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}

export default Profile;
