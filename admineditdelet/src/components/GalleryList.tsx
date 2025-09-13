// src/components/GalleryList.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Description from './Description'; // Import the new component

interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  category: 'Child Development' | 'Community Empowerment' | 'HIV/AIDS Support' | 'Social Accountability' | 'Events' | 'Training';
  location?: string;
  dateTaken?: string;
  tags?: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

const GalleryList = ({ refresh, onEdit }: { refresh: number, onEdit: (item: GalleryItem) => void }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchGalleryItems();
  }, [refresh]);

  const fetchGalleryItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/gallery");
      setGalleryItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch gallery items:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await axios.delete(`http://localhost:5000/api/gallery/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchGalleryItems();
        alert("Gallery item deleted successfully!");
      } catch (err) {
        alert("Failed to delete gallery item.");
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading gallery items...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Manage Gallery Items</h2>
      
      {galleryItems.length === 0 ? (
        <p className="text-muted-foreground">No gallery items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div key={item.id} className="bg-card p-4 rounded-lg shadow-medium border flex flex-col h-full">
              {item.mediaUrl && (
                <div className="mb-4 relative w-full" style={{ paddingTop: '75%' /* 4:3 Aspect Ratio */ }}>
                  {item.mediaType === 'video' ? (
                    <video src={`http://localhost:5000/uploads/gallery/${item.mediaUrl}`} controls className="absolute top-0 left-0 w-full h-full rounded-lg object-cover" />
                  ) : (
                    <img src={`http://localhost:5000/uploads/gallery/${item.mediaUrl}`} alt={item.title} className="absolute top-0 left-0 w-full h-full rounded-lg object-cover" />
                  )}
                </div>
              )}
              <div className="flex-grow flex flex-col">
                <h3 className="text-lg font-semibold text-foreground mb-2 break-words">{item.title}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </span>
                  )}
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {item.category}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs capitalize">
                    {item.mediaType}
                  </span>
                </div>
                <div className="flex-grow">
                  <Description text={item.description} />
                </div>
                <div className="text-sm text-muted-foreground space-y-1 mt-auto pt-2">
                  {item.location && <p className="truncate">📍 {item.location}</p>}
                  <p>{item.dateTaken ? new Date(item.dateTaken).toLocaleDateString() : 'N/A'}</p>
                  <p>🔗 <a href={`http://localhost:5000/uploads/gallery/${item.mediaUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Media</a></p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4 border-t pt-4">
                <button
                  onClick={() => onEdit(item)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm w-full"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm w-full"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryList;
