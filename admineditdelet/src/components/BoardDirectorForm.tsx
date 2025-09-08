import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Upload } from 'lucide-react';

interface BoardDirectorFormProps {
  onDirectorAdded: () => void;
}

const BoardDirectorForm: React.FC<BoardDirectorFormProps> = ({ onDirectorAdded }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    expertise: '',
    profileImage: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('position', formData.position);
      submitData.append('expertise', formData.expertise);
      
      if (selectedFile) {
        submitData.append('profileImage', selectedFile);
      } else if (formData.profileImage && formData.profileImage.startsWith('http')) {
        // If it's a URL, send it as profileImage field
        submitData.append('profileImageUrl', formData.profileImage);
      }

      console.log('Creating board director with FormData');
      const response = await axios.post('http://localhost:5000/api/board-directors', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Board director created successfully:', response.data);
      setSuccess(`Board director "${formData.name}" added successfully!`);
      setFormData({
        name: '',
        position: '',
        expertise: '',
        profileImage: ''
      });
      setSelectedFile(null);
      onDirectorAdded();
    } catch (err: any) {
      console.error('Error creating board director:', err);
      setError(err.response?.data?.message || 'Failed to add board director');
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
      // Create preview URL
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
          <h3 className="text-2xl font-bold text-foreground">Add Board Director</h3>
          <p className="text-muted-foreground">Add a new member to the board of directors</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Preview */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
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
          {/* Name */}
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

          {/* Position */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground">
              Position *
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g., Chairperson, Executive Director"
              required
              className="input h-12"
              disabled={isLoading}
            />
          </div>

          {/* Expertise Description */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground">
              Expertise Description *
            </label>
            <textarea
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              placeholder="Describe their expertise, background, and qualifications..."
              rows={4}
              required
              className="input resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              This will show with a "Read More" button if it's long
            </p>
          </div>

          {/* Profile Image Upload */}
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
            <input
              type="url"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="Or paste image URL here..."
              className="input h-12"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Choose a file from your computer or paste an image URL
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adding Director...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Add Board Director
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardDirectorForm;
