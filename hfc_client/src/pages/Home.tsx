import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Globe, Target, ArrowRight, CheckCircle, Baby, Building2, Shield, Stethoscope } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import Partners from "../components/Partners";
import HorizontalStats from "../components/HorizontalStats";
import axios from "axios";

// Add JSX namespace declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    }
  }
}

interface TypewriterProps {
  words: string[];
  delay?: number;
  deleteDelay?: number;
  loopDelay?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ 
  words, 
  delay = 100, 
  deleteDelay = 1000, 
  loopDelay = 2000 
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    if (isDeleting) {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, delay);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
    } else {
      if (currentText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, delay);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, deleteDelay);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentText, currentWordIndex, isDeleting, words, delay, deleteDelay]);

  return (
    <span className="inline-block min-h-[1.2em]" style={{ color: '#fad25b' }}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

interface StatItem {
  _id: string;
  number: string;
  label: string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
  secondaryNumber?: string;
  secondaryLabel?: string;
  additionalNumbers?: string[];
  additionalLabel?: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

const Home: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stats/active');
        const apiStats = response.data;
        
        // Sort by order
        const sortedStats = [...apiStats].sort((a, b) => a.order - b.order);
        
        // If no stats found, use fallback
        if (sortedStats.length === 0) {
          throw new Error('No active statistics found');
        }
        
        setStats(sortedStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to default stats if API fails
        setStats([
          {
            _id: 'fallback-1',
            number: "2,100+",
            label: "Children Sponsored",
            icon: 'users',
            color: 'blue' as const,
            isActive: true,
            order: 1
          },
          {
            _id: 'fallback-2',
            number: "26+",
            label: "Woredas Reached",
            icon: 'globe',
            color: 'green' as const,
            isActive: true,
            order: 2
          },
          {
            _id: 'fallback-3',
            number: "19+",
            label: "Years of Service",
            icon: 'target',
            color: 'orange' as const,
            isActive: true,
            order: 3
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Define FocusArea interface at the top level
  interface FocusArea {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }

  // Move focusAreas array inside the component
  const focusAreas: FocusArea[] = [
    {
      icon: Baby,
      title: "Child & Youth Development",
      description: "Comprehensive support for orphans and vulnerable children including health, education and nutrition."
    },
    {
      icon: Building2,
      title: "Community Empowerment",
      description: "Building livelihoods and strengthening community capacity for sustainable development."
    },
    {
      icon: Shield,
      title: "Good Governance & Human Rights",
      description: "Promoting transparency, accountability, and civic engagement in communities."
    },
    {
      icon: Stethoscope,
      title: "HIV/AIDS Prevention & Care",
      description: "Comprehensive HIV/AIDS prevention, care and support programs for affected communities."
    }
  ];

  const achievements = [
    "Reached over 27,000 orphans and vulnerable children",
    "Supported more than 10,000 people living with HIV/AIDS",
    "Mobilized 450 volunteer service providers",
    "Operated 12 group homes caring for 130 children",
    "HFC has supported and empowered over 2,100 children through our Sponsorship Project, helping them grow from Childhood vulnerable beginnings to living independent and fulfilling lives.",
"Through our Social Accountability Program, we have strengthened the delivery of essential social services such as water, education, health, agriculture, and roads helping government institutions meet service standards. Our efforts have made a significant impact in improving service provision and promoting inclusive community participation in good governance across more than 26 target woredas in Oromia, Harari Region, and Dire Dawa City Administration.",
"For 19 years, HFC's Youth Learning Center has empowered children with computer skills, tutoring, English, and arts. Many have since advanced to high-level careers and opportunities abroad, success built on the foundation HFC provided."
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-accent/60" />
        
        <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <div className="block animate-fade-in-up">
              <Typewriter 
                words={[
                  "Creating Hope,",
                  "Changing Lives",
                  "Building Futures",
                  "Empowering Communities",
                  "Transforming Lives"
                ]} 
                delay={150}
                deleteDelay={2000}
              />
            </div>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto text-white/95 animate-fade-in-up animation-delay-600 leading-relaxed font-light">
            Join us in our mission to build stronger communities through sustainable 
            development, education, and humanitarian aid across the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-800">
            <Link to="/donate">
              <Button variant="hero" size="lg" className="text-lg px-10 py-4 font-semibold shadow-strong hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1">
                Donate Now
                <Heart className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="outline" size="lg" className="text-lg px-10 py-4 bg-white/15 border-white/40 text-white hover:bg-white hover:text-primary font-semibold backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1">
                Our Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <HorizontalStats stats={stats} loading={loading} />

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 text-foreground leading-tight">
              Our <span className="text-primary">Mission</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 leading-relaxed font-light max-w-4xl mx-auto">
              HFCO is dedicated to fostering the development of highly vulnerable community members, 
              children, women, youth, and their caregivers, empowering them to become self-sufficient 
              and responsible members of their communities through a participatory and holistic approach.
            </p>
            <Link to="/about">
              <Button variant="default" size="lg" className="px-10 py-4 text-lg font-semibold shadow-medium hover:shadow-strong transition-all duration-300 transform hover:-translate-y-1">
                Learn More About Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-24 bg-gradient-card">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Our <span className="text-primary">Focus Areas</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We focus on four key areas to create lasting impact in communities
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {focusAreas.map((area, index) => (
              <Card key={index} className="group shadow-medium hover:shadow-strong transition-all duration-500 transform hover:-translate-y-3 border-0 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50 hover:from-blue-50 hover:via-indigo-50 hover:to-blue-100 backdrop-blur-sm">
                <CardContent className="p-8 lg:p-10 text-center h-full flex flex-col">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: '#fad25b', boxShadow: '0 8px 25px rgba(250, 210, 91, 0.3)' }}>
                    <area.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                    {area.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base lg:text-lg flex-grow">
                    {area.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-24 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/80">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
                Our <span className="text-primary">Impact</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Measuring success through the lives we've touched and communities we've transformed
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {achievements.map((achievement, index) => (
                <Card key={index} className="group shadow-medium hover:shadow-strong transition-all duration-500 transform hover:-translate-y-3 border-0 bg-gradient-to-br from-white/90 via-blue-50/70 to-indigo-50/80 hover:from-white hover:via-blue-50 hover:to-indigo-100 backdrop-blur-sm">
                  <CardContent className="flex items-start space-x-6 p-8 lg:p-10">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: '#fad25b', boxShadow: '0 4px 15px rgba(250, 210, 91, 0.3)' }}>
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-foreground font-medium leading-relaxed text-base lg:text-lg group-hover:text-primary transition-colors duration-300">{achievement}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <Partners />

    </div>
  );
};

export default Home;