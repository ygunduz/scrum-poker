import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Card as CardType, CARD_DECK } from '../types';

interface CardDeckProps {
  selectedCard: string | null;
  onSelectCard: (value: string) => void;
  disabled: boolean;
}

const CardDeck: React.FC<CardDeckProps> = ({ selectedCard, onSelectCard, disabled }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Select a card:
      </Typography>
      <Grid container spacing={1}>
        {CARD_DECK.map((card: CardType) => (
          <Grid item key={card.value} xs={3} sm={2} md={1}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                height: { xs: 70, sm: 80 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: disabled ? 'not-allowed' : 'pointer',
                backgroundColor: selectedCard === card.value ? 
                  (theme) => alpha(theme.palette.primary.main, 0.2) : 
                  'white',
                border: selectedCard === card.value ? 
                  (theme) => `2px solid ${theme.palette.primary.main}` : 
                  '1px solid #ddd',
                '&:hover': {
                  backgroundColor: disabled ? undefined :
                    (theme) => alpha(theme.palette.primary.main, 0.1),
                },
                position: 'relative',
              }}
              onClick={() => !disabled && onSelectCard(card.value)}
            >
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                {card.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardDeck; 