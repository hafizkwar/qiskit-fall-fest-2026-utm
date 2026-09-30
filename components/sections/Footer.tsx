"use client";

import Link from "next/link";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#020202] pt-24 pb-12 border-t border-white/10 relative z-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/assets/utm-logo.png" 
                alt="UTM Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="text-lg font-bold text-white tracking-widest">UTM QUANTUM COMMUNITY</h3>
                <p className="text-sm text-utm-gold/80 font-mono">Universiti Teknologi Malaysia</p>
              </div>
            </div>
            <p className="text-white/50 text-sm max-w-sm mb-8 leading-relaxed">
              Exploring the quantum frontier through research, innovation, and education. Connecting bright minds to shape the future of quantum technology.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-6">Navigation</h4>
            <ul className="flex flex-col gap-3">
              {['About', 'Research', 'Community', 'Events', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase()}`} className="text-white/50 hover:text-utm-gold text-sm transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-6">Contact</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/50">
              <li>
                <span className="block text-white/30 text-xs font-mono mb-1">Email</span>
                <a href="mailto:quantum@utm.my" className="hover:text-utm-gold transition-colors">quantum@utm.my</a>
              </li>
              <li>
                <span className="block text-white/30 text-xs font-mono mb-1">Address</span>
                <p>Universiti Teknologi Malaysia<br/>81310 Johor Bahru<br/>Johor, Malaysia</p>
              </li>
              <li>
                <span className="block text-white/30 text-xs font-mono mb-2">Connect & Follow</span>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/utmquantum/" target="_blank" rel="noopener noreferrer" className="hover:text-utm-gold transition-colors">Instagram</a>
                  <a href="https://www.linkedin.com/in/utm-quantum-aab499433" target="_blank" rel="noopener noreferrer" className="hover:text-utm-gold transition-colors">LinkedIn</a>
                  <a href="https://www.facebook.com/profile.php?id=61594253566629" target="_blank" rel="noopener noreferrer" className="hover:text-utm-gold transition-colors">Facebook</a>
                </div>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs font-mono">
            &copy; {currentYear} Universiti Teknologi Malaysia. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
