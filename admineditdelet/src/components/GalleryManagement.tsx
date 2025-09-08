// src/components/GalleryManagement.tsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const GalleryManagement = ({ onGalleryAdded }: { onGalleryAdded: () => void }) => {
  const [galleryData, setGalleryData] = useState({
    title: "",
    category: "Child Development",
    description: "",
    mediaUrl: "",
    mediaType: "photo",
  });

  const { token } = useAuth();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/gallery", galleryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Gallery item added successfully!");
      setGalleryData({
        title: "",
        category: "Child Development",
        description: "",
        mediaUrl: "",
        mediaType: "photo",
      });
      onGalleryAdded();
    } catch (err) {
      alert("Failed to add gallery item.");
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
            Media URL
          </label>
          <input
            type="url"
            name="mediaUrl"
            placeholder="Enter image/video URL..."
            value={galleryData.mediaUrl}
            onChange={handleChange}
            required
            className="input h-12"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Media Type
          </label>
          <select
            name="mediaType"
            value={galleryData.mediaType}
            onChange={handleChange}
            className="input h-12"
          >
            <option value="photo">Photo</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>


      <button
        type="submit"
        className="bg-gradient-primary hover:bg-gradient-hero text-primary-foreground px-10 py-6 h-auto font-bold text-lg shadow-glow hover:shadow-xl transition-all duration-300 rounded-lg"
      >
        Add to Gallery
      </button>
    </form>
  );
};

export default GalleryManagement;
