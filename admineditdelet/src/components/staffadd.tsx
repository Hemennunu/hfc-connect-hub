/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const departments = [
  'Board of Directors',
  'Leadership',
  'Program Management',
  // add other departments as needed
];

const AddStaffMember: React.FC<{ onStaffAdded: () => void }> = ({ onStaffAdded }) => {
  const { token } = useAuth();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState(departments[0]);
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/staff', {
        name,
        role,
        department,
        location,
        email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setName('');
      setRole('');
      setDepartment(departments[0]);
      setLocation('');
      setEmail('');
      onStaffAdded();
    } catch (err) {
      setError('Failed to add staff member');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <h3>Add Staff Member</h3>
      <label>
        Name:
        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
      </label>
      <label>
        Role:
        <input type="text" value={role} onChange={e => setRole(e.target.value)} required />
      </label>
      <label>
        Department:
        <select value={department} onChange={e => setDepartment(e.target.value)}>
          {departments.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
      </label>
      <label>
        Location:
        <input type="text" value={location} onChange={e => setLocation(e.target.value)} required />
      </label>
      <label>
        Contact (Email):
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </label>

      <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Staff'}</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AddStaffMember;
