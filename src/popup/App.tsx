import React, { useState } from 'react';
import { Box, Typography, CardContent } from '@mui/material';
import Timer from '../components/Timer';

export const App = () => {
  const [timeLeft, setTimeLeft] = useState<number>(1500);
  const [isDisplay, setIsDisplay] = useState(true);


  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh'
      }}>
        <Typography variant='h1'>Pomodoro</Typography>
        <CardContent>
          <Timer />
        </CardContent>
      </Box>
    </>
  );
};
