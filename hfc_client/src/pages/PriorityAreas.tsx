import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Baby, Building2, Shield, Users, Zap, TreePine, Activity, ArrowRight, Heart } from "lucide-react";

const PriorityAreas = () => {
  const priorityAreas = [
    {
      icon: Baby,
      title: "Human Development - Child and Youth Development",
      subtitle: "Health, Education, and Nutrition",
      description: "Supporting vulnerable children and youth affected by HIV/AIDS through comprehensive care, education, and psychosocial support.",
      details: "With 25 years of experience in OVC support, we have reached over 27,000 orphaned and vulnerable children and 10,000 PLWHA through our holistic care model. Our approach includes group homes, educational sponsorship, health services, and psychosocial support to ensure children thrive despite challenging circumstances.",
      keyActivities: [
        "Group home care for 130+ children through 12 residential facilities",
        "Distance adoption and sponsorship programs",
        "Health care services and HIV/AIDS support",
        "Psychosocial support and counseling services",
        "Youth learning centers and life skills development",
        "Educational support and school feeding programs"
      ]
    },
    {
      icon: Building2,
      title: "Community Empowerment Livelihoods",
      subtitle: "Economic Empowerment",
      description: "Empowering vulnerable communities through Village Savings and Loan Associations and economic strengthening initiatives.",
      details: "We have successfully reached over 34,000 families (22,000 in Addis Ababa and 12,000 in Oromia) through our VSLA programs. Our 8-year partnership with Plan International Ethiopia and extensive experience in economic strengthening has enabled communities to build assets and achieve financial independence.",
      keyActivities: [
        "Village Savings and Loan Associations (VSLA) for 34,000+ families",
        "Vocational training and skills development centers",
        "Income generation activities and microfinance",
        "Urban Productive Safety Net programs",
        "Economic strengthening for PLWHA and vulnerable families",
        "Community-based organizations capacity building"
      ]
    },
    {
      icon: Shield,
      title: "Good Governance and Human Rights and Civic Engagement",
      subtitle: "Democratic Governance",
      description: "Strengthening democratic governance through social accountability, civic engagement, and human rights protection.",
      details: "As a lead implementing partner of the Ethiopian Social Accountability Project (World Bank), we coordinate 22 targeted woredas in eastern Ethiopia. Our work focuses on promoting transparency, accountability, and citizen participation in governance processes to ensure responsive public service delivery.",
      keyActivities: [
        "Ethiopian Social Accountability Project (ESAP2, ESAP3) coordination",
        "Ethiopian Civic Engagement (ECE) programs",
        "Civil Society Support Project (CSSP2) implementation",
        "Gender Responsive Budgeting initiatives",
        "Human rights advocacy and protection",
        "Community-driven development facilitation"
      ]
    },
    {
      icon: Users,
      title: "Social Cohesion and Community Resilience",
      subtitle: "Community Strengthening",
      description: "Building peaceful, unified communities through conflict resolution, national unity promotion, and social integration.",
      details: "Our commitment to peacebuilding and national unity is reflected in our community mobilization efforts and conflict resolution initiatives. We work to strengthen social bonds and promote peaceful coexistence among diverse community members while building resilience against social and economic shocks.",
      keyActivities: [
        "Conflict prevention and resolution programs",
        "National unity and peacebuilding initiatives",
        "Community dialogue and mediation services",
        "Social integration programs for marginalized groups",
        "Community resilience building against HIV/AIDS stigma",
        "Inter-religious and inter-ethnic harmony promotion"
      ]
    },
    {
      icon: Zap,
      title: "Humanitarian Aid and Emergency Preparedness",
      subtitle: "Crisis Response",
      description: "Providing immediate humanitarian response while building long-term resilience in vulnerable communities.",
      details: "Our humanitarian work focuses on addressing immediate needs of vulnerable populations while building sustainable systems for emergency preparedness. We provide essential support including food, shelter, healthcare, and psychosocial services during crisis situations.",
      keyActivities: [
        "Emergency relief and humanitarian assistance",
        "Home-based care for HIV/AIDS patients",
        "Hospice services for terminally ill individuals",
        "Emergency shelter and care provision",
        "Food security and nutrition programs",
        "Disaster risk reduction and preparedness training"
      ]
    },
    {
      icon: Activity,
      title: "Gender Equality and Social Inclusion (GESI)",
      subtitle: "Inclusive Development",
      description: "Empowering women and girls while ensuring inclusive participation of all community members regardless of background.",
      details: "Our GESI approach ensures that women, girls, and marginalized groups have equal access to opportunities and resources. We focus on girls' empowerment, women's economic participation, and creating inclusive environments where everyone can thrive.",
      keyActivities: [
        "Girls' empowerment and education programs",
        "Women's economic empowerment through VSLA",
        "Gender-responsive programming across all sectors",
        "Protection services for vulnerable women and girls",
        "Disability inclusion initiatives",
        "Vocational training centers for women and youth"
      ]
    },
    {
      icon: TreePine,
      title: "Environmental Sustainability and Climate Resilience",
      subtitle: "Climate Action",
      description: "Promoting environmental protection and developing green spaces while building climate resilience in communities.",
      details: "We integrate environmental sustainability into our community development work, focusing on green space development, environmental conservation, and building community resilience to climate change impacts. Our initiatives promote sustainable practices while protecting natural resources.",
      keyActivities: [
        "Green space development and environmental protection",
        "Community-based environmental conservation",
        "Climate adaptation and resilience building",
        "Sustainable agriculture and food security",
        "Environmental awareness and education programs",
        "Natural resource management initiatives"
      ]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Our Priority Areas
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto">
              Comprehensive approaches to addressing the multifaceted needs of vulnerable populations 
              through sustainable development and humanitarian intervention
            </p>
          </div>
        </section>

        {/* Thematic Areas Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {priorityAreas.map((area, index) => (
                <Card key={index} className="shadow-medium hover:shadow-strong transition-all transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fad25b' }}>
                        <area.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-foreground">{area.title}</CardTitle>
                        <p className="text-sm text-primary font-medium">{area.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-lg">{area.description}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{area.details}</p>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Activities:</h4>
                      <ul className="space-y-2">
                        {area.keyActivities.map((activity, activityIndex) => (
                          <li key={activityIndex} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Accordion Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
              Detailed Priority Areas
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {priorityAreas.map((area, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6 shadow-medium hover:shadow-strong transition-all transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center " style={{ backgroundColor: '#fad25b' }}>
                        <area.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-foreground">{area.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{area.details}</p>
                      <div>
                        <h5 className="font-medium text-foreground mb-2">Our Approach:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {area.keyActivities.map((activity, activityIndex) => (
                            <div key={activityIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              <span className="text-sm text-muted-foreground">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-primary-foreground">
              Support Our Priority Areas
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
              Your support enables us to work across all these critical areas and create comprehensive 
              impact in the communities we serve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/donate" 
                className="inline-flex items-center px-8 py-4 bg-secondary text-secondary-foreground rounded-lg shadow-medium hover:shadow-strong transform hover:-translate-y-1 transition-all"
              >
                Support Our Work
                <Heart className="w-5 h-5 ml-2" />
              </a>
              <a 
                href="/projects" 
                className="inline-flex items-center px-8 py-4 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all"
              >
                View Our Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PriorityAreas;