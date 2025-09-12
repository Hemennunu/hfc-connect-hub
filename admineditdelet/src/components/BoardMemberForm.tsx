import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Upload } from 'lucide-react';

interface BoardMemberFormProps {
  onMemberAdded: () => void;
  member?: any;
  onMemberUpdated: (id: number, data: FormData) => void;
}

const BoardMemberForm: React.FC<BoardMemberFormProps> = ({ onMemberAdded, member, onMemberUpdated }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    education: '',
    bio: '',
    profileImage: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        role: member.role || '',
        education: member.education || '',
        bio: member.bio || '',
        profileImage: member.profileImage || ''
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('role', formData.role);
      submitData.append('education', formData.education);
      submitData.append('bio', formData.bio);
      
      if (selectedFile) {
        submitData.append('profileImage', selectedFile);
      }

      if (member) {
        await onMemberUpdated(member.id, submitData);
        setSuccess(`Board member "${formData.name}" updated successfully!`);
      } else {
        const response = await axios.post('http://localhost:5000/api/board-members', submitData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess(`Board member "${formData.name}" added successfully!`);
      }

      setFormData({
        name: '',
        role: '',
        education: '',
        bio: '',
        profileImage: ''
      });
      setSelectedFile(null);
      onMemberAdded();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save board member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          profileImage: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4 shadow-glow">
          <Users className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">{member ? 'Edit Board Member' : 'Add Board Member'}</h3>
          <p className="text-muted-foreground">{member ? 'Edit the details of the board member' : 'Add a new member to the board'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32">
            {formData.profileImage ? (
              <img
                src={formData.profileImage.startsWith('data:image') ? formData.profileImage : `http://localhost:5000${formData.profileImage}`}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-full shadow-medium"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl shadow-medium">
                {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : '?'}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="input h-12"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground">
              Role *
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Chairperson, Member"
              required
              className="input h-12"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground">
              Education
            </label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Describe their education..."
              rows={4}
              className="input resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="A short bio..."
              rows={4}
              className="input resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profile-image-upload"
                disabled={isLoading}
              />
              <label
                htmlFor="profile-image-upload"
                className="btn-secondary flex items-center cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </label>
              {selectedFile && (
                <span className="text-sm text-muted-foreground">
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {member ? 'Updating Member...' : 'Adding Member...'}
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                {member ? 'Update Board Member' : 'Add Board Member'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardMemberForm;
