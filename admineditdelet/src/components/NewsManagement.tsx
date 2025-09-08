// src/components/NewsAdminForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface News {
  id?: number;
  title: string;
  type: string;
  content: string;
  date?: string;
  eventDate?: string;
  location?: string;
  mediaUrl?: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

const NewsAdminForm = ({ onNewsAdded }: { onNewsAdded: () => void }) => {
  const [newsData, setNewsData] = useState({
    title: "",
    type: "announcement",
    content: "",
    date: "",
    eventDate: "",
    location: "",
    mediaUrl: "",
    featured: false,
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

    setNewsData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/news", newsData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("News article added successfully!");
      setNewsData({
        title: "",
        type: "announcement",
        content: "",
        date: "",
        eventDate: "",
        location: "",
        mediaUrl: "",
        featured: false,
      });
      onNewsAdded();
    } catch (err) {
      alert("Failed to add news article.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Article Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter article title..."
            value={newsData.title}
            onChange={handleChange}
            required
            className="input h-12"
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Article Type
          </label>
          <select
            name="type"
            value={newsData.type}
            onChange={handleChange}
            required
            className="input h-12"
          >
            <option value="announcement">Announcement</option>
            <option value="event">Event</option>
            <option value="successStory">Success Story</option>
            <option value="pressRelease">Press Release</option>
            <option value="industryNews">Industry News</option>
            <option value="blog">Blog</option>
            <option value="multimedia">Multimedia</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-bold text-foreground">
          Content
        </label>
        <textarea
          name="content"
          placeholder="Write your article content here..."
          value={newsData.content}
          onChange={handleChange}
          required
          rows={8}
          className="input min-h-[200px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Publication Date
          </label>
          <input
            type="date"
            name="date"
            value={newsData.date}
            onChange={handleChange}
            className="input h-12"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-foreground">
            Media URL (optional)
          </label>
          <input
            type="url"
            name="mediaUrl"
            placeholder="Enter media URL..."
            value={newsData.mediaUrl}
            onChange={handleChange}
            className="input h-12"
          />
        </div>
      </div>

      {newsData.type === "event" && (
        <div className="bg-accent-glow/10 p-6 rounded-lg border border-accent/30">
          <h3 className="text-lg font-bold text-foreground mb-4">Event Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">
                Event Date
              </label>
              <input
                type="date"
                name="eventDate"
                value={newsData.eventDate}
                onChange={handleChange}
                className="input h-12"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">
                Event Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter event location..."
                value={newsData.location}
                onChange={handleChange}
                className="input h-12"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="featured"
            checked={newsData.featured}
            onChange={handleChange}
            className="w-5 h-5 text-accent bg-background border-gray-300 rounded focus:ring-accent focus:ring-2"
          />
          <span className="text-sm font-bold text-foreground">Featured Article</span>
        </label>
      </div>

      <button
        type="submit"
        className="bg-gradient-primary hover:bg-gradient-hero text-primary-foreground px-10 py-6 h-auto font-bold text-lg shadow-glow hover:shadow-xl transition-all duration-300 rounded-lg"
      >
        Publish Article
      </button>
    </form>
  );
};

export default NewsAdminForm;
