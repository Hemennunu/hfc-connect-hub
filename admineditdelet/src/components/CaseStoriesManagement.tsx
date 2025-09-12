import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CaseStoriesManagementProps {
  onStoryAdded: () => void;
  story?: any;
  onStoryUpdated: (id: number, data: FormData) => void;
}

const CaseStoriesManagement: React.FC<CaseStoriesManagementProps> = ({ onStoryAdded, story, onStoryUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    beneficiaryName: '',
    location: '',
    category: 'Child Development',
    mediaType: 'text',
    impact: '',
    tags: '',
    featured: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title || '',
        content: story.content || '',
        summary: story.summary || '',
        beneficiaryName: story.beneficiaryName || '',
        location: story.location || '',
        category: story.category || 'Child Development',
        mediaType: story.mediaType || 'text',
        impact: story.impact || '',
        tags: Array.isArray(story.tags) ? story.tags.join(', ') : '',
        featured: story.featured || false
      });
    }
  }, [story]);

  const categories = [
    'Child Development',
    'Community Empowerment',
    'HIV/AIDS Support',
    'Social Accountability'
  ];

  const mediaTypes = [
    { value: 'text', label: 'Text Only' },
    { value: 'photo', label: 'Photo Story' },
    { value: 'video', label: 'Video Story' },
    { value: 'audio', label: 'Audio Story' },
    { value: 'photo_essay', label: 'Photo Essay' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    const submitData = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });
    
    if (file) {
      submitData.append('media', file);
    }

    if (story) {
      onStoryUpdated(story.id, submitData);
    } else {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/case-stories', submitData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        setMessage('Case story created successfully!');
        setFormData({
          title: '',
          content: '',
          summary: '',
          beneficiaryName: '',
          location: '',
          category: 'Child Development',
          mediaType: 'text',
          impact: '',
          tags: '',
          featured: false
        });
        setFile(null);
        onStoryAdded();
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Error creating case story');
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-accent rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{story ? 'Edit Case Story' : 'Create Case Story'}</h2>
          <p className="text-gray-600">Share impactful stories from your community work</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Story Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter compelling story title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Summary *
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            required
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Brief summary of the story (2-3 sentences)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Story Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Tell the complete story with details about the impact and transformation"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Beneficiary Name
            </label>
            <input
              type="text"
              name="beneficiaryName"
              value={formData.beneficiaryName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Name of person/community (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Location where story took place"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Impact Description
          </label>
          <textarea
            name="impact"
            value={formData.impact}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Describe the measurable impact and outcomes"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Media Type
            </label>
            <select
              name="mediaType"
              value={formData.mediaType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {mediaTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Media File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept={formData.mediaType === 'video' ? 'video/*' : formData.mediaType === 'audio' ? 'audio/*' : 'image/*'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter tags separated by commas (e.g., education, health, empowerment)"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Feature this story (display prominently on homepage)
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-accent text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (story ? 'Updating...' : 'Creating...') : (story ? 'Update Case Story' : 'Create Case Story')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseStoriesManagement;
