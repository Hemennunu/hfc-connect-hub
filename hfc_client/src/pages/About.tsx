import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReadMore from "@/components/ReadMore";
import {
  Mail,
  Linkedin,
  Twitter,
  ChevronDown,
  ChevronUp,
  Globe,
  Users,
  Shield,
  Handshake,
  Lightbulb,
  Award,
} from "lucide-react";
import founderImage from "@/assets/foundeerpic.jpg";
import founderImage1 from "@/assets/RahelBirhanu.jpg";
import founderImage2 from "@/assets/AberaWondemu.png";
import founderImage3 from "@/assets/Sisay sfay.png";
import founderImage4 from "@/assets/Zelalem .jpg";
import founderImage5 from "@/assets/TsedalEndrias.jpg";
import founderImage6 from "@/assets/TsionBerga.jpg";
import founderImage7 from "@/assets/emaos.jpg";
import founderImage8 from "@/assets/wub.jpg";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io('http://127.0.0.1:5000');
 // adjust backend URL if needed

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

const About = () => {
  const [staff, setStaff] = useState([]);
  const [boardDirectors, setBoardDirectors] = useState([]);
  const [managementTeam, setManagementTeam] = useState([]);

  // Rest of your unchanged data like values, founder, boardMembers remain the same
  const values = [
    {
      icon: Globe,
      title: "Wholeness",
      description:
        "In working with children, every aspect of their growth & development must be addressed, including their physical and psychological wellbeing.",
    },
    {
      icon: Handshake,
      title: "Inclusion and Equity",
      description:
        "Ensuring that every individual regardless of gender, age, disability, ethnicity, social status, or background has fair access to resources and opportunities.",
    },
    {
      icon: Shield,
      title: "Integrity and Accountability",
      description:
        "Acting with honesty, ethics, and transparency in all activities and decisions while being responsible for our actions and using resources appropriately.",
    },
    {
      icon: Users,
      title: "Participation",
      description:
        "Actively involving community members, especially beneficiaries, in planning, decision-making, and implementation of development initiatives.",
    },
    {
      icon: Award,
      title: "Respect and Dignity",
      description:
        "Treating all people with fairness, empathy, and appreciation for their humanity while recognizing and honouring cultural diversity.",
    },
    {
      icon: Lightbulb,
      title: "Resilience and Empowerment",
      description:
        "Building people's capacity to overcome challenges and lead independent, fulfilling lives through knowledge, skills, and confidence building.",
    },
  ];

  const founder = {
    name: "Yewoinshet Masresha",
    role: "Founder & Honorable President",
    bio: `Yewoinshet Masresha, the visionary founder of Hope for Children Organization (HFCO), is a woman whose life has been shaped by compassion, courage, and a deep love for humanity. Born in Babile, a town nestled between Jigjiga and Harar in Ethiopia's Harari region, Yewoinshet grew up with a natural sense of empathy and a passion for helping those in need. From a young age, she demonstrated critical thinking, an unwavering sense of justice, and an unshakable commitment to the well-being of others.

She pursued her undergraduate studies in Literature at Addis Ababa University, and later earned a Master's degree in Social Psychology. Her academic journey strengthened her understanding of human behavior and deepened her resolve to serve the most vulnerable members of society. Before founding HFCO, Yewoinshet worked with a Catholic missionary charity as a social worker, where she provided care and support to disadvantaged individuals and families.

In the early 2000s, Ethiopia was among the countries hardest hit by the HIV/AIDS epidemic, a crisis that not only caused widespread loss of life but also left thousands of children orphaned and stigmatized. Witnessing the despair faced by affected families, Yewoinshet was moved to act. With grace, courage, and determination, she began offering home-based care services to bedridden HIV/AIDS patients bringing comfort, dignity, and hope into their lives.

Starting with just one group home sheltering eight children, she envisioned a new kind of family one built not by blood, but by love, commitment, and care. Each group home was led by a dedicated mother caring for 8–10 children as her own. Over time, this heartfelt initiative grew to 12 group homes, nurturing 130 children in a safe and loving environment. Through HFCO, Yewoinshet created not just shelters, but homes filled with hope and healing.

For more than 18 years, she served HFCO in multiple roles volunteer, psychologist, project manager, and executive director often sacrificing her personal interests and comfort to ensure the organization's success. Though she now resides in Australia for retirement due to her service for long years, Yewoinshet continues to guide HFCO's strategic direction and supports the organization through personal donations and mentorship.

To this day, the lives of over 130 children she raised through HFCO stand as a living testament to her compassion. Many have grown into independent, accomplished individuals holding key positions in society. Her legacy lives on through the hearts she's touched, the lives she's transformed, and the enduring family she built through love.`,
    image: founderImage,
    email: "founder@hfc.org",
    linkedin: "#",
    twitter: "#",
  };

  const boardMembers = [
    {
      name: "Rahel Berhanu Tesfa",
      role: "HFC Board of Director Chairperson ",
      expertise: "Multidisciplinary Human Rights Leader",
      image: founderImage1,
    },
    {
      name: "Aberra Wondimu",
      role: "Vice Chairperson Board of Directors",
      expertise: "Humanitarian Development Leader",
      image: founderImage2,
    },
    
    {
      name: "Sisay Tesfaye",
      role: "Board Member ",
      expertise: "Psychosocial Support & Educational Leadership Expert",
      image: founderImage3,
    },
    {
      name: "Meron Wonde",
      role: "Board Member ",
      expertise: "Psychosocial Support & Educational Leadership Expert",
      image: founderImage3,
    },
    {
      name: "Zelalem Mamuye ",
      role: " Executive Director on Management Team",
      expertise: "Executive Director & Development Management Specialist",
      image: founderImage4,
    },
    {
      name: "Tsedale Endrias",
      role: "Vice Manager    & Sponsorship and Group Home Project oordinator    ",
      expertise: "Community Health and Social Work Leader",
      image: founderImage5,
    },
    {
      name: "Tsion Berga",
      role: "Finance Manage",
      expertise: "Finance Manager & Accounting Expert",
      image: founderImage6,
    },
    
    
    {
      name: "Emaos Linigerh ",
      role: "Project Coordinator & Communication Advisor",
      expertise: "Development Communication Specialist",
      image: founderImage7,
    },
    {
      name: "Wubtaye Getachew    ",
      role: "Harar Branch Office Coordinator & Management Team Member",
      expertise: "Social Accountability and Leadership Specialist",
      image: founderImage8,
    },
  ];

  // Fetch data from backend
  const fetchStaff = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/staff");
      setStaff(response.data);
    } catch (err) {
      console.error("Failed to fetch staff", err);
    }
  };

  const fetchBoardDirectors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/board-directors");
      setBoardDirectors(response.data.filter(director => director.isActive));
    } catch (err) {
      console.error("Failed to fetch board directors", err);
    }
  };

  const fetchManagementTeam = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/management-team");
      setManagementTeam(response.data.filter(member => member.isActive));
    } catch (err) {
      console.error("Failed to fetch management team", err);
    }
  };

  React.useEffect(() => {
    fetchStaff();
    fetchBoardDirectors();
    fetchManagementTeam();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    

    socket.on("staffUpdated", () => {
      console.log("staffUpdated event received, fetching staff...");
      fetchStaff();
    });

    socket.on("boardDirectorsUpdated", () => {
      console.log("boardDirectorsUpdated event received, fetching board directors...");
      fetchBoardDirectors();
    });

    socket.on("managementTeamUpdated", () => {
      console.log("managementTeamUpdated event received, fetching management team...");
      fetchManagementTeam();
    });

    return () => {
      socket.off("staffUpdated");
      socket.off("boardDirectorsUpdated");
      socket.off("managementTeamUpdated");
    };
  }, []);

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
              About <span style={{ color: '#fad25b' }}>Hope for Children</span> Organization
            </h1>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 bg-gradient-to-br from-slate-50/80 via-blue-50/60 to-indigo-50/80">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
                  Our <span className="text-primary">Story</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Over two decades of transforming lives and building hope
                </p>
              </div>
              <div className="prose prose-xl mx-auto text-muted-foreground max-w-none">
                <Card className="shadow-medium border-0 bg-white/90 backdrop-blur-sm mb-8">
                  <CardContent className="p-10">
                    <p className="text-xl leading-relaxed mb-8 text-foreground font-light">
                      Hope for Children Organization (HFC) is an indigenous,
                      non-political, non-faith-based local NGO, established in
                      November 2000 in Ethiopia with the key objectives of
                      sustainable and comprehensive community based care and
                      support for children and families affected by HIV/AIDS.
                    </p>
                    <p className="text-xl leading-relaxed mb-8 text-foreground font-light">
                      The organization has 25 years' experience on OVC addressing
                      their education, health and care and support aspects. In
                      relation to this, HFC has managed to reach about 27,000 OVC
                      and more than 10,000 PLWHA through mobilizing 450 volunteer
                      service providers.
                    </p>
                    <p className="text-xl leading-relaxed text-foreground font-light">
                      Currently, HFC provides holistic support to HIV-AIDS infected
                      and affected children including residential care,
                      psychosocial services, educational support, and community
                      mobilization. We have active projects in Addis Ababa City
                      Administration, Oromia and Harari regional states.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-strong border-0 bg-gradient-to-br from-white/95 via-blue-50/80 to-indigo-50/90 backdrop-blur-sm">
                  <CardContent className="p-10">
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center text-foreground">
                      <span className="text-primary">Organizational</span> Profile
                    </h3>
                    <div className="prose prose-lg max-w-none text-foreground">
                      <p className="text-xl leading-relaxed mb-6">
                        Hope for Children Organization (HFC) is an indigenous, non-political, non-faith-based local NGO, established in November 2000 G.C with the key objectives of sustainable and comprehensive community based care and support for children and families affected by HIV/AIDS. HFC is registered as an Ethiopian resident charity with registration No. 0016.
                      </p>
                      <ReadMore 
                        text="The organization has been successfully undertaking HIV/AIDS prevention and control programs since establishment through raising funds from multiple sources: international and local as well. The organization has 25 years' experience on OVC addressing their education, health and care and support aspects. In relation to this, HFC has managed to reach about 27,000 OVC and more than 10,000 PLWHA through mobilizing 450 volunteer service providers. The major service includes provision of shelter and care through group homes, health care, psychosocial and educational support, provision of food and nutrition. Hope for Children Organization has presence at Addis Ababa city administration since establishment. And, the organization has experience almost throughout the country's regional states. The head office is located around Menen area with its own office. Currently we have active projects in Addis Ababa City Administration, Oromia and Harari regional states. HFC implemented Integrated Community Based HIV/AIDS Preventive, Care and Support Project cooperating with USAID/Ethiopia in 9 towns from October 2013- September 2016. During the project period 9,000 people got different care and support benefits also 9,000 people were addressed by economic strengthening support with VSLA trainings and follow up. The other area of HFC's engagement focuses on the promotion of village saving and Loan (VSLA) as asset building potential for poor households in the target areas. The effort has enabled to reach about 22,000 and 12,000 poor families in Addis Ababa and Oromia through VSLA project respectively. We are in an extensive period of partnership with Plan International Ethiopia implementing VSLA project in successful manner for 8 years since November 2007 GC – June 2015 GC. As one of the national implementing partners, HFC has implemented the SCRHA/PATH project which is Strengthening Communities Response to HIV/AIDS through promoting the major activities of the project that include community and home based palliative care, economic strengthening and CSO capacity building. Such effort has enabled HFC to reach capacity improvement needs of 34 CSOs in 47 towns of Oromia and Amhara regions through mobilizing and participating community based volunteers and 39 generalists while addressing 86,871 PLHIV affected and infected individuals. The provision of technical and supervisory support has been undertaken through involving project advisory committee, town health office, HAPCO, women and children affairs offices in project areas. HFC is working on Ethiopian Social Accountability Project (World Bank Project) since 2013 till now coordinating different implementing partners. As a lead organization we have been facilitating some western and southern part of the country as well as since 2016 we are working by facilitating the Eastern part of 22 targeted woredas. Hope for Children have an experience working with International as well as Local partners, some of them are: UNICEF, USAID, Plan International, US Embassy, Irish Embassy, Norway, Embassy, Sweden Embassy, Good Will Community Foundation, Global Fund for Children, Partner in the Horn of Africa (PIHA), Ananda Foundation, Botanga Foundation, Hope for Children USA, World Bank through Management Agency, Direct Reach Ethiopia (DRE). Currently, HFC provides holistic support to HIV-AIDS infected and affected children. The support includes addressing basic needs of the children, and adults' provision of psychosocial service to OVCs and their families as needed. Besides this, HFC runs a number of preventive interventions that aims to mitigate the impact of HIV/AIDS in the community through strengthened educational support. These are through residential care of terminal HIV-AIDS clients, youth enrichment services; community mobilization and facilitation, strengthening community Responses to HIV/AIDS, sponsorship through distance adoption, girls' empowerment and social accountability."
                        maxLength={500}
                        className="text-xl leading-relaxed text-foreground"
                        buttonClassName="text-primary hover:text-primary-dark font-medium text-lg mt-4 inline-flex items-center"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <Card className="shadow-medium">
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold mb-6 text-primary">
                    Our Mission
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    HFCO has a mission, dedicated to fostering the development of
                    highly vulnerable Community members, children, women, youth,
                    and their caregivers, empowering them to become empowered,
                    self-sufficient and responsible members of their communities
                    through a participatory and holistic approach.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold mb-6 text-accent">
                    Our Vision
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    "A country where every individual lives in a joyful and
                    healthy environment within a transparent and just society"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="shadow-medium hover:shadow-strong transition-all transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200"
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#fad25b' }}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-20 bg-gradient-card">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
              Our Founder
            </h2>
            <div className="max-w-6xl mx-auto">
              <Card className="shadow-strong bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200">
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
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(founder.email)}&su=${encodeURIComponent(`Contact ${founder.name} - ${founder.role}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-light"
                          title={`Send email to ${founder.email}`}
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                        <a
                          href={founder.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-light"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                          href={founder.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-light"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-3xl font-bold mb-2 text-foreground">
                          {founder.name}
                        </h3>
                        <Badge variant="secondary" className="mb-4">
                          {founder.role}
                        </Badge>
                      </div>
                      <FounderBio bio={founder.bio} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Board of Directors */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
              Board of Directors
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {boardDirectors.map((director, index) => (
                <Card
                  key={director._id || index}
                  className="shadow-medium hover:shadow-strong transition-all transform hover:-translate-y-2"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4">
                      {director.profileImage ? (
                        <img
                          src={director.profileImage.startsWith('http') ? director.profileImage : `http://localhost:5000/uploads/boardDirectors/${director.profileImage}`}
                          alt={director.name}
                          className="w-full h-full object-cover rounded-full shadow-soft"
                          onError={(e) => {
                            console.error('Error loading board director image:', e.currentTarget.src);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-soft">
                          {director.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {director.name}
                    </h3>
                    <Badge variant="outline" className="mb-2">
                      {director.position}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{director.expertise}</p>
                    {director.bio && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{director.bio}</p>
                    )}
                    <div className="flex justify-center space-x-3 mt-4">
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(director.email || 'hopeforchildrenethiopia2001@gmail.com')}&su=${encodeURIComponent(`Contact ${director.name} - ${director.position}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-light transition-colors"
                        title={`Send email to ${director.name}`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      {director.linkedin && (
                        <a
                          href={director.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-light transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Management Team */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
              Management Team
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {managementTeam.map((member, index) => (
                <Card
                  key={member._id || index}
                  className="shadow-medium hover:shadow-strong transition-all transform hover:-translate-y-2"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4">
                      {member.image ? (
                        <img
                          src={member.image.startsWith('http') ? member.image : `http://localhost:5000/uploads/managementTeam/${member.image}`}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-full shadow-soft"
                          onError={(e) => {
                            console.error('Error loading management team image:', e.currentTarget.src);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-soft">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {member.name}
                    </h3>
                    <Badge variant="outline" className="mb-2">
                      {member.position}
                    </Badge>
                    {member.department && (
                      <Badge variant="secondary" className="mb-2 ml-2">
                        {member.department}
                      </Badge>
                    )}
                    <p className="text-sm text-muted-foreground">{member.expertise}</p>
                    {member.bio && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>
                    )}
                    <div className="flex justify-center space-x-3 mt-4">
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(member.email || 'hopeforchildrenethiopia2001@gmail.com')}&su=${encodeURIComponent(`Contact ${member.name} - ${member.position}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-light transition-colors"
                        title={`Send email to ${member.name}`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-light transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Staff Directory */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
              Our Staff
            </h2>
            <div className="max-w-6xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-lg shadow-medium">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Department
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Contact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((member, index) => (
                      <tr
                        key={index}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-foreground font-medium">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {member.role}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{member.department}</Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {member.location}
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(member.email || 'hopeforchildrenethiopia2001@gmail.com')}&su=${encodeURIComponent(`Contact ${member.name} - ${member.role || 'Staff Member'}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-light transition-colors"
                            title={`Send email to ${member.name}`}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Team CTA */}
        <section className="py-20 bg-gradient-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-primary-foreground">
              Join Our Team
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
              Are you passionate about humanitarian work and creating positive
              change? We're always looking for dedicated individuals to join our
              mission.
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

export default About;
