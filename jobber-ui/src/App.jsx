// App.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ReactMarkdown from 'react-markdown';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) {
      setError('Please enter a message.');
      return;
    }

    setMessages((prev) => [...prev, { type: 'user', text: input }]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: userInput }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, { type: 'bot', text: data.result }]);
      } else {
        setError(data.detail || 'Error from server.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <Box
    sx={{
        minHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', // This centers items horizontally within the Box
        backgroundColor: '#f5f5f5',
        p: 1,
        width: '99%', // Make the Box full width
    }}
    >
      <Container
        maxWidth="lg"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography 
            variant="h5"
            align="inherit"
          >
            🤖 Jobber: A place to investigate about Jobs
          </Typography>
        </Box>
        <Paper sx={{ height: '70vh', overflowY: 'auto', p: 2, mb: 2, borderRadius: 3, boxShadow: 3 }}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              display="flex"
              justifyContent={msg.type === 'user' ? 'flex-end' : 'flex-start'}
              my={1}
            >
              <Card
                sx={{
                  maxWidth: '80%',
                  p: 2,
                  backgroundColor: msg.type === 'user' ? '#1976d2' : '#e0e0e0',
                  color: msg.type === 'user' ? '#fff' : 'inherit',
                  borderRadius: 4,
                }}
              >
                <CardContent>
                  {msg.type === 'bot' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    <Typography>{msg.text}</Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}

          {loading && (
            <Box display="flex" justifyContent="flex-start" my={1}>
              <Card sx={{ p: 2, backgroundColor: '#e0e0e0', borderRadius: 4 }}>
                <CardContent>
                  <CircularProgress size={20} />
                </CardContent>
              </Card>
            </Box>
          )}

          <div ref={bottomRef} />
        </Paper>

        <Box display="flex" gap={1}>
          <TextField
            variant="outlined"
            placeholder="Type your message..."
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button startIcon={<RestartAltIcon />}
          variant="outlined" onClick={handleClearChat} sx={{ borderRadius: 3 }}> 
          </Button>
          <Button
            startIcon={<SendIcon /> }
            variant="contained"
            onClick={handleSend}
            disabled={loading}
            sx={{ borderRadius: 3 }}
          >
          </Button>
        </Box>

        {/* Error Snackbar */}
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App;