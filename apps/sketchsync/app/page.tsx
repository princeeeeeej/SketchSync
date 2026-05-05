import HeroPage from "@/components/HeroPage";
import Navbar from "@/components/Navbar";


export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar/>
      <HeroPage/>
    </div>
  )
}
