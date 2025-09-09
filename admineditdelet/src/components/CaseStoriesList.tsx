import React, { useState, useEffect } from 'react';
import ReadMore from './ReadMore';
import { getCaseStories, deleteCaseStory, updateCaseStory } from '../services/api'; // Import API functions

interface CaseStory {
  id: number;
  title: string;
  content: string;
  summary?: string;
  beneficiaryName: string;
  age?: number;
  location?: string;
  category: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'text' | 'photo' | 'audio' | 'photo_essay'; // Added missing media types
  impact?: string;
  outcome?: string;
  dateRecorded?: string;
  publishDate?: string;
  tags?: string[];
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CaseStoriesListProps {
  refreshTrigger: number;
}

const CaseStoriesList: React.FC<CaseStoriesListProps> = ({ refreshTrigger }) => {
  const [stories, setStories] = useState<CaseStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStory, setEditingStory] = useState<CaseStory | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStories();
  }, [refreshTrigger]);

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }
      const response = await getCaseStories(token); // Use imported getCaseStories
      setStories(response.data);
    } catch (error: any) {
      console.error('Error fetching case stories:', error);
      setMessage(error.response?.data?.message || 'Error fetching case stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this case story?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found. Please log in.');
        return;
      }
      await deleteCaseStory(id, token); // Use imported deleteCaseStory
      setStories(stories.filter(story => story.id !== id));
      setMessage('Case story deleted successfully');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error deleting case story');
    }
  };

  const handleEdit = (story: CaseStory) => {
    setEditingStory(story);
  };

  const handleUpdateFormData = async (formData: FormData) => {
    if (!editingStory) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found. Please log in.');
        return;
      }

      // Process tags if they exist
      const tagsValue = formData.get('tags') as string;
      if (tagsValue) {
        const tags = tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag);
        formData.set('tags', JSON.stringify(tags));
      }

      // Process featured checkbox
      const featuredValue = formData.get('featured');
      formData.set('featured', featuredValue === 'on' ? 'true' : 'false');

      console.log('Sending update request with formData:', Object.fromEntries(formData.entries()));

      const response = await updateCaseStory(editingStory.id, formData, token);

      setStories(stories.map(story => 
        story.id === editingStory.id ? response.data : story
      ));
      setEditingStory(null);
      setMessage('Case story updated successfully');
    } catch (error: any) {
      console.error('Update error:', error);
      setMessage(error.response?.data?.message || 'Error updating case story');
    }
  };

  const handleUpdate = async (updatedData: Partial<CaseStory>) => {
    if (!editingStory) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found. Please log in.');
        return;
      }
      const formData = new FormData();
      
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'tags' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value)); // Stringify tags array
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await updateCaseStory(editingStory.id, formData, token); // Use imported updateCaseStory

      setStories(stories.map(story => 
        story.id === editingStory.id ? response.data : story
      ));
      setEditingStory(null);
      setMessage('Case story updated successfully');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error updating case story');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Child Development': return 'bg-blue-100 text-blue-800';
      case 'Community Empowerment': return 'bg-green-100 text-green-800';
      case 'HIV/AIDS Support': return 'bg-red-100 text-red-800';
      case 'Social Accountability': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'photo': return '📷';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'photo_essay': return '📸';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-secondary rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Case Stories Management</h2>
            <p className="text-gray-600">{stories.length} stories published</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message}
        </div>
      )}

      {stories.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No case stories</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first impact story.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {stories.map((story) => (
            <div key={story.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{story.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(story.category)}`}>
                      {story.category}
                    </span>
                    <span className="text-lg">{getMediaTypeIcon(story.mediaType)}</span>
                    {story.featured && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <ReadMore 
                    text={story.summary || ''} 
                    maxLength={120}
                    className="text-gray-600 mb-3"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {story.beneficiaryName && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Beneficiary:</span>
                        <span className="ml-1 text-gray-600">{story.beneficiaryName}</span>
                      </div>
                    )}
                    {story.location && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Location:</span>
                        <span className="ml-1 text-gray-600">{story.location}</span>
                      </div>
                    )}
                  </div>

                  {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {story.tags.map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-sm text-gray-500">
                    Published: {new Date(story.publishDate || story.createdAt || new Date()).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(story)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit story"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete story"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Case Story</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleUpdateFormData(formData);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingStory.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                  <textarea
                    name="summary"
                    defaultValue={editingStory.summary}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    name="content"
                    defaultValue={editingStory.content}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Name</label>
                    <input
                      type="text"
                      name="beneficiaryName"
                      defaultValue={editingStory.beneficiaryName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={editingStory.location}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
                  <textarea
                    name="impact"
                    defaultValue={editingStory.impact}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingStory.tags?.join(', ')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editingStory.featured}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Featured</label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStoriesList;
