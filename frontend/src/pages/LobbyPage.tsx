import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useSocket } from '../contexts/SocketContext';

const LobbyPage: React.FC = () => {
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createRoom, joinRoom, connected } = useSocket();

  // Make sure the user has a nickname
  useEffect(() => {
    const nickname = localStorage.getItem('nickname');
    if (!nickname) {
      navigate('/');
    }
  }, [navigate]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      setError('Room name cannot be empty');
      return;
    }
    
    const nickname = localStorage.getItem('nickname') || 'Anonymous';
    setLoading(true);
    
    try {
      const { room } = await createRoom(roomName, nickname);
      navigate(`/room/${room.id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create room');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomId.trim()) {
      setError('Room ID cannot be empty');
      return;
    }
    
    const nickname = localStorage.getItem('nickname') || 'Anonymous';
    setLoading(true);
    
    try {
      const { room } = await joinRoom(roomId, nickname);
      navigate(`/room/${room.id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to join room');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            justifyContent: 'center',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Connecting to server...</Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Scrum Poker Lobby
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Create New Room
                </Typography>
                <form onSubmit={handleCreateRoom}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Room Name"
                      variant="outlined"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      disabled={loading}
                    />
                  </Stack>
                </form>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary"
                  onClick={handleCreateRoom}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Create Room'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Join Existing Room
                </Typography>
                <form onSubmit={handleJoinRoom}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Room ID"
                      variant="outlined"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      disabled={loading}
                    />
                  </Stack>
                </form>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  color="primary"
                  onClick={handleJoinRoom}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Join Room'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LobbyPage; 