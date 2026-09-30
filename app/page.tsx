import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FocusAreas from "@/components/sections/FocusAreas";
import QuantumNetwork from "@/components/sections/QuantumNetwork";
import Research from "@/components/sections/Research";
import Community from "@/components/sections/Community";
import Events from "@/components/sections/Events";
import JoinCommunity from "@/components/sections/JoinCommunity";
import QuantumStory from "@/components/three/QuantumStory";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black-deep">
      <Hero />
      <About />
      <FocusAreas />
      <QuantumStory />
      <QuantumNetwork />
      <Research />
      <Community />
      <Events />
      <JoinCommunity />
    </main>
  );
}
