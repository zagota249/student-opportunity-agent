import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Grid, Paper, Typography, Button, TextField,
  Box, Chip, Card, CardContent, Switch, FormControlLabel,
  Select, MenuItem, FormControl, InputLabel,
  LinearProgress, Divider, IconButton, Tooltip
} from '@mui/material';
import {
  PlayArrow, Stop, Refresh, Visibility, 
  Download, Share
} from '@mui/icons-material';

function AgentControl() {
  const [agentStatus, setAgentStatus] = useState('idle');
  const [agentLogs, setAgentLogs] = useState([]);
  const [liveView, setLiveView] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['linkedin']);
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [agentLogs]);

  const startAgent = () => {
    setAgentStatus('running');
    setAgentLogs([]); // Clear previous logs
    
    const demoLogs = [
      { time: '10:32:15', action: '🚀 Agent started', status: 'info' },
      { time: '10:32:18', action: '🔐 Logging into LinkedIn...', status: 'info' },
      { time: '10:32:25', action: '✅ Login successful', status: 'success' },
      { time: '10:32:30', action: '🔍 Searching for "Software Engineering Intern"', status: 'info' },
      { time: '10:32:45', action: '📄 Found 25 matching internships', status: 'info' },
      { time: '10:32:50', action: '📝 Applying to position: Frontend Developer Intern at TechCorp', status: 'action' },
      { time: '10:33:15', action: '✏️ Filling application form...', status: 'pending' },
      { time: '10:33:30', action: '📎 Uploading resume', status: 'info' },
      { time: '10:33:45', action: '✅ Application submitted successfully!', status: 'success' },
      { time: '10:34:00', action: '➡️ Moving to next application...', status: 'info' },
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < demoLogs.length) {
        setAgentLogs(prev => [...prev, demoLogs[index]]);
        index++;
      } else {
        clearInterval(interval);
        setAgentStatus('completed');
      }
    }, 1500);
  };

  const stopAgent = () => {
    setAgentStatus('paused');
  };

  const clearLogs = () => {
    setAgentLogs([]);
  };

  // Safely get status color
  const getStatusColor = (log) => {
    if (!log || !log.status) return '#fff';
    
    switch(log.status) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'pending': return '#f59e0b';
      case 'action': return '#6366f1';
      default: return '#fff';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Control Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Agent Controls
            </Typography>

            {/* User Profile */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Student Profile
                </Typography>
                <TextField
                  fullWidth
                  label="Full Name"
                  defaultValue="John Doe"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Skills"
                  defaultValue="React, Python, JavaScript"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Resume Link"
                  defaultValue="https://example.com/resume.pdf"
                  size="small"
                />
              </CardContent>
            </Card>

            {/* Platform Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                multiple
                value={selectedPlatforms}
                onChange={(e) => setSelectedPlatforms(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="linkedin">LinkedIn</MenuItem>
                <MenuItem value="internshala">Internshala</MenuItem>
                <MenuItem value="indeed">Indeed</MenuItem>
              </Select>
            </FormControl>

            {/* Settings */}
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Auto-apply"
              sx={{ mb: 1, display: 'block' }}
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Smart filtering"
              sx={{ mb: 2, display: 'block' }}
            />

            {/* Action Buttons */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrow />}
                  onClick={startAgent}
                  disabled={agentStatus === 'running'}
                >
                  {agentStatus === 'running' ? 'Running...' : 'Start'}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<Stop />}
                  onClick={stopAgent}
                  disabled={agentStatus !== 'running'}
                >
                  Stop
                </Button>
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Tooltip title="Refresh">
                <IconButton onClick={clearLogs}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Live View">
                <IconButton 
                  color={liveView ? 'primary' : 'default'} 
                  onClick={() => setLiveView(!liveView)}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export">
                <IconButton>
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton>
                  <Share />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </Grid>

        {/* Live Agent View */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Live Agent Activity
              </Typography>
              <Chip 
                label={agentStatus?.toUpperCase() || 'IDLE'} 
                color={
                  agentStatus === 'running' ? 'success' : 
                  agentStatus === 'paused' ? 'warning' : 'default'
                }
                size="small"
              />
            </Box>

            {/* Live Browser Preview */}
            {liveView && (
              <Paper 
                variant="outlined" 
                sx={{ 
                  mb: 2, 
                  height: 180, 
                  bgcolor: '#1a1a1a', 
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  bgcolor: '#2d2d2d', 
                  p: 1, 
                  display: 'flex', 
                  alignItems: 'center',
                  borderBottom: '1px solid #404040'
                }}>
                  <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27c93f' }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    agent-browser.tinyfish.ai
                  </Typography>
                </Box>
                <Box sx={{ p: 2, color: 'white', fontFamily: 'monospace', fontSize: '12px' }}>
                  <Typography sx={{ color: '#4af' }}>&lt;div&gt; LinkedIn.com &lt;/div&gt;</Typography>
                  <Typography sx={{ color: '#fff' }}>  Logging in...</Typography>
                  {agentStatus === 'running' && (
                    <Typography sx={{ color: '#ff0' }}>  ⏳ Running...</Typography>
                  )}
                </Box>
              </Paper>
            )}

            {/* Agent Progress */}
            {agentStatus === 'running' && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2" fontWeight={600}>60%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={60} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            )}

            {/* Live Logs Console */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                bgcolor: '#0a0a0a',
                color: '#fff',
                fontFamily: 'monospace',
                height: 350,
                overflow: 'auto',
                borderRadius: 1
              }}
            >
              {agentLogs.length === 0 ? (
                <Box sx={{ color: '#666', textAlign: 'center', mt: 15 }}>
                  No logs yet. Click Start to begin.
                </Box>
              ) : (
                agentLogs.map((log, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      mb: 0.5,
                      color: getStatusColor(log),
                      fontSize: '14px',
                      borderBottom: '1px solid #222',
                      pb: 0.5
                    }}
                  >
                    <span style={{ color: '#666' }}>[{log?.time || '00:00'}]</span> {log?.action || '...'}
                  </Box>
                ))
              )}
              <div ref={logsEndRef} />
              
              {agentStatus === 'running' && (
                <Box sx={{ color: '#666', mt: 1 }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>_</span>
                </Box>
              )}
            </Paper>

            {/* Quick Stats */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Card variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="textSecondary">Applications</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#10b981' }}>12</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="textSecondary">Success Rate</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#6366f1' }}>92%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="caption" color="textSecondary">Time Saved</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#f59e0b' }}>8.5h</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AgentControl;