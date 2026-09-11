import { Navbar } from "@/components/navbar"
import Hero from "@/components/hero"
import AboutSection from "@/components/About"
import MangaStorySection from "@/components/MangaStory"
import EventSection from "@/components/Events"
import SponsorsComponent from "@/components/sponsor"
import Footer from "@/components/Footer"
import PresidentIntro from "@/components/President"
import TeamComponent from "@/components/Team"
import DomainsSection from "@/components/Domains"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <Hero />

      <AboutSection />

      <MangaStorySection />

      <DomainsSection />

      <div id="events" className="w-full">
        <EventSection />
      </div>

      <div id="president" className="w-full">
        <PresidentIntro />
      </div>

      <div id="team" className="w-full">
        <TeamComponent />
      </div>

      <div id="sponsors" className="w-full">
        <SponsorsComponent />
      </div>

      <div id="footer" className="w-full">
        <Footer />
      </div>
    </main>
  )
}
