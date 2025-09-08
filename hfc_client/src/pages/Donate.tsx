import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Smartphone, CreditCard, DollarSign, Users, Target, CheckCircle } from "lucide-react";

const Donate = () => {
  const donationTiers = [
    {
      amount: "$25",
      title: "Supporter",
      description: "Provides school supplies for one child for a month",
      impact: "Educational materials, notebooks, pencils",
      popular: false
    },
    {
      amount: "$50",
      title: "Advocate",
      description: "Funds clean water access for one family",
      impact: "Water purification tablets, hygiene kits",
      popular: true
    },
    {
      amount: "$100",
      title: "Champion",
      description: "Sponsors healthcare for a rural community",
      impact: "Medical supplies, basic treatment for 5 people",
      popular: false
    },
    {
      amount: "$250",
      title: "Hero",
      description: "Provides emergency relief package for one family",
      impact: "Food, shelter materials, medical care",
      popular: false
    }
  ];

  const impactStats = [
    {
      icon: Users,
      number: "75,000+",
      label: "Lives Impacted",
      description: "People who have received direct assistance"
    },
    {
      icon: Target,
      number: "45",
      label: "Active Projects",
      description: "Ongoing humanitarian initiatives"
    },
    {
      icon: Heart,
      number: "15",
      label: "Countries",
      description: "Nations where we operate programs"
    },
    {
      icon: CheckCircle,
      number: "200+",
      label: "Partners",
      description: "Local organizations and stakeholders"
    }
  ];

  const whereMoneyGoes = [
    {
      percentage: "75%",
      category: "Direct Programs",
      description: "Healthcare, education, emergency relief, and development projects"
    },
    {
      percentage: "15%",
      category: "Operations",
      description: "Staff salaries, logistics, and program management"
    },
    {
      percentage: "10%",
      category: "Fundraising",
      description: "Donor outreach, communications, and development activities"
    }
  ];

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
              Make a <span style={{ color: '#fad25b' }}>Difference</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
              Your donation directly transforms lives and builds stronger communities worldwide
            </p>
            <Button variant="cta" size="lg" className="text-lg px-12 py-5 font-semibold shadow-strong hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 hover:scale-105" style={{ backgroundColor: '#fad25b', color: '#1e293b' }}>
              Donate Now
              <Heart className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                Your <span className="text-primary">Impact</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                See the real difference your donations make in communities worldwide
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
              {impactStats.map((stat, index) => (
                <div key={index} className="group text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: '#fad25b', boxShadow: '0 8px 25px rgba(250, 210, 91, 0.3)' }}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: '#fad25b' }}>
                    {stat.number}
                  </div>
                  <div className="text-lg lg:text-xl font-bold text-foreground mb-3 leading-tight">
                    {stat.label}
                  </div>
                  <div className="text-base text-muted-foreground leading-relaxed">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Tiers */}
        <section className="py-24 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                Choose Your <span className="text-primary">Impact Level</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Every contribution makes a meaningful difference in someone's life
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {donationTiers.map((tier, index) => (
                <Card key={index} className={`group shadow-strong hover:shadow-glow transition-all duration-500 transform hover:-translate-y-3 border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm ${
                  tier.popular ? 'ring-2 ring-yellow-400 shadow-glow' : ''
                }`}>
                  <CardHeader className="text-center pb-4">
                    {tier.popular && (
                      <Badge className="w-fit mx-auto mb-4 px-4 py-2 text-sm font-semibold" style={{ backgroundColor: '#fad25b', color: '#1e293b' }}>
                        Most Popular
                      </Badge>
                    )}
                    <CardTitle className="text-4xl lg:text-5xl font-bold mb-3" style={{ color: '#fad25b' }}>
                      {tier.amount}
                    </CardTitle>
                    <h3 className="text-xl lg:text-2xl font-bold text-foreground">{tier.title}</h3>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-base mb-6 leading-relaxed">{tier.description}</p>
                    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-4 rounded-xl mb-8 border border-border/30">
                      <p className="text-sm text-foreground font-bold mb-2">Impact:</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tier.impact}</p>
                    </div>
                    <Button 
                      variant={tier.popular ? "cta" : "outline"} 
                      className={`w-full text-base py-3 font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 ${
                        tier.popular 
                          ? 'shadow-strong hover:shadow-glow' 
                          : 'border-2 hover:border-yellow-400 hover:text-yellow-600'
                      }`}
                      style={tier.popular ? { backgroundColor: '#fad25b', color: '#1e293b' } : {}}
                    >
                      Donate {tier.amount}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="py-24 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                Payment <span className="text-primary">Options</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Choose your preferred method to make a secure donation
              </p>
            </div>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
              {/* Local Payment Methods */}
              <Card className="shadow-strong border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center text-2xl lg:text-3xl font-bold text-foreground">
                    <Smartphone className="w-8 h-8 mr-3" style={{ color: '#fad25b' }} />
                    Ethiopian Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-br from-white/80 to-blue-50/50 rounded-xl border border-border/30 hover:shadow-medium transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fad25b' }}>
                        <Smartphone className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground">Telebirr</h4>
                        <p className="text-muted-foreground">Mobile money transfer</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="px-6 py-2 font-semibold border-2 hover:border-yellow-400 hover:text-yellow-600 transition-all duration-300">
                      Donate
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 bg-gradient-to-br from-white/80 to-blue-50/50 rounded-xl border border-border/30 hover:shadow-medium transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#fad25b' }}>
                        <CreditCard className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground">CBE Birr</h4>
                        <p className="text-muted-foreground">Bank transfer</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="px-6 py-2 font-semibold border-2 hover:border-yellow-400 hover:text-yellow-600 transition-all duration-300">
                      Donate
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* International Payment Methods */}
              <Card className="shadow-strong border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center text-2xl lg:text-3xl font-bold text-foreground">
                    <CreditCard className="w-8 h-8 mr-3" style={{ color: '#fad25b' }} />
                    International Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-slate-50/80 to-blue-50/50 rounded-xl text-center border border-border/30">
                    <h4 className="font-bold text-lg text-foreground mb-3">Coming Soon</h4>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      International payment options including credit cards, PayPal, and wire transfers will be available soon.
                    </p>
                    <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold" style={{ backgroundColor: '#fad25b', color: '#1e293b' }}>
                      In Development
                    </Badge>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl border border-border/30">
                    <h4 className="font-bold text-lg text-foreground mb-3">Contact Us</h4>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      For international donations, please contact us directly:
                    </p>
                    <a 
                      href="mailto:donations@hfc.org" 
                      className="inline-flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105" style={{ backgroundColor: '#fad25b', color: '#1e293b' }}
                    >
                      donations@hfc.org
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Where Money Goes */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">How We Use Your Donation</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {whereMoneyGoes.map((item, index) => (
                  <Card key={index} className="shadow-medium text-center">
                    <CardContent className="p-8">
                      <div className="text-4xl font-bold text-primary mb-4">
                        {item.percentage}
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-foreground">
                        {item.category}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="shadow-medium">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Financial Transparency</h3>
                  <p className="text-muted-foreground mb-6">
                    We believe in complete transparency. Our annual financial reports and audited 
                    statements are available for review, ensuring your donations are used effectively 
                    and efficiently to create maximum impact.
                  </p>
                  <Button variant="outline">
                    View Financial Reports
                    <DollarSign className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Donation Form Preview */}
        <section className="py-20 bg-gradient-primary">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8 text-primary-foreground">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-center mb-12 text-primary-foreground/90 max-w-3xl mx-auto">
              Every donation, no matter the size, creates ripple effects of positive change 
              that transform lives and strengthen communities.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-strong">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
                    Thank You Message Preview
                  </h3>
                  <div className="bg-accent/10 p-6 rounded-lg text-center">
                    <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h4 className="text-xl font-semibold mb-2 text-foreground">
                      Thank You for Your Generosity!
                    </h4>
                    <p className="text-muted-foreground">
                      Your donation has been received and will make a direct impact on the lives 
                      of those we serve. You will receive a confirmation email with details about 
                      how your contribution is being used.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Donate;