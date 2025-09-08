import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Send,
  Globe,
} from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Headquarters",
      details: [
        "Addis Ababa Gulelle Sub City, Woreda 03",
        "Menen o8 H.No 162",
        "Post Box 24550, Code 1000, Addis Ababa, Ethiopia",
      ],
    },
    {
      icon: Phone,
      title: "Phone",
      details: [
        "Office: 011 122 26 21",
        "Executive Director: 0911 56 30 74",
        "Harare Branch: +251 91 689 1300",
      ],
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "hopeforchildrenethiopia2001@gmail.com",
        "zelalemhope@gmail.com",
        "wubtayegetachew1@gmail.com (Harare Branch)",
      ],
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: [
        "Office Hours: Monday - Friday: 2:30 AM - 5:30 PM",
        "Center and Shelter Services:",
        "Monday - Sunday: 8:00 AM - 6:00 PM",
      ],
    },
  ];

  const socialMedia = [
    {
      icon: Facebook,
      name: "Facebook",
      url: "https://www.facebook.com/HFCEthiopia",
      handle: "HFC Ethiopia",
    },
    {
      icon: Facebook,
      name: "Alumni Facebook",
      url: "#",
      handle: "HFC Connect",
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: "https://www.instagram.com/p/CZbIV1FtEOO/?utm_medium=copy_link",
      handle: "@hfcethiopia",
    },
    {
      icon: Send,
      name: "Telegram",
      url: "https://t.me/hfc_ethio",
      handle: "HFC-ETHIOPIA (ተሰፋ ለሕፃናት ድርጅት)",
    },
    {
      icon: Twitter,
      name: "TikTok",
      url: "https://vm.tiktok.com/ZMLYQRnDy/",
      handle: "@hfcethiopia123",
    },
  ];

  const departments = [
    {
      name: "General Inquiries",
      email: "info@hfc.org",
      description: "Questions about our organization and programs",
    },
    {
      name: "Partnership & Collaboration",
      email: "partnerships@hfc.org",
      description: "Working together on humanitarian initiatives",
    },
    {
      name: "Media & Press",
      email: "media@hfc.org",
      description: "Interview requests and press inquiries",
    },
    {
      name: "Career Opportunities",
      email: "careers@hfc.org",
      description: "Job applications and volunteer positions",
    },
    {
      name: "Donations & Support",
      email: "donations@hfc.org",
      description: "Financial contributions and fundraising",
    },
    {
      name: "Emergency Response",
      email: "emergency@hfc.org",
      description: "Urgent humanitarian assistance requests",
    },
  ];

  const partners = [
    { name: "DRE Australia", url: "https://www.dre.org.au/" },
    { name: "Benevity", url: "https://benevity.com/" },
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
              <span style={{ color: '#fad25b' }}>Contact</span> Us
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-4xl mx-auto leading-relaxed font-light">
              Get in touch with our team to learn more about our work or explore
              collaboration opportunities
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-24 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
                Get In <span className="text-primary">Touch</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We're here to help and answer any questions you might have
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-16">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="group shadow-medium hover:shadow-strong transition-all duration-500 transform hover:-translate-y-3 text-center border-0 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50 hover:from-blue-50 hover:via-indigo-50 hover:to-blue-100 backdrop-blur-sm"
                >
                  <CardContent className="p-8 lg:p-10">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: '#fad25b', boxShadow: '0 8px 25px rgba(250, 210, 91, 0.3)' }}>
                      <info.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold mb-6 text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                      {info.title}
                    </h3>
                    <div className="space-y-3">
                      {info.details.map((detail, detailIndex) => (
                        <p
                          key={detailIndex}
                          className="text-muted-foreground text-base leading-relaxed"
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form and Map */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">
                    Send Us a Message
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+251 91 234 5678"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                    />
                  </div>
                  <Button asChild variant="cta" className="w-full">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=hopeforchildrenethiopia2001@gmail.com&su=Contact%20Inquiry"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">
                    Find Us
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Visit our headquarters in Addis Ababa, Ethiopia.
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Embedded Google Map */}
                  <div className="relative h-80 bg-muted rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31520.71361242331!2d38.758459!3d9.055628!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8f3664c67471%3A0x57d3ac75a5df4f38!2zSG9wZSBGb3IgQ2hpbGRyZW4gT3JnYW5pemF0aW9uIC_hibDhiLXhjYsg4YiI4YiV4Y2D4YqT4Ym1IOGLteGIreGMheGJtQ!5e0!3m2!1sen!2set!4v1756495364377!5m2!1sen!2set"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">
                      Office Location
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our headquarters is located in the heart of Addis Ababa,
                      easily accessible by public transportation. Parking is
                      available on-site for visitors.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Department Contacts */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
              Department Contacts
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, index) => (
                <Card
                  key={index}
                  className="shadow-soft hover:shadow-medium transition-all"
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {dept.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {dept.description}
                    </p>
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-primary hover:text-primary-light text-sm font-medium flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {dept.email}
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-12 text-foreground">
              Our Partners
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {partners.map((partner, index) => (
                <a
                  key={index}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary-light font-medium"
                >
                  <Globe className="w-5 h-5" />
                  {partner.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
