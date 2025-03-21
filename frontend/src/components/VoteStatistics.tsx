import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  Chip,
  Grid,
  LinearProgress,
  Tooltip
} from '@mui/material';
import { User } from '../types';

interface VoteStatisticsProps {
  users: User[];
  revealed: boolean;
}

type VoteCount = {
  [key: string]: number;
};

const VoteStatistics: React.FC<VoteStatisticsProps> = ({ users, revealed }) => {
  // Only display statistics when votes are revealed
  if (!revealed) return null;

  // Filter users who have voted
  const votedUsers = users.filter(user => user.vote && user.vote !== '?');
  
  // Return early if no valid votes
  if (votedUsers.length === 0) {
    return (
      <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Vote Statistics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No numerical votes to calculate statistics.
        </Typography>
      </Paper>
    );
  }

  // Count votes by value
  const voteCountMap: VoteCount = {};
  
  // Initialize with all possible values
  votedUsers.forEach(user => {
    if (user.vote && user.vote !== '?') {
      voteCountMap[user.vote] = (voteCountMap[user.vote] || 0) + 1;
    }
  });

  // Sort vote values numerically
  const sortedVotes = Object.keys(voteCountMap).sort((a, b) => {
    // Handle non-numeric values
    const numA = Number(a);
    const numB = Number(b);
    return numA - numB;
  });

  // Calculate average (only for numeric votes)
  const numericVotes = votedUsers
    .filter(user => user.vote && !isNaN(Number(user.vote)))
    .map(user => Number(user.vote!));
  
  const validVotesCount = numericVotes.length;
  const averageVote = validVotesCount > 0 
    ? (numericVotes.reduce((sum, vote) => sum + vote, 0) / validVotesCount).toFixed(1) 
    : 'N/A';

  // Find the maximum vote count for scaling
  const maxVoteCount = Math.max(...Object.values(voteCountMap));

  return (
    <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Vote Statistics
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Average Score: <Chip label={averageVote} color="primary" />
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Vote Distribution:
      </Typography>
      
      <Grid container spacing={1}>
        {sortedVotes.map(vote => (
          <Grid item xs={12} key={vote}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={vote} 
                color="primary" 
                size="small" 
                sx={{ mr: 1, minWidth: '40px' }} 
              />
              <Box sx={{ flexGrow: 1, mr: 1 }}>
                <Tooltip title={`${voteCountMap[vote]} votes (${Math.round(voteCountMap[vote] / votedUsers.length * 100)}%)`}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(voteCountMap[vote] / maxVoteCount) * 100} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Tooltip>
              </Box>
              <Typography variant="body2">
                {voteCountMap[vote]} ({Math.round(voteCountMap[vote] / votedUsers.length * 100)}%)
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default VoteStatistics; 