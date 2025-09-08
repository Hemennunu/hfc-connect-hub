import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        name, email, password, role: 'admin'
      });
      navigate('/login');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setError('Failed to register');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button type="submit">Sign Up</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Signup;
