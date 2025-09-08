// src/components/GalleryList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  category: 'events' | 'projects' | 'community' | 'facilities' | 'staff' | 'beneficiaries';
  location?: string;
  dateTaken?: string;
  tags?: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

const GalleryList = ({ refresh }: { refresh: number }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
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

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await axios.put(
        `http://localhost:5000/api/gallery/${editingItem.id}`,
        editingItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingItem(null);
      fetchGalleryItems();
      alert("Gallery item updated successfully!");
    } catch (err) {
      alert("Failed to update gallery item.");
      console.error(err);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!editingItem) return;
    
    const value = e.target.type === "checkbox" 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;

    setEditingItem({
      ...editingItem,
      [e.target.name]: value,
    });
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
        <div className="grid gap-6">
          {galleryItems.map((item) => (
            <div key={item.id} className="bg-card p-6 rounded-lg shadow-medium border">
              {editingItem?.id === item.id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="title"
                      value={editingItem.title}
                      onChange={handleEditChange}
                      className="input"
                      placeholder="Title"
                    />
                    <select
                      name="category"
                      value={editingItem.category}
                      onChange={handleEditChange}
                      className="input"
                    >
                      <option value="Child Development">Child Development</option>
                      <option value="Community Empowerment">Community Empowerment</option>
                      <option value="HIV/AIDS Support">HIV/AIDS Support</option>
                      <option value="Social Accountability">Social Accountability</option>
                      <option value="Events">Events</option>
                      <option value="Training">Training</option>
                    </select>
                  </div>
                  <textarea
                    name="description"
                    value={editingItem.description}
                    onChange={handleEditChange}
                    className="input w-full"
                    rows={3}
                    placeholder="Description"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="location"
                      value={editingItem.location || ""}
                      onChange={handleEditChange}
                      className="input"
                      placeholder="Location"
                    />
                    <input
                      type="date"
                      name="dateTaken"
                      value={editingItem.dateTaken ? editingItem.dateTaken.split('T')[0] : ''}
                      onChange={handleEditChange}
                      className="input"
                    />
                    <select
                      name="mediaType"
                      value={editingItem.mediaType}
                      onChange={handleEditChange}
                      className="input"
                    >
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <input
                    type="url"
                    name="mediaUrl"
                    value={editingItem.mediaUrl}
                    onChange={handleEditChange}
                    className="input w-full"
                    placeholder="Media URL"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={editingItem.featured}
                      onChange={handleEditChange}
                      className="w-4 h-4"
                    />
                    <span>Featured</span>
                  </label>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      {item.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                          Featured
                        </span>
                      )}
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {item.category}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        {item.mediaType}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-2">{item.description}</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {item.location && <p>📍 {item.location}</p>}
                      <p className="text-sm text-gray-600">{item.dateTaken ? new Date(item.dateTaken).toLocaleDateString() : 'N/A'}</p>
                      <p>🔗 <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Media</a></p>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryList;
