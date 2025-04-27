// App.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Card, CardContent, CircularProgress, Snackbar, Alert } from '@mui/material';
import ReactMarkdown from 'react-markdown';

function App() {
  const [input, setInput] = useState('');
  const [markdownResult, setMarkdownResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError('Input cannot be empty!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: input }),
      });

      const data = await response.json();
      if (response.ok) {
        setMarkdownResult(data.result);
      } else {
        setError(data.detail || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Server unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fixed={true}
    // maxWidth="lg" sx={{ margin: [1,10]}}
    // spacing={0}
    // direction="column"
    // alignItems="center"
    // justifyContent="center"
    >
      <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          <img src='./assets/Jobber.png' height={40} /> JOBBER: A place to investigate about Jobs
        </Typography>

        <TextField
          label="Enter your text"
          variant="outlined"
          fullWidth
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Box textAlign="center">
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ borderRadius: 8, px: 5 }}
          >
            {loading ? <CircularProgress size={26} color="inherit" /> : 'Generate'}
          </Button>
        </Box>

        <Box mt={5}>
          <Typography variant="h5" gutterBottom>Search Result:</Typography>
          <Card variant="outlined" sx={{ p: 3, minHeight: 150, borderRadius: 3 }}>
            <CardContent>
              {loading ? (
                <Typography color="text.secondary">Agent is working...</Typography>
              ) : markdownResult ? (
                <ReactMarkdown>{markdownResult}</ReactMarkdown>
              ) : (
                <Typography color="text.secondary">Your result will appear here.</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Card>

      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
