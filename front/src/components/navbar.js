import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function Navbar() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <AutoAwesomeIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Student<span style={{ color: '#6366f1' }}>Opportunity</span>Agent
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/agent">Agent Control</Button>
          <Button color="inherit" component={Link} to="/results">Results</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
