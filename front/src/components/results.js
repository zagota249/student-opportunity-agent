import React from 'react';
import {
  Container, Paper, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Chip, Box, Button, Card, CardContent, Grid,
  Tabs, Tab, IconButton
} from '@mui/material';
import {
  CheckCircle, Cancel, Pending, Visibility,
  School, Work
} from '@mui/icons-material';

function Results() {
  const [tabValue, setTabValue] = React.useState(0);

  const internshipResults = [
    { 
      position: 'Frontend Developer Intern', 
      company: 'TechCorp', 
      platform: 'LinkedIn',
      status: 'success',
      date: '2024-03-15',
      applied: '10:32 AM'
    },
    { 
      position: 'Software Engineer Intern', 
      company: 'StartupX', 
      platform: 'Internshala',
      status: 'success',
      date: '2024-03-15',
      applied: '10:45 AM'
    },
    { 
      position: 'ML Research Intern', 
      company: 'AI Labs', 
      platform: 'LinkedIn',
      status: 'pending',
      date: '2024-03-15',
      applied: '11:02 AM'
    },
    { 
      position: 'Product Manager Intern', 
      company: 'ProductCo', 
      platform: 'Indeed',
      status: 'rejected',
      date: '2024-03-14',
      applied: 'Yesterday'
    },
  ];

  const scholarshipResults = [
    {
      name: 'Future Leaders Scholarship',
      provider: 'Education Foundation',
      amount: '$5,000',
      deadline: '2024-04-30',
      status: 'applied',
      match: '95%'
    },
    {
      name: 'Women in Tech Grant',
      provider: 'Tech Women Org',
      amount: '$3,500',
      deadline: '2024-05-15',
      status: 'found',
      match: '88%'
    },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle sx={{ color: '#10b981' }} />;
      case 'rejected': return <Cancel sx={{ color: '#ef4444' }} />;
      case 'pending': return <Pending sx={{ color: '#f59e0b' }} />;
      default: return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Application Results
      </Typography>

      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab icon={<Work />} label="Internships" />
          <Tab icon={<School />} label="Scholarships" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Applications</Typography>
                  <Typography variant="h4">47</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Success Rate</Typography>
                  <Typography variant="h4" sx={{ color: '#10b981' }}>89%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Interviews</Typography>
                  <Typography variant="h4">8</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Applications Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {internshipResults.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.position}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>
                      <Chip label={row.platform} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(row.status)}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {row.status}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{row.applied}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {scholarshipResults.map((scholarship, index) => (
            <Grid item xs={12} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box>
                      <Typography variant="h6">{scholarship.name}</Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {scholarship.provider} • {scholarship.amount}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip 
                          label={`Match: ${scholarship.match}`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                        <Chip 
                          label={`Deadline: ${scholarship.deadline}`}
                          size="small"
                        />
                        <Chip 
                          label={scholarship.status}
                          size="small"
                          color={scholarship.status === 'applied' ? 'primary' : 'default'}
                        />
                      </Box>
                    </Box>
                    <Button variant="contained" size="small">
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Results;