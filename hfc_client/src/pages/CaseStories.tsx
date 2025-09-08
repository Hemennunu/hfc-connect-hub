import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReadMore from '../components/ReadMore';

interface CaseStory {
  _id: string;
  title: string;
  content: string;
  summary: string;
  beneficiaryName: string;
  location: string;
  category: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string;
  impact: string;
  tags: string[];
  featured: boolean;
  publishDate: string;
}

const CaseStories: React.FC = () => {
  const [stories, setStories] = useState<CaseStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState<CaseStory | null>(null);

  const categories = [
    'Child Development',
    'Community Empowerment',
    'HIV/AIDS Support',
    'Social Accountability'
  ];

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/case-stories');
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching case stories:', error);
    } finally {
      setLoading(false);
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

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'photo': return '📷';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'photo_essay': return '📸';
      default: return '📝';
    }
  };

  const filteredStories = stories.filter(story => 
    selectedCategory === 'all' || story.category === selectedCategory
  );

  const featuredStories = stories.filter(story => story.featured);

  const renderMediaContent = (story: CaseStory) => {
    if (!story.mediaUrl) return null;

    switch (story.mediaType) {
      case 'photo':
      case 'photo_essay':
        return (
          <img
            src={`http://localhost:5000${story.mediaUrl}`}
            alt={story.title}
            className="w-full h-64 object-cover rounded-lg"
          />
        );
      case 'video':
        return (
          <video
            controls
            className="w-full h-64 rounded-lg"
            poster={story.thumbnailUrl ? `http://localhost:5000${story.thumbnailUrl}` : undefined}
          >
            <source src={`http://localhost:5000${story.mediaUrl}`} type="video/mp4" />
            <source src={`http://localhost:5000${story.mediaUrl}`} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <audio controls className="w-full">
              <source src={`http://localhost:5000${story.mediaUrl}`} type="audio/mpeg" />
              <source src={`http://localhost:5000${story.mediaUrl}`} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Impact Stories
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Discover the transformative stories of individuals and communities 
              whose lives have been touched by our programs and initiatives.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredStories.slice(0, 2).map((story) => (
                <div key={story._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-200">
                  {renderMediaContent(story)}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(story.category)}`}>
                        {story.category}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getMediaIcon(story.mediaType)}</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{story.title}</h3>
                    <ReadMore 
                      text={story.summary} 
                      maxLength={150}
                      className="text-gray-600 mb-4"
                    />
                    {story.beneficiaryName && (
                      <p className="text-sm text-gray-500 mb-2">
                        <strong>Beneficiary:</strong> {story.beneficiaryName}
                      </p>
                    )}
                    {story.location && (
                      <p className="text-sm text-gray-500 mb-4">
                        <strong>Location:</strong> {story.location}
                      </p>
                    )}
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium"
                    >
                      Read Full Story
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h2 className="text-2xl font-bold text-gray-900">All Stories</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stories found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try selecting a different category or check back later for new stories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div key={story._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {story.mediaUrl && (
                  <div className="h-48 overflow-hidden">
                    {renderMediaContent(story)}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(story.category)}`}>
                      {story.category}
                    </span>
                    <span className="text-lg">{getMediaIcon(story.mediaType)}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
                  <ReadMore 
                    text={story.summary} 
                    maxLength={120}
                    className="text-gray-600 mb-3"
                  />
                  {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {story.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(story.publishDate).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(selectedStory.category)}`}>
                  {selectedStory.category}
                </span>
                <span className="text-lg">{getMediaIcon(selectedStory.mediaType)}</span>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedStory.title}</h1>
              
              {selectedStory.mediaUrl && (
                <div className="mb-6">
                  {renderMediaContent(selectedStory)}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {selectedStory.beneficiaryName && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Beneficiary</h3>
                    <p className="text-gray-600">{selectedStory.beneficiaryName}</p>
                  </div>
                )}
                {selectedStory.location && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">{selectedStory.location}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Published</h3>
                  <p className="text-gray-600">{new Date(selectedStory.publishDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="prose max-w-none mb-6">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedStory.content}
                </div>
              </div>
              
              {selectedStory.impact && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-green-900 mb-2">Impact & Outcomes</h3>
                  <p className="text-green-800">{selectedStory.impact}</p>
                </div>
              )}
              
              {selectedStory.tags && selectedStory.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedStory.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStories;
