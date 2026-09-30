"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Focus Areas", href: "#focus-areas" },
    { name: "Research", href: "#research" },
    { name: "Community", href: "#community" },
    { name: "Events", href: "#events" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass-nav py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/assets/utm-logo.png" 
              alt="UTM Logo" 
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-widest leading-none">UTM</span>
              <span className="text-[10px] text-muted-gray tracking-wider">QUANTUM COMMUNITY</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-off-white/80 hover:text-utm-gold transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-utm-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="#join"
              className="hidden md:inline-flex items-center justify-center px-5 py-2 text-xs font-semibold tracking-wider text-white border border-white/20 hover:border-utm-gold hover:bg-white/5 transition-all duration-300 rounded-full group"
            >
              JOIN COMMUNITY
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>

            <button
              className="lg:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black-deep/95 backdrop-blur-xl z-40 lg:hidden flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-2xl font-light text-white hover:text-utm-gold transition-colors duration-200 ${
                mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="#join"
            className={`mt-4 px-8 py-3 border border-utm-gold text-utm-gold rounded-full hover:bg-utm-gold hover:text-black-deep transition-colors duration-300 ${
              mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${navLinks.length * 100}ms` }}
            onClick={() => setMobileMenuOpen(false)}
          >
            JOIN COMMUNITY
          </Link>
        </nav>
      </div>
    </header>
  );
}
