import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import api from '../services/api';

function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'applicant',
    company: '',
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint =
        mode === 'login'
          ? '/auth/login'
          : '/auth/register';

      const payload =
        mode === 'login'
          ? {
              email: form.email,
              password: form.password,
              role: form.role,
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              role: form.role,
              ...(form.role === 'recruiter' && {
                company: form.company,
              }),
            };

      const { data } = await api.post(endpoint, payload);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setMessage(
        `${mode === 'login' ? 'Logged in' : 'Registered'} successfully`
      );

      if (data.user?.role === 'applicant') {
        navigate('/resume');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Something went wrong'
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Paper
      elevation={6}
      sx={{
        p: { xs: 3, md: 4 },
        maxWidth: 560,
        mx: 'auto',
        borderRadius: 4,
        bgcolor: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.24)',
      }}
    >

      <Stack spacing={2}>

        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {mode === 'login'
            ? 'Welcome back'
            : 'Create your account'}
        </Typography>


        <Typography
          variant="body2"
          color="text.secondary"
        >
          Access recruiter and applicant experiences securely.
        </Typography>


        <ToggleButtonGroup
          color="primary"
          value={mode}
          exclusive
          onChange={(_, value) => value && setMode(value)}
          fullWidth
          sx={{
            '& .MuiToggleButton-root': {
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.14)',
              px: 2,
              py: 1,
              fontWeight: 600,
              color: 'inherit',
            },
            '& .Mui-selected': {
              bgcolor: 'rgba(120, 184, 255, 0.2) !important',
              color: '#f7fbff',
            },
          }}
        >
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="register">Register</ToggleButton>
        </ToggleButtonGroup>



        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'grid',
            gap: 2,
          }}
        >

          {mode === 'register' && (
            <TextField
              label="Full name"
              value={form.name}
              onChange={(e) =>
                handleChange('name', e.target.value)
              }
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          )}



          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              handleChange('email', e.target.value)
            }
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />



          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              handleChange('password', e.target.value)
            }
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />



          <TextField
            select
            label="Role"
            value={form.role}
            onChange={(e) =>
              handleChange('role', e.target.value)
            }
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          >

            <MenuItem value="applicant">
              Applicant
            </MenuItem>

            <MenuItem value="recruiter">
              Recruiter
            </MenuItem>

          </TextField>



          {mode === 'register' &&
            form.role === 'recruiter' && (

            <TextField
              label="Company Name"
              value={form.company}
              onChange={(e) =>
                handleChange('company', e.target.value)
              }
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

          )}



          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ py: 1.2, borderRadius: 999, fontWeight: 700 }}
          >

            {isSubmitting
              ? 'Please wait...'
              : mode === 'login'
              ? 'Login'
              : 'Create account'}

          </Button>


        </Box>



        {message && (

          <Alert
            severity={
              message
                .toLowerCase()
                .includes('success')
                ? 'success'
                : 'error'
            }
            sx={{ borderRadius: 3 }}
          >
            {message}
          </Alert>

        )}

      </Stack>

    </Paper>
  );
}

export default AuthPage;