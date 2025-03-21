import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
} from '@mui/material';

const HomePage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError('Nickname cannot be empty');
      return;
    }
    
    // Store the nickname in localStorage
    localStorage.setItem('nickname', nickname);
    
    // Navigate to the lobby
    navigate('/lobby');
  };

  return (
    <Container maxWidth="sm" >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Scrum Poker
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Enter your name to continue
          </Typography>
          
          <form onSubmit={handleNicknameSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                error={!!error}
                helperText={error}
                autoFocus
              />
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                sx={{ height: 56 }}
              >
                Continue
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage; 