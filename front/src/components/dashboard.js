import React from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, 
  Box, Button, Paper, LinearProgress 
} from '@mui/material';
import { 
  Work, School, TrendingUp, Speed, 
  AutoAwesome, ArrowForward 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Internships Applied', value: '47', icon: <Work />, color: '#6366f1' },
    { label: 'Scholarships Found', value: '12', icon: <School />, color: '#10b981' },
    { label: 'Success Rate', value: '89%', icon: <TrendingUp />, color: '#f59e0b' },
    { label: 'Hours Saved', value: '34', icon: <Speed />, color: '#ef4444' },
  ];

  const features = [
    { 
      title: 'Auto-Apply Internships', 
      desc: 'Agent automatically finds and applies to matching internships',
      icon: <Work /> 
    },
    { 
      title: 'Scholarship Detection', 
      desc: 'Discovers scholarships you qualify for and submits applications',
      icon: <School /> 
    },
    { 
      title: 'Live Agent View', 
      desc: 'Watch the agent work in real-time on your screen',
      icon: <AutoAwesome /> 
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Your Personal Opportunity Agent
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Let AI navigate the web and apply to internships & scholarships automatically while you focus on what matters
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/agent')}
              sx={{ 
                bgcolor: 'white', 
                color: '#667eea',
                '&:hover': { bgcolor: '#f0f0f0' }
              }}
              endIcon={<ArrowForward />}
            >
              Start Agent Now
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    bgcolor: stat.color + '20', 
                    p: 1, 
                    borderRadius: 2,
                    mr: 2
                  }}>
                    {React.cloneElement(stat.icon, { sx: { color: stat.color } })}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography color="textSecondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        How It Works
      </Typography>
      
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography color="textSecondary">
                  {feature.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Active Agent Status */}
      <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Agent Status</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            borderRadius: '50%', 
            bgcolor: '#10b981',
            mr: 2,
            animation: 'pulse 2s infinite'
          }} />
          <Typography>Agent is active - Currently applying to internships</Typography>
        </Box>
        <LinearProgress variant="determinate" value={60} sx={{ height: 8, borderRadius: 4 }} />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
          3 of 5 applications completed
        </Typography>
      </Paper>
    </Container>
  );
}

export default Dashboard;