import React, { useState, useEffect } from 'react';
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, MapPin, Calendar, Award, Users, Heart, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { io } from 'socket.io-client';
import ReadMore from '../components/ReadMore';

const socket = io('http://localhost:5000');

interface Alumni {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  currentOccupation: string;
  company?: string;
  location?: string;
  yearsInProgram: string;
  graduationYear: number;
  successStory: string;
  achievements: string[];
  linkedinProfile?: string;
  websiteUrl?: string;
  testimonial?: string;
  impactStatement?: string;
  mentorshipAvailable: boolean;
  consented?: boolean;
  isPublic?: boolean;
  createdByAdmin?: boolean;
  createdAt: string;
}

const Alumni = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlumni = async () => {
    try {
      console.log('Fetching alumni from API...');
      const response = await fetch('http://localhost:5000/api/alumni/public');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Alumni data received:', data);
      setAlumni(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alumni:', error);
      setAlumni([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
    
    // Socket listeners for real-time updates
    socket.on('alumniCreated', (newAlumni: Alumni) => {
      console.log('Socket: Alumni created', newAlumni);
      if (newAlumni.consented && newAlumni.isPublic) {
        setAlumni(prev => [newAlumni, ...prev]);
      }
    });
    
    socket.on('alumniUpdated', (updatedAlumni: Alumni) => {
      console.log('Socket: Alumni updated', updatedAlumni);
      if (updatedAlumni.consented && updatedAlumni.isPublic) {
        setAlumni(prev => prev.map(alumni => 
          alumni.id === updatedAlumni.id ? updatedAlumni : alumni
        ));
      }
    });
    
    socket.on('alumniApproved', (approvedAlumni: Alumni) => {
      console.log('Socket: Alumni approved', approvedAlumni);
      if (approvedAlumni.consented && approvedAlumni.isPublic) {
        setAlumni(prev => {
          const exists = prev.find(alumni => alumni.id === approvedAlumni.id);
          if (exists) {
            return prev.map(alumni => 
              alumni.id === approvedAlumni.id ? approvedAlumni : alumni
            );
          } else {
            return [approvedAlumni, ...prev];
          }
        });
      }
    });
    
    socket.on('alumniDeleted', (deletedId: string) => {
      console.log('Socket: Alumni deleted', deletedId);
      setAlumni(prev => prev.filter(alumni => alumni.id !== deletedId));
    });

    return () => {
      socket.off('alumniCreated');
      socket.off('alumniUpdated');
      socket.off('alumniApproved');
      socket.off('alumniDeleted');
    };
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              Our <span style={{ color: '#fad25b' }}>Alumni</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
              Meet the inspiring individuals who have transformed their lives through our programs
              and are now making a difference in their communities.
            </p>
          </div>
        </section>

        {/* Alumni Information Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center text-foreground">
                What Alumni Mean?
              </h2>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/40">
                {/* Organization Overview */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-3"></div>
                    Organization Overview
                  </h3>
                  <div className="pl-5 border-l-2 border-purple-200 bg-purple-50/50 rounded-r-lg p-4">
                    <ReadMore 
                      text="Hope for Children Organization is legally recognized local NGO registered with re-registration No. 0016/2019. For the past 25 years since its inception, our organization has been a visionary that all children grow in a happy and healthy environment. We are committed to create productive, responsible and economically viable generation. It is an indigenous humanitarian organization having significant contributions to upbringing of orphans, provide comprehensive support and care to various vulnerable communities, as well as rehabilitating street youth, empowerment of women, and community capacity building and facilitating initiatives to create a good governance and protection of human right."
                      maxLength={200}
                      className="text-base leading-relaxed text-gray-700"
                    />
                  </div>
                </div>

                {/* Alumni Association */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-teal-500 rounded-full mr-3"></div>
                    Alumni Association
                  </h3>
                  <div className="pl-5 border-l-2 border-blue-200 bg-blue-50/50 rounded-r-lg p-4">
                    <ReadMore 
                      text="Hope for Children Organization has played a significant role in creating productive, responsible and economically viable generation in the last 25 years. As a result, the establishment of former HFC beneficiaries group or alumni association is a strategic action plan of Hope for Children. HFC former Beneficiaries Alumni aims at establishing robust link between HFC and its former group home, sponsorship, Youth Learning Center and other project beneficiaries. It commits itself to form an interwoven network of interaction between Hope for Children Organization and its former family and among the recent beneficiaries themselves. HFC has a strong belief that its former beneficiaries are potential assets and can have enormous contributions to its success if they are mobilized and kept connected. Our alumni engagement strategy is a long-term goal that demands consistent communication, evolving measures, and above all, an understanding of our beneficiaries. Official establishment of alumni started in October 2022."
                      maxLength={250}
                      className="text-base leading-relaxed text-gray-700"
                    />
                  </div>
                </div>

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl border border-purple-300 shadow-lg">
                    <h4 className="text-xl font-semibold mb-3 text-purple-800 flex items-center">
                      <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                      Vision
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      To establish sustained interactions with our beneficiaries, donors, and staff members nationally and internationally and ensure that the organization and its family benefit out of such sustained interaction.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl border border-blue-300 shadow-lg">
                    <h4 className="text-xl font-semibold mb-3 text-blue-800 flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                      Mission
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Establish National and international alumni chapters and ensure that they are kept connected to Hope for Children Organization. Foster a spirit of loyalty and to promote the general welfare of Hope for Children Organization. Alumni associations exist to support the parent organization's goals, and to strengthen the ties between alumni, the community, and the parent organization.
                    </p>
                  </div>
                </div>

                {/* Objectives */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-teal-500 to-green-500 rounded-full mr-3"></div>
                    Key Objectives
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 pl-5">
                    <div className="flex items-start space-x-3 p-4 bg-teal-100 rounded-lg border border-teal-300 shadow-sm">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">Strengthen the existing chapters abroad, Create and maintain a lifelong link between HFC and its family, as well as the broader community.</p>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-green-100 rounded-lg border border-green-300 shadow-sm">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">Encourage Alumni participation in fundraising initiatives of the organization and any other activity that could benefit HFC to realize its mission.</p>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-blue-100 rounded-lg border border-blue-300 shadow-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">Foster a sense of loyalty between Hope for Children and its alumni by means of HFC memorabilia.</p>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-purple-100 rounded-lg border border-purple-300 shadow-sm">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">Serve as a platform of continuous and networked interaction among its former beneficiaries to help them share information and experiences.</p>
                    </div>
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-primary flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></div>
                    Purpose of Alumni Association
                  </h3>
                  <div className="space-y-4 pl-5">
                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">Due to Alumni Association former HFC beneficiaries feel obliged and honored to return the favors and successes as well as the Alma Mater also get benefit and grow enormously in terms of both sharing relevant idea and fund raising to enhancing the organization at national and international level.</p>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">HFC Alumni Association plays an important role in awaking HFC Children about opportunities available to help and engage into HFC humanitarian work. The association will be a crucial forum to exchange information especially what the organization beneficiaries guiding and helping those who are just benefiting from HFC.</p>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-teal-50 rounded-lg border border-teal-200 shadow-sm">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">Former HFC beneficiaries, staff members, donors as well as recent beneficiaries can easily meet on their good old days, friends and group home mates.</p>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">Former beneficiaries will benefit in accessing relevant and timely information regarding their organizational success and fail.</p>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200 shadow-sm">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">HFC Alumni Association also engages in organizing events of different types to keep former beneficiaries in touch with their mother home organization.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alumni Grid */}
        <section className="py-20 relative overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/src/assets/success.jpg')`,
              filter: 'blur(1px) brightness(0.3)',
              transform: 'scale(1.1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-pink-900/60" />
          
          <div className="container mx-auto px-4 relative z-10">
            {alumni.length === 0 ? (
              <div className="text-center py-20">
                <Users className="w-16 h-16 mx-auto mb-4 text-white/70" />
                <h3 className="text-2xl font-semibold mb-2 text-white drop-shadow-lg">No Alumni Yet</h3>
                <p className="text-white/80 drop-shadow">
                  Alumni profiles will appear here once they are added and approved.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-12 text-center text-white drop-shadow-lg">
                  Success Stories ({alumni.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {alumni.map((person) => (
                    <Card
                      key={person.id}
                      className="shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer overflow-hidden bg-white border-0 rounded-2xl"
                    >
                      {/* Profile Section with Circular Image */}
                      <div className="relative pt-8 pb-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                        <div className="flex flex-col items-center">
                          {/* Circular Profile Image */}
                          <div className="relative w-24 h-24 mb-4">
                            {person.profileImage ? (
                              <img
                                src={`http://localhost:5000/uploads/alumni/${person.profileImage}`}
                                alt={person.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`${person.profileImage ? 'hidden' : ''} w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg`}>
                              <span className="text-white text-2xl font-bold">
                                {person.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            
                            {/* Mentorship Badge */}
                            {person.mentorshipAvailable && (
                              <Badge className="absolute -bottom-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs shadow-md">
                                <Heart className="w-3 h-3 mr-1" />
                                Mentor
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl font-bold text-foreground mb-3">{person.name}</CardTitle>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center justify-center">
                            <Award className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="font-medium">{person.currentOccupation}</span>
                          </div>
                          {person.company && (
                            <div className="flex items-center justify-center">
                              <Users className="w-4 h-4 mr-2 text-purple-500" />
                              <span>{person.company}</span>
                            </div>
                          )}
                          {person.location && (
                            <div className="flex items-center justify-center">
                              <MapPin className="w-4 h-4 mr-2 text-green-500" />
                              <span>{person.location}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-center">
                            <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                            <span className="font-medium">Class of {person.graduationYear}</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-4">
                          {/* Success Story */}
                          <div>
                            <h4 className="font-semibold mb-2 text-foreground flex items-center">
                              <Award className="w-4 h-4 mr-2 text-blue-500" />
                              Success Story
                            </h4>
                            <ReadMore 
                              text={person.successStory}
                              maxLength={120}
                              className="text-sm text-muted-foreground"
                            />
                          </div>

                          {/* Achievements */}
                          {person.achievements && person.achievements.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2 text-foreground flex items-center">
                                <Users className="w-4 h-4 mr-2 text-purple-500" />
                                Key Achievements
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {person.achievements.slice(0, 3).map((achievement, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                                    {achievement}
                                  </Badge>
                                ))}
                                {person.achievements.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-600">
                                    +{person.achievements.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Testimonial */}
                          {person.testimonial && (
                            <div>
                              <h4 className="font-semibold mb-2 text-foreground flex items-center">
                                <Heart className="w-4 h-4 mr-2 text-pink-500" />
                                Testimonial
                              </h4>
                              <ReadMore 
                                text={`"${person.testimonial}"`}
                                maxLength={100}
                                className="text-sm text-muted-foreground italic"
                              />
                            </div>
                          )}

                          {/* Impact Statement */}
                          {person.impactStatement && (
                            <div>
                              <h4 className="font-semibold mb-2 text-foreground flex items-center">
                                <ExternalLink className="w-4 h-4 mr-2 text-green-500" />
                                Impact Statement
                              </h4>
                              <ReadMore 
                                text={person.impactStatement}
                                maxLength={100}
                                className="text-sm text-muted-foreground"
                              />
                            </div>
                          )}

                          {/* Social Links */}
                          <div className="flex justify-center space-x-4 pt-4 border-t border-gray-100">
                            {person.linkedinProfile && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                              >
                                <a
                                  href={person.linkedinProfile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Linkedin className="w-4 h-4 mr-2" />
                                  LinkedIn
                                </a>
                              </Button>
                            )}
                            {person.websiteUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="rounded-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                              >
                                <a
                                  href={person.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Website
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-gradient-to-br from-primary via-accent to-primary-glow relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-3"></div>
          </div>
          <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
              Join Our <span style={{ color: '#fad25b' }}>Community</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
              Our alumni network continues to grow, creating opportunities for mentorship,
              collaboration, and positive impact in communities worldwide.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-12 py-5 rounded-xl shadow-strong hover:shadow-glow transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 text-lg font-semibold"
              style={{ backgroundColor: '#fad25b', color: '#1e293b' }}
            >
              Learn About Our Programs
              <ExternalLink className="w-5 h-5 ml-2" />
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Alumni;
