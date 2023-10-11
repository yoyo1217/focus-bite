import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Box, Typography, CardContent } from '@mui/material'
import { getTime, updateTime } from '../utils/storage'
import Timer from '../components/Timer'

import './popup.css'


const App = () => {
  return(
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '200px'
      }}>
        <Typography variant='h2'>Pomodoro</Typography>
          <Timer />
      </Box>
    </>
  )
}


const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)