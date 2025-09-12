import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface GalleryManagementProps {
  onGalleryAdded: () => void;
  gallery?: any; // Optional prop for editing
  onGalleryUpdated?: (id: number, data: FormData) => void; // Optional prop for updating
}

const GalleryManagement = ({ onGalleryAdded, gallery, onGalleryUpdated }: GalleryManagementProps) => {
  const [galleryData, setGalleryData] = useState({
    title: "",
    category: "Child Development",
    description: "",
    location: "",
    dateTaken: "",
    tags: "",
    featured: false,
    status: "published",
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    if (gallery) {
      setGalleryData({
        title: gallery.title || "",
        category: gallery.category || "Child Development",
        description: gallery.description || "",
        location: gallery.location || "",
        dateTaken: gallery.dateTaken ? gallery.dateTaken.split('T')[0] : "", // Format date for input
        tags: gallery.tags || "",
        featured: gallery.featured || false,
        status: gallery.status || "published",
      });
    }
  }, [gallery]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const value: string | boolean =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setGalleryData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mediaFile && !gallery) {
      alert("Please select a media file to upload.");
      return;
    }
    
    try {
      const formData = new FormData();
      if (mediaFile) {
        formData.append('media', mediaFile);
      }
      formData.append('title', galleryData.title);
      formData.append('description', galleryData.description);
      formData.append('category', galleryData.category);
      formData.append('location', galleryData.location);
      formData.append('dateTaken', galleryData.dateTaken);
      formData.append('tags', galleryData.tags);
      formData.append('featured', galleryData.featured.toString());
      formData.append('status', galleryData.status);
      
      if (gallery) {
        // Update existing gallery item
        if (onGalleryUpdated) {
          await onGalleryUpdated(gallery.id, formData);
          alert("Gallery item updated successfully!");
        }
      } else {
        // Create new gallery item
        await axios.post("http://localhost:5000/api/gallery", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert("Gallery item added successfully!");
      }
      
      setGalleryData({
        title: "",
        category: "Child Development",
        description: "",
        location: "",
        dateTaken: "",
        tags: "",
        featured: false,
        status: "published",
      });
      setMediaFile(null);
      onGalleryAdded();
    } catch (err) {
      alert("Failed to save gallery item.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Gallery Item Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter gallery item title..."
            value={galleryData.title}
            onChange={handleChange}
            required
            className="input h-12"
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Category
          </label>
          <select
            name="category"
            value={galleryData.category}
            onChange={handleChange}
            required
            className="input h-12"
          >
            <option value="Child Development">Child Development</option>
            <option value="Community Empowerment">Community Empowerment</option>
            <option value="HIV/AIDS Support">HIV/AIDS Support</option>
            <option value="Social Accountability">Social Accountability</option>
            <option value="Events">Events</option>
            <option value="Training">Training</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-bold text-foreground">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Write a description for this gallery item..."
          value={galleryData.description}
          onChange={handleChange}
          required
          rows={6}
          className="input min-h-[150px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Enter location..."
            value={galleryData.location}
            onChange={handleChange}
            className="input h-12"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Date Taken
          </label>
          <input
            type="date"
            name="dateTaken"
            value={galleryData.dateTaken}
            onChange={handleChange}
            className="input h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            placeholder="Enter tags separated by commas..."
            value={galleryData.tags}
            onChange={handleChange}
            className="input h-12"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Media File
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="input h-12"
          />
          {gallery && gallery.mediaUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Current media:</p>
              {gallery.mediaType === 'video' ? (
                <video src={`http://localhost:5000/uploads/gallery/${gallery.mediaUrl}`} controls className="w-full h-auto rounded-lg" />
              ) : (
                <img src={`http://localhost:5000/uploads/gallery/${gallery.mediaUrl}`} alt={gallery.title} className="w-full h-auto rounded-lg" />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="featured"
            checked={galleryData.featured}
            onChange={handleChange}
            className="rounded"
          />
          <span className="text-sm font-bold text-foreground">Featured Item</span>
        </label>
      </div>


      <button
        type="submit"
        className="bg-gradient-primary hover:bg-gradient-hero text-primary-foreground px-10 py-6 h-auto font-bold text-lg shadow-glow hover:shadow-xl transition-all duration-300 rounded-lg"
      >
        {gallery ? 'Update Gallery Item' : 'Add to Gallery'}
      </button>
    </form>
  );
};

export default GalleryManagement;