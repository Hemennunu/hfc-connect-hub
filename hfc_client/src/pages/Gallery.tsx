import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReadMore from '../components/ReadMore';
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Eye } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Backend Socket.IO URL

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  location?: string;
  date: string;
  mediaUrl: string;
  mediaType: string;
  featured: boolean;
}

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gallery");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGalleryItems(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch gallery items:", err);
        setGalleryItems([]);
        setLoading(false);
      }
    };

    fetchGalleryItems();

    socket.on("galleryUpdated", () => {
      fetchGalleryItems();
    });

    return () => {
      socket.off("galleryUpdated");
    };
  }, []);

  // Group gallery items by category
  const galleryAlbums = galleryItems.reduce((albums: any[], item) => {
    console.log('Gallery item:', item); // Debug log
    const existingAlbum = albums.find(album => album.category === item.category);
    if (existingAlbum) {
      existingAlbum.images.push({
        id: item._id,
        title: item.title,
        location: item.location || "Ethiopia",
        date: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recent",
        mediaUrl: item.mediaUrl,
        mediaType: item.mediaType,
        description: item.description
      });
    } else {
      albums.push({
        category: item.category,
        description: getCategoryDescription(item.category),
        images: [{
          id: item._id,
          title: item.title,
          location: item.location || "Ethiopia",
          date: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recent",
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
          description: item.description
        }]
      });
    }
    return albums;
  }, []);

  function getCategoryDescription(category: string): string {
    const descriptions: { [key: string]: string } = {
      "Child Development": "Our programs supporting children's health, education, and wellbeing",
      "Community Empowerment": "Empowering communities through livelihood and capacity building programs",
      "HIV/AIDS Support": "Comprehensive care and support for people living with HIV/AIDS",
      "Social Accountability": "Promoting transparency, accountability, and good governance",
      "Events": "Special events and community gatherings",
      "Training": "Capacity building and skills development programs"
    };
    return descriptions[category] || "Our impactful work in the community";
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Child Development": "bg-blue-100 text-blue-800",
      "Community Empowerment": "bg-green-100 text-green-800",
      "HIV/AIDS Support": "bg-red-100 text-red-800",
      "Social Accountability": "bg-purple-100 text-purple-800",
      "Events": "bg-orange-100 text-orange-800",
      "Training": "bg-teal-100 text-teal-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex justify-center items-center">
          <span className="text-2xl text-muted-foreground animate-pulse">Loading gallery...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-primary via-accent to-primary-glow relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-3"></div>
          </div>
          <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight">
              <span style={{ color: '#fad25b' }}>Gallery</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
              Capturing moments of hope, progress, and transformation in our communities
            </p>
          </div>
        </section>

        {/* Dynamic Photo Gallery Albums */}
        <section className="py-24 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            {galleryAlbums.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                  No Gallery Items <span className="text-primary">Yet</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Gallery items will appear here once they are added by the organization.
                </p>
              </div>
            ) : (
              <div className="space-y-20">
                {galleryAlbums.map((album, albumIndex) => (
                  <div key={albumIndex} className="space-y-12">
                    <div className="text-center">
                      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                        <span className="text-primary">{album.category}</span>
                      </h2>
                      <ReadMore 
                        text={album.description} 
                        maxLength={100}
                        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                      />
                    </div>
                    
                    <Carousel className="w-full">
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {album.images.map((image: any) => (
                          <CarouselItem key={image.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                            <Card className="group overflow-hidden shadow-medium hover:shadow-strong transition-all duration-300 transform hover:-translate-y-2">
                              <div className="relative">
                                {image.mediaType === 'video' ? (
                                  <video
                                    src={image.mediaUrl}
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                    controls
                                    preload="metadata"
                                    onError={(e) => {
                                      console.log('Video error:', e);
                                      console.log('Video URL:', image.mediaUrl);
                                    }}
                                  >
                                    <source src={image.mediaUrl} type="video/mp4" />
                                    <source src={image.mediaUrl} type="video/webm" />
                                    <source src={image.mediaUrl} type="video/ogg" />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : (
                                  <img
                                    src={image.mediaUrl}
                                    alt={image.title}
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => { 
                                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"; 
                                    }}
                                  />
                                )}
                                {/* Debug info */}
                                {image.mediaType === 'video' && (
                                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                    VIDEO: {image.mediaType}
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                  <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <Badge 
                                  className={`absolute top-4 left-4 ${getCategoryColor(album.category)}`}
                                >
                                  {album.category}
                                </Badge>
                              </div>
                              <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                                  {image.title}
                                </h3>
                                <ReadMore 
                                  text={image.description} 
                                  maxLength={80}
                                  className="text-muted-foreground mb-4 text-sm"
                                />
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">{image.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">{image.date}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </Carousel>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Admin Management Info
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-foreground">Gallery Management</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Gallery items are now managed dynamically through the admin panel. 
              Admins can add, edit, and delete gallery items in real-time.
            </p>
            <div className="bg-card p-8 rounded-lg shadow-medium max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Dynamic Content</h3>
              <p className="text-muted-foreground">
                This gallery now displays content from the database and updates automatically 
                when admins make changes.
              </p>
            </div>
          </div>
        </section> */}

        {/* Share Your Story CTA
        <section className="py-20 bg-gradient-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-secondary-foreground">Share Your Story</h2>
            <p className="text-xl mb-8 text-secondary-foreground/90 max-w-3xl mx-auto">
              Have photos or stories from our projects? We'd love to feature them in our gallery 
              to showcase the impact of our collective efforts.
            </p>
            <a 
              href="mailto:gallery@hfc.org" 
              className="inline-flex items-center px-8 py-4 bg-white text-secondary rounded-lg shadow-medium hover:shadow-strong transform hover:-translate-y-1 transition-all"
            >
              Submit Photos
              <Eye className="w-5 h-5 ml-2" />
            </a>
          </div>
        </section> */}
      </div>
    </Layout>
  );
};

export default Gallery;