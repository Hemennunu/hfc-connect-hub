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
}

const partners: Partner[] = [
  { id: 1, name: 'Partner Organization 1', logo: par1 },
  { id: 2, name: 'Partner Organization 2', logo: par2 },
  { id: 3, name: 'Partner Organization 3', logo: par3 },
  { id: 4, name: 'Partner Organization 4', logo: par4 },
  { id: 5, name: 'Partner Organization 5', logo: par5 },
  { id: 6, name: 'Partner Organization 6', logo: par6 },
  { id: 7, name: 'Partner Organization 7', logo: par7 },
  { id: 8, name: 'Partner Organization 8', logo: par8 },
  { id: 9, name: 'Partner Organization 9', logo: par9 },
  { id: 10, name: 'Partner Organization 10', logo: par10 },
  { id: 11, name: 'Partner Organization 11', logo: par11 },
  { id: 12, name: 'Partner Organization 12', logo: par12 },
  { id: 13, name: 'Partner Organization 13', logo: par13 },
  { id: 14, name: 'Partner Organization 14', logo: par14 },
  { id: 15, name: 'Partner Organization 15', logo: par15 },
];

const MovingPartnersBar: React.FC = () => {
  // Duplicate partners array for seamless loop
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 overflow-hidden border-t border-blue-800/30">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-yellow-400/5"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)`
      }}></div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent w-16"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-16"></div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-white to-yellow-400 bg-clip-text text-transparent mb-3">
            Our Trusted Partners
          </h3>
          <p className="text-blue-200/80 text-sm font-medium tracking-wide">
            Building Tomorrow Together • Creating Lasting Impact
          </p>
        </div>
        
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-20 pointer-events-none"></div>
          
          {/* Moving container */}
          <div className="flex animate-scroll space-x-8 py-4">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 group cursor-pointer"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 flex items-center justify-center p-3 relative overflow-hidden group-hover:scale-110 group-hover:-translate-y-2 border border-white/20">
                  {/* Multiple glow layers */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-yellow-400/0 to-blue-600/0 group-hover:from-blue-400/30 group-hover:via-yellow-400/20 group-hover:to-blue-600/30 transition-all duration-700 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-500 rounded-2xl"></div>
                  
                  {/* Enhanced shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-2xl"></div>
                  
                  {/* Pulsing ring effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/50 group-hover:animate-pulse transition-all duration-300"></div>
                  
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter group-hover:grayscale-0 group-hover:brightness-110 group-hover:contrast-110 transition-all duration-500 relative z-10 drop-shadow-sm group-hover:drop-shadow-md"
                  />
                  
                  {/* Floating particles effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-2 right-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="flex justify-center mt-8">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent w-64"></div>
        </div>
      </div>
    </div>
  );
};

export default MovingPartnersBar;
