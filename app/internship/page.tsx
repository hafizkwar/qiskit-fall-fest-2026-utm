"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";

export default function InternshipPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    field: "",
    date: "",
    message: "",
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the email body
    const subject = encodeURIComponent(`Internship Application: ${formData.name}`);
    const body = encodeURIComponent(`Hello UTM Quantum Team,

I would like to apply for the Quantum Internship program. Here are my details:

Name: ${formData.name}
Email: ${formData.email}
University/Institution: ${formData.university}
Field of Study: ${formData.field}
Expected Start Date: ${formData.date}

Message to the Team:
${formData.message || "N/A"}

[IMPORTANT: My CV is attached to this email as '${file ? file.name : "my_cv.pdf"}']

Thank you,
${formData.name}`);

    // Since we can't attach local files via mailto directly due to browser security,
    // we instruct the user to attach it. We open their email client.
    window.location.href = `mailto:quantum@utm.my?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-black-deep text-white flex flex-col items-center justify-center py-20 px-4">
      <div className="w-full max-w-3xl">
        <Link href="/" className="inline-flex items-center text-off-white/50 hover:text-utm-gold mb-12 transition-colors">
          <ArrowLeft className="mr-2" size={16} />
          Back to Home
        </Link>
        
        <div className="mb-12">
          <span className="text-utm-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">UTM Quantum Careers</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">JOIN THE<br/>INTERNSHIP</h1>
          <p className="text-off-white/70 font-light leading-relaxed max-w-xl">
            We are looking for passionate individuals to join our quantum research ecosystem. Fill out your details below and drop your CV.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white/5 border border-utm-gold/30 p-12 text-center rounded-sm">
            <CheckCircle className="text-utm-gold mx-auto mb-6" size={48} />
            <h3 className="text-2xl font-bold mb-4">Email Client Opened!</h3>
            <p className="text-off-white/80 mb-6">
              Your default email app should now be open with your details pre-filled. 
              <br/><br/>
              <strong className="text-utm-gold text-lg">CRITICAL STEP:</strong><br/> 
              Please remember to <strong className="text-white">manually attach your CV file ({file ? file.name : 'your CV'})</strong> to the email before hitting send!
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-sm font-mono text-white/50 hover:text-white underline"
            >
              Back to form
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-mono">Full Name</label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-utm-gold transition-colors"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-mono">Email Address</label>
                <input 
                  required
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-utm-gold transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              {/* University */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-mono">University</label>
                <input 
                  required
                  type="text" 
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-utm-gold transition-colors"
                  placeholder="Universiti Teknologi Malaysia"
                />
              </div>

              {/* Field of Study */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-mono">Field of Study</label>
                <input 
                  required
                  type="text" 
                  name="field"
                  value={formData.field}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-utm-gold transition-colors"
                  placeholder="Physics / Computer Science"
                />
              </div>
              
              {/* Start Date */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-mono">Expected Start Date</label>
                <input 
                  required
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-utm-gold transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              {/* Message */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-white/50 font-mono">Message / Cover Letter</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white focus:outline-none focus:border-utm-gold transition-colors resize-none"
                  placeholder="Tell us a bit about yourself and why you want to join..."
                />
              </div>
            </div>

            {/* Drag & Drop CV */}
            <div className="pt-4">
              <label className="text-xs uppercase tracking-widest text-white/50 font-mono mb-4 block">Drop your CV</label>
              <div 
                className={`relative border-2 border-dashed flex flex-col items-center justify-center py-16 transition-all duration-300 ${isHovering ? 'border-utm-gold bg-utm-gold/5' : 'border-white/10 hover:border-white/30 bg-white/[0.02]'}`}
                onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                onDragLeave={() => setIsHovering(false)}
                onDrop={handleFileDrop}
              >
                <input 
                  type="file" 
                  id="cv-upload" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx"
                  required={!file}
                />
                
                {file ? (
                  <div className="flex flex-col items-center text-utm-gold">
                    <CheckCircle size={40} className="mb-4" />
                    <span className="font-bold text-lg">{file.name}</span>
                    <span className="text-xs text-white/50 mt-2">Click or drag to change file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-white/40">
                    <Upload size={40} className="mb-4" />
                    <span className="font-light">Drag and drop your CV here</span>
                    <span className="text-xs mt-2 uppercase tracking-widest font-mono">or click to browse</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-white/30 mt-3 text-center">Accepted formats: PDF, DOCX. Max size: 5MB.</p>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button 
                type="submit" 
                className="w-full py-5 bg-utm-gold text-black-deep font-bold tracking-widest text-sm hover:bg-white transition-colors duration-300"
              >
                GENERATE APPLICATION EMAIL
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
