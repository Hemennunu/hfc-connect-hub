import React from 'react';

// Import partner logos
import par1 from '../assets/par1.jpg';
import par2 from '../assets/par2.jpeg';
import par3 from '../assets/par3.png';
import par4 from '../assets/par4.jpg';
import par5 from '../assets/par5.jpg';
import par6 from '../assets/par6.jpg';
import par7 from '../assets/par7.png';
import par8 from '../assets/par8.png';
import par9 from '../assets/par9.png';
import par10 from '../assets/par10.png';
import par11 from '../assets/par11.png';
import par12 from '../assets/par12.png';
import par13 from '../assets/par13.jfif';
import par14 from '../assets/par14.jfif';
import par15 from '../assets/par15.jfif';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website: string;
}

const partners: Partner[] = [
  { id: 1, name: '', logo: par1, website: 'https://example1.com' },
  { id: 2, name: '', logo: par4, website: 'https://example4.com' },
  { id: 3, name: '', logo: par3, website: 'https://example3.com' },
  { id: 4, name: '', logo: par6, website: 'https://example6.com' },
  { id: 5, name: '', logo: par12, website: 'https://example12.com' },
  
 
  
  { id: 6, name: '', logo: par5, website: 'https://example5.com' },
  { id: 7, name: '', logo: par13, website: 'https://example13.com' },
  
  
  
  { id: 8, name: '', logo: par15, website: 'https://example15.com' },
  { id: 9, name: '', logo: par10, website: 'https://example10.com' },
  { id: 10, name: '', logo: par11, website: 'https://example11.com' },
  { id: 11, name: '', logo: par7, website: 'https://example7.com' },
  { id: 12, name: '', logo: par2, website: 'https://example2.com' },
  { id: 13, name: '', logo: par9, website: 'https://example9.com' },
  { id: 14, name: '', logo: par14, website: 'https://example14.com' },
  { id: 15, name: '', logo: par8, website: 'https://example8.com' },
  
];

const Partners: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-blue-100/60">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Our <span className="text-primary">Partners</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We work with amazing organizations to create lasting impact in our communities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {partners.map((partner) => (
            <a
              key={partner.id}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-medium hover:shadow-strong transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 relative overflow-hidden border border-white/50"
            >
              {/* Enhanced glow effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              {/* Refined shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              <div className="flex flex-col items-center relative z-10">
                <div className="w-24 h-24 mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-muted/30 to-background flex items-center justify-center relative group-hover:shadow-lg transition-all duration-300 border border-muted/20">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain group-hover:brightness-110 group-hover:contrast-110 transition-all duration-300"
                  />
                  {/* Enhanced logo glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 via-secondary/0 to-accent/0 group-hover:from-primary/15 group-hover:via-secondary/15 group-hover:to-accent/15 transition-all duration-500"></div>
                </div>
                <h3 className="text-sm md:text-base font-semibold text-foreground text-center group-hover:text-primary transition-all duration-300 leading-tight">
                  {partner.name}
                </h3>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-20">
          <p className="text-lg md:text-xl text-muted-foreground mb-8 font-light">
            Interested in partnering with us?
          </p>
          <button className="bg-gradient-to-r from-primary to-accent text-white px-12 py-4 rounded-xl hover:from-primary-glow hover:to-primary transition-all duration-300 font-semibold shadow-medium hover:shadow-strong transform hover:-translate-y-2 text-lg">
            Become a Partner
          </button>
        </div>
      </div>
    </section>
  );
};

export default Partners;
