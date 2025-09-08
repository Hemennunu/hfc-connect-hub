import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Upload } from 'lucide-react';

interface ManagementTeamFormProps {
  onMemberAdded: () => void;
}

const ManagementTeamForm: React.FC<ManagementTeamFormProps> = ({ onMemberAdded }) => {
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
      console.log('Creating management team member:', formData);
      const response = await axios.post('http://localhost:5000/api/management-team', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Management team member created successfully:', response.data);
      setSuccess(`Management team member "${formData.name}" added successfully!`);
      setFormData({
        name: '',
        position: '',
        expertise: '',
        profileImage: ''
      });
      onMemberAdded();
    } catch (err: any) {
      console.error('Error creating management team member:', err);
      setError(err.response?.data?.message || 'Failed to add management team member');
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
          <UserCheck className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Add Management Team Member</h3>
          <p className="text-muted-foreground">Add a new member to the management team</p>
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
              <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl shadow-medium">
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
              placeholder="e.g., Executive Director, Finance Manager"
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
                id="management-image-upload"
                disabled={isLoading}
              />
              <label
                htmlFor="management-image-upload"
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
                Adding Member...
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Add Team Member
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManagementTeamForm;
