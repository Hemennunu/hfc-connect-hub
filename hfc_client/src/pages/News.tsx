import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import { io } from "socket.io-client";
import ReadMore from "../components/ReadMore";

const socket = io("http://localhost:5000"); // Backend Socket.IO URL

const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/news");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNewsArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setNewsArticles([]);
        setLoading(false);
      }
    };

    fetchNews();

    socket.on("newsUpdated", () => {
      fetchNews();
    });

    return () => {
      socket.off("newsUpdated");
    };
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      "Partnership": "bg-purple-100 text-purple-800",
      "Project Update": "bg-blue-100 text-blue-800",
      "Annual Report": "bg-green-100 text-green-800",
      "Emergency Response": "bg-red-100 text-red-800",
      "Program Success": "bg-orange-100 text-orange-800",
      "Sustainability": "bg-teal-100 text-teal-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = newsArticles.filter(article => !article.featured);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex justify-center items-center">
          <span className="text-2xl text-muted-foreground animate-pulse">Loading news...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              News & Updates
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Stay informed about our latest projects, partnerships, and impact stories
            </p>
          </div>
        </section>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Featured Story</h2>
              <Card
                className="max-w-4xl mx-auto shadow-strong overflow-hidden transition-transform duration-500 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="md:flex">
                  <div className="md:w-1/2 relative group">
                    <img
                      src={featuredArticle.mediaUrl || "/default-image.jpg"}
                      alt={featuredArticle.title}
                      className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.src = "/default-image.jpg"; }}
                    />
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-between">
                    <Badge className={`mb-4 ${getCategoryColor(featuredArticle.category)} uppercase font-semibold tracking-wide`}>
                      {featuredArticle.category}
                    </Badge>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">{featuredArticle.title}</h3>
                    <ReadMore 
                      text={featuredArticle.content}
                      maxLength={300}
                      className="text-muted-foreground mb-6"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{featuredArticle.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(featuredArticle.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* News Grid */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Latest News</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map(article => (
                <Card
                  key={article._id}
                  className="shadow-medium hover:shadow-strong transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  tabIndex={0} // keyboard accessible
                >
                  <img
                    src={article.mediaUrl || "/default-image.jpg"}
                    alt={article.title}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105 rounded-t"
                    onError={(e) => { e.currentTarget.src = "/default-image.jpg"; }}
                  />
                  <CardHeader>
                    <Badge className={`w-fit mb-2 ${getCategoryColor(article.category)} uppercase font-semibold`}>
                      {article.category}
                    </Badge>
                    <CardTitle className="text-lg text-foreground line-clamp-2">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReadMore 
                      text={article.content}
                      maxLength={150}
                      className="text-muted-foreground mb-4 text-sm"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(article.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" aria-label={`Read more about ${article.title}`}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-gradient-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-primary-foreground">Stay Updated</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
              Subscribe to our newsletter to receive the latest updates about our projects,
              impact stories, and ways to get involved.
            </p>
            <a
              href="mailto:newsletter@hfc.org?subject=Newsletter Subscription"
              className="inline-flex items-center px-8 py-4 bg-secondary text-secondary-foreground rounded-lg shadow-medium hover:shadow-strong transform hover:-translate-y-1 transition-all"
            >
              Subscribe to Newsletter
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default News;
