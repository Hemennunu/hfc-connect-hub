import React, { useEffect, useState } from 'react';
import { getFounders, createFounder, updateFounder, deleteFounder } from '../services/api';
import { useAuth } from '../context/AuthContext';

type Founder = { 
  id: number; 
  name: string; 
  bio: string; 
  photoUrl: string; 
  position?: string;
  achievements?: string;
  socialLinks?: any;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const FounderManagement: React.FC = () => {
  const { token } = useAuth();
  const [founders, setFounders] = useState<Founder[]>([]);
  const [name,setName] = useState('');
  const [bio,setBio] = useState('');
  const [photoUrl,setPhotoUrl] = useState('');
  const [editId,setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadFounders();
  }, []);

  const loadFounders = async () => {
    const res = await getFounders();
    setFounders(res.data);
  };

  const handleAdd = async () => {
    if(!token) return;
    await createFounder({name,bio,photoUrl}, token);
    setName(''); setBio(''); setPhotoUrl('');
    loadFounders();
  };

  const handleEdit = (founder: Founder) => {
    setEditId(founder.id);
    setName(founder.name);
    setBio(founder.bio);
    setPhotoUrl(founder.photoUrl);
  };

  const handleUpdate = async () => {
    if(!token || !editId) return;
    await updateFounder(editId, {name,bio,photoUrl}, token);
    setEditId(null);
    setName(''); setBio(''); setPhotoUrl('');
    loadFounders();
  };

  const handleDelete = async (id: number) => {
    if(!token) return;
    await deleteFounder(id, token);
    loadFounders();
  };

  return (
    <div>
      <h2>Founder Management</h2>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Bio" value={bio} onChange={e=>setBio(e.target.value)} />
      <input placeholder="Photo URL" value={photoUrl} onChange={e=>setPhotoUrl(e.target.value)} />
      {editId ? <button onClick={handleUpdate}>Update Founder</button> : <button onClick={handleAdd}>Add Founder</button>}
      <ul>
        {founders.map(f=>(
          <li key={f.id}>
            <h3>{f.name}</h3>
            <p>{f.bio}</p>
            <img src={f.photoUrl} alt={f.name} width={100}/>
            <button onClick={() => handleEdit(f)}>Edit</button>
            <button onClick={() => handleDelete(f.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FounderManagement;
