import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Upload } from 'lucide-react';

interface ManagementTeamMember {
  id?: number;
  _id?: string;
  name: string;
  position: string;
  bio?: string;
  expertise?: string;
  image?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  linkedin?: string;
  department?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ManagementTeamFormProps {
  member?: ManagementTeamMember;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ManagementTeamForm: React.FC<ManagementTeamFormProps> = ({ member, onSuccess, onCancel }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState<Omit<ManagementTeamMember, 'id' | '_id'>>({
    name: member?.name || '',
    position: member?.position || '',
    expertise: member?.expertise || '',
    bio: member?.bio || '',
    email: member?.email || '',
    phone: member?.phone || '',
    linkedinUrl: member?.linkedinUrl || member?.linkedin || '',
    department: member?.department || '',
    image: member?.image || '',
    isActive: member?.isActive ?? true
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [useImageUrl, setUseImageUrl] = useState(!!member?.image);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        position: member.position || '',
        expertise: member.expertise || '',
        bio: member.bio || '',
        email: member.email || '',
        phone: member.phone || '',
        linkedinUrl: member.linkedinUrl || member.linkedin || '',
        department: member.department || '',
        image: member.image || '',
        isActive: member.isActive ?? true,
      });
      setUseImageUrl(!!member.image);
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
      submitData.append('position', formData.position);
      submitData.append('expertise', formData.expertise || '');
      submitData.append('bio', formData.bio || '');
      submitData.append('email', formData.email || '');
      submitData.append('phone', formData.phone || '');
      submitData.append('linkedinUrl', formData.linkedinUrl || '');
      submitData.append('department', formData.department || '');
      submitData.append('isActive', String(formData.isActive));
      
      if (useImageUrl && formData.image) {
        submitData.append('profileImageUrl', formData.image);
      } else if (selectedFile) {
        submitData.append('profileImage', selectedFile);
      }

      if (member?.id || member?._id) {
        // Update existing member
        await axios.put(
          `http://localhost:5000/api/management-team/${member.id || member._id}`,
          submitData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setSuccess('Management team member updated successfully!');
      } else {
        // Create new member
        await axios.post(
          'http://localhost:5000/api/management-team', 
          submitData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setSuccess('Management team member added successfully!');
        // Reset form if this was a new member
        if (!member) {
          setFormData({
            name: '',
            position: '',
            expertise: '',
            bio: '',
            email: '',
            phone: '',
            linkedinUrl: '',
            department: '',
            image: '',
            isActive: true
          });
          setSelectedFile(null);
        }
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error creating management team member:', err);
      setError(err.response?.data?.message || 'Failed to add management team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          image: result
        }));
      };
      reader.onerror = () => {
        setError('Failed to read the image file');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      image: url
    }));
  };

  return (
    <div className={`card p-6 md:p-8 ${member ? 'bg-blue-50' : ''}`}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4 shadow-glow">
          <UserCheck className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">
            {member ? 'Edit' : 'Add'} Management Team Member
          </h3>
          <p className="text-muted-foreground">
            {member ? 'Update' : 'Add a new'} member to the management team
          </p>
        </div>
      </div>

      {/* Management Team Member Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Preview */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32">
            {formData.image ? (
              <img
                src={
                  formData.image.startsWith('data:') || formData.image.startsWith('http')
                    ? formData.image
                    : `http://localhost:5000/uploads/managementTeam/${formData.image}`
                }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="space-y-3 md:col-span-2">
            <label className="block text-sm font-bold text-foreground">
              Profile Image
            </label>
            
            {/* Toggle between URL and File Upload */}
            <div className="flex border rounded-lg overflow-hidden mb-4">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium ${!useImageUrl ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setUseImageUrl(false)}
              >
                Upload Image
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium ${useImageUrl ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setUseImageUrl(true)}
              >
                Use Image URL
              </button>
            </div>
            
            {useImageUrl ? (
              <div className="space-y-2">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="input h-12 w-full"
                  disabled={isLoading}
                />
                {formData.image && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Preview:</p>
                    <img 
                      src={formData.image} 
                      alt="Profile preview" 
                      className="h-20 w-20 object-cover rounded-md"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '';
                        setError('Failed to load image from URL');
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
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
                    className="btn-secondary flex items-center cursor-pointer flex-1 justify-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {selectedFile ? 'Change Image' : 'Choose Image'}
                  </label>
                </div>
                {selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Selected File:</p>
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span className="text-sm text-gray-600 truncate">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Preview:</p>
                      <img 
                        src={URL.createObjectURL(selectedFile)} 
                        alt="Preview" 
                        className="h-20 w-20 object-cover rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {useImageUrl 
                ? 'Enter a direct image URL (e.g., https://example.com/image.jpg)'
                : 'Choose an image file from your computer'}
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

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 md:col-span-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {member ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                {member ? 'Update Team Member' : 'Add Team Member'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ManagementTeamForm;
