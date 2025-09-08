import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import hopeLogo from "@/assets/hopelogo.jpg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center p-1">
                <img src={hopeLogo} alt="HFC Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl">HFC Organization</span>
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Dedicated to creating positive change in communities worldwide through 
              humanitarian initiatives, education, and sustainable development programs.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 hover:text-secondary cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-secondary cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 hover:text-secondary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-primary-foreground/80 hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/team" className="text-primary-foreground/80 hover:text-secondary transition-colors">Our Team</Link></li>
              <li><Link to="/thematic-areas" className="text-primary-foreground/80 hover:text-secondary transition-colors">Thematic Areas</Link></li>
              <li><Link to="/projects" className="text-primary-foreground/80 hover:text-secondary transition-colors">Projects</Link></li>
              <li><Link to="/gallery" className="text-primary-foreground/80 hover:text-secondary transition-colors">Gallery</Link></li>
              <li><Link to="/news" className="text-primary-foreground/80 hover:text-secondary transition-colors">News</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-primary-foreground/80 text-sm">info@hfc.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-primary-foreground/80 text-sm">+251 11 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-primary-foreground/80 text-sm">Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 HFC Foundation. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;