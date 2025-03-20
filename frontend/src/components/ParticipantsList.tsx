import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { User } from '../types';

interface ParticipantsListProps {
  users: User[];
  revealed: boolean;
  currentUserId: string;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  users,
  revealed,
  currentUserId,
}) => {
  // Function to get initial from name for Avatar
  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  // Function to get vote display, respecting revealed state
  const getVoteDisplay = (user: User): React.ReactNode => {
    if (!user.vote) {
      return (
        <Chip
          label="Not voted"
          size="small"
          color="default"
          variant="outlined"
        />
      );
    }

    if (!revealed && user.id !== currentUserId) {
      return (
        <Chip label="Voted" size="small" color="primary" variant="outlined" />
      );
    }

    return (
      <Chip label={user.vote} size="small" color="primary" variant="filled" />
    );
  };

  return (
    <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Participants ({users.length})
      </Typography>
      <List>
        {users.map((user, index) => (
          <React.Fragment key={user.id}>
            {index > 0 && <Divider component="li" />}
            <ListItem
              sx={{
                backgroundColor:
                  user.id === currentUserId
                    ? (theme) => theme.palette.action.selected
                    : 'inherit',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: user.isAdmin ? 'secondary.main' : 'primary.main',
                  mr: 2,
                }}
              >
                {getInitial(user.name)}
              </Avatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    {user.name}
                    {user.id === currentUserId && (
                      <Chip
                        label="You"
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    )}
                    {user.isAdmin && (
                      <Chip
                        label="Admin"
                        size="small"
                        color="secondary"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                }
                secondary={getVoteDisplay(user)}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ParticipantsList;
