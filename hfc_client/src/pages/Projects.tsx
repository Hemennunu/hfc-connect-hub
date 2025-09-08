import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Target } from "lucide-react";
import axios from "axios";

interface Project {
  _id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  completedDate?: string;
  beneficiaries: string;
  budget: string;
  impact?: string;
  status: 'ongoing' | 'completed';
  category: string;
  createdAt: string;
  updatedAt: string;
}

const Projects = () => {
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects");
      const projects = response.data;
      
      setOngoingProjects(projects.filter((project: Project) => project.status === 'ongoing'));
      setCompletedProjects(projects.filter((project: Project) => project.status === 'completed'));
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDescription = (projectId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Healthcare: "bg-red-100 text-red-800",
      Education: "bg-blue-100 text-blue-800",
      "Child Development": "bg-purple-100 text-purple-800",
      Governance: "bg-indigo-100 text-indigo-800",
      "Economic Development": "bg-green-100 text-green-800",
      "Community Development": "bg-orange-100 text-orange-800",
      "Community Empowerment": "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl text-muted-foreground">Loading projects...</p>
          </div>
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
              Our <span style={{ color: '#fad25b' }}>Projects</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
              Creating lasting change through carefully planned and executed
              humanitarian initiatives
            </p>
          </div>
        </section>

        {/* Ongoing Projects */}
        <section className="py-24 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                Ongoing <span className="text-primary">Projects</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Current initiatives making a difference in communities worldwide
              </p>
            </div>
            {ongoingProjects.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-xl">No ongoing projects found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-10">
                {ongoingProjects.map((project) => (
                  <Card
                    key={project._id}
                    className="group shadow-strong hover:shadow-glow transition-all duration-500 transform hover:-translate-y-3 border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <CardTitle className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {project.title}
                        </CardTitle>
                        <Badge className="px-3 py-1 text-sm font-semibold" style={{ backgroundColor: '#fad25b', color: '#1e293b' }}>
                          {project.category}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground">
                        {expandedDescriptions[project._id] ? (
                          <>
                            {project.description}
                            <button
                              onClick={() => toggleDescription(project._id)}
                              className="ml-2 text-primary hover:text-primary/80 font-medium"
                            >
                              Read Less
                            </button>
                          </>
                        ) : (
                          <>
                            {truncateText(project.description)}
                            {project.description.length > 150 && (
                              <button
                                onClick={() => toggleDescription(project._id)}
                                className="ml-2 text-primary hover:text-primary/80 font-medium"
                              >
                                Read More
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">
                              {project.location}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">
                              {project.beneficiaries}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">
                              {project.startDate} - {project.endDate || "Ongoing"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">
                              {project.budget}
                            </span>
                          </div>
                        </div>

                        <Badge variant="outline" className="w-fit">
                          In Progress
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Completed Projects */}
        <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                Completed <span className="text-primary">Projects</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Successfully delivered initiatives with measurable impact
              </p>
            </div>
            {completedProjects.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-xl">No completed projects found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-10">
                {completedProjects.map((project) => (
                  <Card
                    key={project._id}
                    className="group shadow-strong hover:shadow-glow transition-all duration-500 transform hover:-translate-y-3 border-0 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 backdrop-blur-sm"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl text-foreground">
                          {project.title}
                        </CardTitle>
                        <Badge className={getCategoryColor(project.category)}>
                          {project.category}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground">
                        {expandedDescriptions[project._id] ? (
                          <>
                            {project.description}
                            <button
                              onClick={() => toggleDescription(project._id)}
                              className="ml-2 text-primary hover:text-primary/80 font-medium"
                            >
                              Read Less
                            </button>
                          </>
                        ) : (
                          <>
                            {truncateText(project.description)}
                            {project.description.length > 150 && (
                              <button
                                onClick={() => toggleDescription(project._id)}
                                className="ml-2 text-primary hover:text-primary/80 font-medium"
                              >
                                Read More
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">
                              {project.location}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">
                              Completed: {project.completedDate}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">
                              {project.beneficiaries} beneficiaries
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">
                              Budget: {project.budget}
                            </span>
                          </div>
                        </div>

                        {project.impact && (
                          <div className="bg-accent/10 p-3 rounded-lg">
                            <h4 className="font-medium text-foreground mb-1">
                              Impact Achieved:
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {project.impact}
                            </p>
                          </div>
                        )}

                        <Badge variant="secondary" className="w-fit">
                          Completed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Support Our Projects CTA */}
        <section className="py-24 bg-gradient-to-br from-primary via-accent to-primary-glow relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-3"></div>
          </div>
          <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
              Support Our <span style={{ color: '#fad25b' }}>Projects</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
              Your contribution helps us implement more projects and reach more
              communities in need. Every donation makes a direct impact on
              people's lives.
            </p>
            <a
              href="/donate"
              className="inline-flex items-center px-12 py-5 rounded-xl shadow-strong hover:shadow-glow transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 text-lg font-semibold"
              style={{ backgroundColor: '#fad25b', color: '#1e293b' }}
            >
              Donate to Our Projects
              <Target className="w-5 h-5 ml-2" />
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Projects;