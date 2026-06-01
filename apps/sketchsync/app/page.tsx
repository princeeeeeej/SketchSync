import HeroPage from "@/components/HeroPage";
import Navbar from "@/components/Navbar";


export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/20">
      <Navbar />
      <HeroPage />
    </div>
  );
}
