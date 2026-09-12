import { Navbar } from "@/components/navbar";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#FFEFB4]">
      <Navbar />
      <FaqSection isStandalone={true} />
      <Footer />
    </main>
  );
}
