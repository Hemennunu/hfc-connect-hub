import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Twitter, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import founderImage from "@/assets/foundeerpic.jpg";

interface BoardDirector {
  id: number;
  name: string;
  position: string;
  role?: string;
  bio?: string;
  expertise?: string;
  profileImage?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  isActive: boolean;
  order: number;
}

interface ManagementTeamMember {
  id: number;
  name: string;
  position: string;
  bio?: string;
  expertise?: string;
  image?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  isActive: boolean;
  order: number;
}

const FounderBio = ({ bio }: { bio: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const truncatedBio = bio.slice(0, 400) + "...";
  
  return (
    <div className="space-y-4">
      <p className="text-lg text-muted-foreground leading-relaxed">
        {isExpanded ? bio : truncatedBio}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center text-primary hover:text-primary-light transition-colors font-medium"
      >
        {isExpanded ? (
          <>
            Read Less
            <ChevronUp className="w-4 h-4 ml-1" />
          </>
        ) : (
          <>
            Read More
            <ChevronDown className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
    </div>
  );
};

const Team = () => {
  const [boardDirectors, setBoardDirectors] = useState<BoardDirector[]>([]);
  const [managementTeam, setManagementTeam] = useState<ManagementTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Client: Starting to fetch team data...');
        
        // Fetch board directors
        console.log('🔄 Client: Fetching board directors...');
        const boardResponse = await axios.get('http://localhost:5000/api/board-directors');
        console.log('📊 Client: Board directors response:', boardResponse.data);
        const activeBoardDirectors = boardResponse.data.filter((director: BoardDirector) => director.isActive);
        console.log('✅ Client: Active board directors:', activeBoardDirectors);
        setBoardDirectors(activeBoardDirectors.sort((a: BoardDirector, b: BoardDirector) => a.order - b.order));
        
        // Fetch management team
        console.log('🔄 Client: Fetching management team...');
        const managementResponse = await axios.get('http://localhost:5000/api/management-team');
        console.log('📊 Client: Management team response:', managementResponse.data);
        const activeManagementTeam = managementResponse.data.filter((member: ManagementTeamMember) => member.isActive);
        console.log('✅ Client: Active management team:', activeManagementTeam);
        setManagementTeam(activeManagementTeam.sort((a: ManagementTeamMember, b: ManagementTeamMember) => a.order - b.order));
        
        console.log('🎉 Client: Team data fetch completed successfully!');
        
      } catch (error) {
        console.error('❌ Client: Error fetching team data:', error);
        // Fallback to empty arrays if API fails
        setBoardDirectors([]);
        setManagementTeam([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const founder = {
    name: "Yewoinshet Masresha",
    role: "Founder & Visionary Leader",
    bio: "Yewoinshet Masresha, the visionary founder of Hope for Children Organization (HFCO), is a woman whose life has been shaped by compassion, courage, and a deep love for humanity. Born in Babile, a town nestled between Jigjiga and Harar in Ethiopia's Harari region, Yewoinshet grew up with a natural sense of empathy and a passion for helping those in need. From a young age, she demonstrated critical thinking, an unwavering sense of justice, and an unshakable commitment to the well-being of others.\n\nShe pursued her undergraduate studies in Literature at Addis Ababa University, and later earned a Master's degree in Social Psychology. Her academic journey strengthened her understanding of human behavior and deepened her resolve to serve the most vulnerable members of society. Before founding HFCO, Yewoinshet worked with a Catholic missionary charity as a social worker, where she provided care and support to disadvantaged individuals and families.\n\nIn the early 2000s, Ethiopia was among the countries hardest hit by the HIV/AIDS epidemic, a crisis that not only caused widespread loss of life but also left thousands of children orphaned and stigmatized. Witnessing the despair faced by affected families, Yewoinshet was moved to act. With grace, courage, and determination, she began offering home-based care services to bedridden HIV/AIDS patients bringing comfort, dignity, and hope into their lives.\n\nStarting with just one group home sheltering eight children, she envisioned a new kind of family one built not by blood, but by love, commitment, and care. Each group home was led by a dedicated mother caring for 8–10 children as her own. Over time, this heartfelt initiative grew to 12 group homes, nurturing 130 children in a safe and loving environment. Through HFCO, Yewoinshet created not just shelters, but homes filled with hope and healing.\n\nFor more than 18 years, she served HFCO in multiple roles volunteer, psychologist, project manager, and executive director often sacrificing her personal interests and comfort to ensure the organization's success. Though she now resides in Australia for retirement due to her service for long years, Yewoinshet continues to guide HFCO's strategic direction and supports the organization through personal donations and mentorship.\n\nTo this day, the lives of over 130 children she raised through HFCO stand as a living testament to her compassion. Many have grown into independent, accomplished individuals holding key positions in society. Her legacy lives on through the hearts she's touched, the lives she's transformed, and the enduring family she built through love.",
    image: founderImage,
    email: "founder@hfc.org",
    linkedin: "#",
    twitter: "#"
  };


  
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Our Team
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Meet the dedicated individuals who drive our mission forward every day
            </p>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Our Founder</h2>
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-strong">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  <div className="space-y-6">
                    <div className="aspect-square w-full max-w-md mx-auto">
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-full h-full object-cover rounded-lg shadow-medium"
                      />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <a href={`mailto:${founder.email}`} className="text-primary hover:text-primary-light">
                        <Mail className="w-5 h-5" />
                      </a>
                      <a href={founder.linkedin} className="text-primary hover:text-primary-light">
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a href={founder.twitter} className="text-primary hover:text-primary-light">
                        <Twitter className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold mb-2 text-foreground">{founder.name}</h3>
                      <Badge variant="secondary" className="mb-4">{founder.role}</Badge>
                    </div>
                    <FounderBio bio={founder.bio} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </section>

        {/* Board Members */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Board of Directors</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading board members...</p>
              </div>
            ) : boardDirectors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No board members available at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {boardDirectors.map((member) => (
                  <Card key={member.id} className="shadow-medium hover:shadow-strong transition-all transform hover:-translate-y-2">
                    <CardContent className="p-6 text-center">
                      {member.profileImage ? (
                        <img
                          src={member.profileImage.startsWith('http') ? member.profileImage : `http://localhost:5000/uploads/boardDirectors/${member.profileImage}`}
                          alt={member.name}
                          className="w-24 h-24 object-cover rounded-full mx-auto mb-4 shadow-soft"
                          onLoad={() => console.log('✅ Client: Board director image loaded:', member.name, member.profileImage.startsWith('http') ? member.profileImage : `http://localhost:5000/uploads/boardDirectors/${member.profileImage}`)}
                          onError={(e) => {
                            console.error('❌ Client: Board director image failed:', member.name, e.currentTarget.src);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`${member.profileImage ? 'hidden' : ''} w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-soft`}>
                        <span className="text-white text-2xl font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">{member.name}</h3>
                      <Badge variant="outline" className="mb-2">{member.position}</Badge>
                      {member.expertise && (
                        <p className="text-sm text-muted-foreground">{member.expertise}</p>
                      )}
                      {member.email && (
                        <div className="mt-3">
                          <a
                            href={`mailto:${member.email}`}
                            className="text-primary hover:text-primary-light transition-colors"
                          >
                            <Mail className="w-4 h-4 mx-auto" />
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Management Team */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Management Team</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading management team...</p>
              </div>
            ) : managementTeam.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No management team members available at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {managementTeam.map((member) => (
                  <Card key={member.id} className="shadow-medium hover:shadow-strong transition-all transform hover:-translate-y-2">
                    <CardContent className="p-6 text-center">
                      {member.image ? (
                        <img
                          src={member.image.startsWith('http') ? member.image : `http://localhost:5000/uploads/managementTeam/${member.image}`}
                          alt={member.name}
                          className="w-24 h-24 object-cover rounded-full mx-auto mb-4 shadow-soft"
                          onLoad={() => console.log('✅ Client: Management team image loaded:', member.name, member.image.startsWith('http') ? member.image : `http://localhost:5000/uploads/managementTeam/${member.image}`)}
                          onError={(e) => {
                            console.error('❌ Client: Management team image failed:', member.name, e.currentTarget.src);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`${member.image ? 'hidden' : ''} w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-soft`}>
                        <span className="text-white text-2xl font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">{member.name}</h3>
                      <Badge variant="outline" className="mb-2">{member.position}</Badge>
                      {member.expertise && (
                        <p className="text-sm text-muted-foreground">{member.expertise}</p>
                      )}
                      {member.email && (
                        <div className="mt-3 flex justify-center space-x-3">
                          <a
                            href={`mailto:${member.email}`}
                            className="text-primary hover:text-primary-light transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          {member.linkedinUrl && (
                            <a
                              href={member.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary-light transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Join Our Team CTA */}
        <section className="py-20 bg-gradient-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-primary-foreground">Join Our Team</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
              Are you passionate about humanitarian work and creating positive change? 
              We're always looking for dedicated individuals to join our mission.
            </p>
            <a 
              href="mailto:careers@hfc.org" 
              className="inline-flex items-center px-8 py-4 bg-secondary text-secondary-foreground rounded-lg shadow-medium hover:shadow-strong transform hover:-translate-y-1 transition-all"
            >
              View Open Positions
              <Mail className="w-5 h-5 ml-2" />
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Team;