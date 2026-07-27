import { useState } from 'react';
import api from '../services/api';

function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'applicant',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password, role: form.role }
        : { ...form };

      const { data } = await api.post(endpoint, payload);
      localStorage.setItem('token', data.token);
      setMessage(`${mode === 'login' ? 'Logged in' : 'Registered'} successfully`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <section className="panel auth-panel">
      <div className="auth-toggle">
        <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
          Login
        </button>
        <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {mode === 'register' && (
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="applicant">Applicant</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit">{mode === 'login' ? 'Login' : 'Create account'}</button>
      </form>

      {message && <p className="message">{message}</p>}
    </section>
  );
}

export default AuthPage;
