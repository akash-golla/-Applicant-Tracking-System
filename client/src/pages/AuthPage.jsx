import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import api from '../services/api';

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'applicant',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password, role: form.role }
        : { ...form };

      const { data } = await api.post(endpoint, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage(`${mode === 'login' ? 'Logged in' : 'Registered'} successfully`);

      if (data.user?.role === 'applicant') {
        navigate('/resume');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={6} sx={{ p: 4, maxWidth: 480, mx: 'auto', borderRadius: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h5">{mode === 'login' ? 'Welcome back' : 'Create your account'}</Typography>
        <Typography variant="body2" color="text.secondary">Access recruiter and applicant experiences securely.</Typography>
        <ToggleButtonGroup color="primary" value={mode} exclusive onChange={(_, value) => value && setMode(value)} fullWidth>
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="register">Register</ToggleButton>
        </ToggleButtonGroup>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
          {mode === 'register' && (
            <TextField label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          )}
          <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <TextField select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <MenuItem value="applicant">Applicant</MenuItem>
            <MenuItem value="recruiter">Recruiter</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}</Button>
        </Box>

        {message && <Alert severity={message.toLowerCase().includes('success') ? 'success' : 'error'}>{message}</Alert>}
      </Stack>
    </Paper>
  );
}

export default AuthPage;
