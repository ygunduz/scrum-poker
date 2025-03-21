import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Divider,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  ExitToApp as ExitToAppIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { useSocket } from '../contexts/SocketContext';
import CardDeck from '../components/CardDeck';
import ParticipantsList from '../components/ParticipantsList';
import VoteStatistics from '../components/VoteStatistics';

const PokerRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const {
    connected,
    currentRoom,
    currentUser,
    submitVote,
    revealVotes,
    resetVotes,
    joinRoom,
  } = useSocket();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize room if coming directly to this URL
  useEffect(() => {
    const initRoom = async () => {
      if (!roomId) {
        navigate('/lobby');
        return;
      }

      // If we don't have a current room or the room ID doesn't match
      if (!currentRoom || currentRoom.id !== roomId) {
        const nickname = localStorage.getItem('nickname');
        
        if (!nickname) {
          navigate('/');
          return;
        }

        try {
          await joinRoom(roomId, nickname);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Failed to join room');
          }
          navigate('/lobby');
          return;
        }
      }

      setLoading(false);
    };

    if (connected) {
      initRoom();
    }
  }, [connected, currentRoom, roomId, joinRoom, navigate]);

  // Update selected card based on user's vote
  useEffect(() => {
    if (currentUser?.vote) {
      setSelectedCard(currentUser.vote);
    } else {
      setSelectedCard(null);
    }
  }, [currentUser]);

  const handleSelectCard = async (cardValue: string) => {
    try {
      setSelectedCard(cardValue);
      await submitVote(cardValue);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit vote');
      }
    }
  };

  const handleRevealVotes = async () => {
    try {
      await revealVotes();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to reveal votes');
      }
    }
  };

  const handleResetVotes = async () => {
    try {
      await resetVotes();
      setSelectedCard(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to reset votes');
      }
    }
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeaveRoom = () => {
    navigate('/lobby');
  };

  // Show loading state
  if (loading || !currentRoom || !currentUser) {
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
            <Typography variant="h6">Loading room...</Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  const isAdmin = currentUser.isAdmin;
  const { revealed, users } = currentRoom;

  return (
    <Box sx={{ pb: 4 }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {currentRoom.name}
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title={copied ? 'Copied!' : 'Copy Room ID'}>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyRoomId}
                sx={{ mr: 1 }}
              >
                {roomId?.substring(0, 8)}...
              </Button>
            </Tooltip>
            
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleLeaveRoom}
              title="Leave Room"
            >
              <ExitToAppIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Scrum Poker Session
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <CardDeck
                selectedCard={selectedCard}
                onSelectCard={handleSelectCard}
                disabled={revealed}
              />
              
              {isAdmin && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    onClick={handleRevealVotes}
                    disabled={revealed}
                    sx={{ mr: 2 }}
                  >
                    Reveal Votes
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={handleResetVotes}
                    disabled={!revealed}
                  >
                    Reset Votes
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <ParticipantsList
              users={users}
              revealed={revealed}
              currentUserId={currentUser.id}
            />
            
            <VoteStatistics 
              users={users}
              revealed={revealed}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PokerRoomPage;