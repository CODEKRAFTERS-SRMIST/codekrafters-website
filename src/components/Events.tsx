"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const row1Images = [
  {
    id: "FRONTIER BUILD STATIONS-0",
    src: "/Events/FRONTIER BUILD STATIONS/70c25c52-775b-40b6-b16c-6d1feecc9e65.jpg",
    eventTitle: "FRONTIER BUILD STATIONS",
    alt: "FRONTIER BUILD STATIONS Event Image 1",
    description: "Experience from FRONTIER BUILD STATIONS"
  },
  {
    id: "Metamask event-2",
    src: "/Events/Metamask event/b174fb46-baa0-4be9-9cd2-fa67f8ff091e.jpg",
    eventTitle: "Metamask event",
    alt: "Metamask event Event Image 3",
    description: "Experience from Metamask event"
  },
  {
    id: "ARBITRUM EVENT-1",
    src: "/Events/ARBITRUM EVENT/8f20c129-f8c1-4cdf-b164-5e9957972865.jpg",
    eventTitle: "ARBITRUM EVENT",
    alt: "ARBITRUM EVENT Event Image 2",
    description: "Experience from ARBITRUM EVENT"
  },
  {
    id: "launchpad-2",
    src: "/Events/launchpad/launchpad-003.png",
    eventTitle: "launchpad",
    alt: "launchpad Event Image 3",
    description: "Experience from launchpad"
  },
  {
    id: "Team1 Hackathon-1",
    src: "/HACKATHONS/Team1 Hackathon/21f750b8-f0fe-4743-868e-3021cba6fff4.jpg",
    eventTitle: "Team1 Hackathon",
    alt: "Team1 Hackathon Event Image 2",
    description: "Experience from Team1 Hackathon"
  },
  {
    id: "IBW-0",
    src: "/Events/IBW/1ef44ea2-0046-4fa7-a5f3-06863fc276ef.jpg",
    eventTitle: "IBW",
    alt: "IBW Event Image 1",
    description: "Experience from IBW"
  },
  {
    id: "ARBITRUM EVENT-0",
    src: "/Events/ARBITRUM EVENT/29fb1fc3-061e-4eaa-b4d6-cb321d31d414.jpg",
    eventTitle: "ARBITRUM EVENT",
    alt: "ARBITRUM EVENT Event Image 1",
    description: "Experience from ARBITRUM EVENT"
  },
  {
    id: "EthDelhi-0",
    src: "/HACKATHONS/EthDelhi/2a070812-a034-4b34-8ae8-ed8ebe3d4937.jpg",
    eventTitle: "EthDelhi",
    alt: "EthDelhi Event Image 1",
    description: "Experience from EthDelhi"
  },
  {
    id: "Hack and Seek-0",
    src: "/Events/Hack and Seek/30badb48-7d17-4b4f-b2a4-59a7487eb150.jpg",
    eventTitle: "Hack and Seek",
    alt: "Hack and Seek Event Image 1",
    description: "Experience from Hack and Seek"
  },
  {
    id: "Aptos Hackathon-1",
    src: "/HACKATHONS/Aptos Hackathon/2f7683bd-9459-4001-9921-14ae33448c39.jpg",
    eventTitle: "Aptos Hackathon",
    alt: "Aptos Hackathon Event Image 2",
    description: "Experience from Aptos Hackathon"
  },
  {
    id: "Build on Stacks-0",
    src: "/HACKATHONS/Build on Stacks/082cbb62-9b23-4f69-be1f-18bfd9a0e8ee.jpg",
    eventTitle: "Build on Stacks",
    alt: "Build on Stacks Event Image 1",
    description: "Experience from Build on Stacks"
  }
];

const row2Images = [
  {
    id: "IBW-2",
    src: "/Events/IBW/a109d46c-7d6a-48c1-9b32-4226d402f17a.jpg",
    eventTitle: "IBW",
    alt: "IBW Event Image 3",
    description: "Experience from IBW"
  },
  {
    id: "Team1 Hackathon-0",
    src: "/HACKATHONS/Team1 Hackathon/06a33328-c136-4069-97eb-1f6492aa9230.jpg",
    eventTitle: "Team1 Hackathon",
    alt: "Team1 Hackathon Event Image 1",
    description: "Experience from Team1 Hackathon"
  },
  {
    id: "Aptos Hackathon-0",
    src: "/HACKATHONS/Aptos Hackathon/0a6597fa-6405-47e4-a901-dc1c8d05fe22.jpg",
    eventTitle: "Aptos Hackathon",
    alt: "Aptos Hackathon Event Image 1",
    description: "Experience from Aptos Hackathon"
  },
  {
    id: "Qonneqt-1",
    src: "/Events/Qonneqt/qonneqt-002.jpg",
    eventTitle: "Qonneqt",
    alt: "Qonneqt Event Image 2",
    description: "Experience from Qonneqt"
  },
  {
    id: "X402 EVENT-0",
    src: "/Events/X402 EVENT/071627b2-c452-42ef-83cd-93047cae7a7b.jpg",
    eventTitle: "X402 EVENT",
    alt: "X402 EVENT Event Image 1",
    description: "Experience from X402 EVENT"
  },
  {
    id: "hackverse-1",
    src: "/Events/hackverse/hackverse-002.jpg",
    eventTitle: "hackverse",
    alt: "hackverse Event Image 2",
    description: "Experience from hackverse"
  },
  {
    id: "Devshouse 26-0",
    src: "/HACKATHONS/Devshouse 26/5e46cea6-8b58-4e8b-a75b-e51345cb21c3.jpg",
    eventTitle: "Devshouse 26",
    alt: "Devshouse 26 Event Image 1",
    description: "Experience from Devshouse 26"
  },
  {
    id: "hackverse-0",
    src: "/Events/hackverse/hackverse-001.jpg",
    eventTitle: "hackverse",
    alt: "hackverse Event Image 1",
    description: "Experience from hackverse"
  },
  {
    id: "launchpad3.0-2",
    src: "/Events/launchpad3.0/IMG_1501.DNG",
    eventTitle: "launchpad3.0",
    alt: "launchpad3.0 Event Image 3",
    description: "Experience from launchpad3.0"
  },
  {
    id: "Solana Frontier Villa party-0",
    src: "/HACKATHONS/Solana Frontier Villa party/29750a86-bedf-45b7-b4eb-962ac319e9dd.jpg",
    eventTitle: "Solana Frontier Villa party",
    alt: "Solana Frontier Villa party Event Image 1",
    description: "Experience from Solana Frontier Villa party"
  }
];

const row3Images = [
  {
    id: "DEVCON INDIA-1",
    src: "/Events/DEVCON INDIA/fc000b35-4318-44c8-a26e-587c85bb074d.jpg",
    eventTitle: "DEVCON INDIA",
    alt: "DEVCON INDIA Event Image 2",
    description: "Experience from DEVCON INDIA"
  },
  {
    id: "launchpad-0",
    src: "/Events/launchpad/launchpad-001.jpg",
    eventTitle: "launchpad",
    alt: "launchpad Event Image 1",
    description: "Experience from launchpad"
  },
  {
    id: "Devshouse 26-1",
    src: "/HACKATHONS/Devshouse 26/9fd39535-6d43-4607-956f-7a2cc4fe8f76.jpg",
    eventTitle: "Devshouse 26",
    alt: "Devshouse 26 Event Image 2",
    description: "Experience from Devshouse 26"
  },
  {
    id: "Metamask event-0",
    src: "/Events/Metamask event/1999d234-f808-4c94-8544-668cb436ad25.jpg",
    eventTitle: "Metamask event",
    alt: "Metamask event Event Image 1",
    description: "Experience from Metamask event"
  },
  {
    id: "launchpad-1",
    src: "/Events/launchpad/launchpad-002.jpg",
    eventTitle: "launchpad",
    alt: "launchpad Event Image 2",
    description: "Experience from launchpad"
  },
  {
    id: "launchpad3.0-0",
    src: "/Events/launchpad3.0/DSC_0712.JPG",
    eventTitle: "launchpad3.0",
    alt: "launchpad3.0 Event Image 1",
    description: "Experience from launchpad3.0"
  },
  {
    id: "Qonneqt-0",
    src: "/Events/Qonneqt/qonneqt-001.jpg",
    eventTitle: "Qonneqt",
    alt: "Qonneqt Event Image 1",
    description: "Experience from Qonneqt"
  },
  {
    id: "DEVCON INDIA-0",
    src: "/Events/DEVCON INDIA/515cc581-d9a2-40e1-85b2-d7059d132de3.jpg",
    eventTitle: "DEVCON INDIA",
    alt: "DEVCON INDIA Event Image 1",
    description: "Experience from DEVCON INDIA"
  },
  {
    id: "HHGOA-0",
    src: "/HACKATHONS/HHGOA/d4b77164-7ff9-40be-b7c6-ed085d94e540.jpg",
    eventTitle: "HHGOA",
    alt: "HHGOA Event Image 1",
    description: "Experience from HHGOA"
  },
  {
    id: "Hack and Seek-1",
    src: "/Events/Hack and Seek/fb43b909-1c2a-4b74-9d57-d249be8da97c.jpg",
    eventTitle: "Hack and Seek",
    alt: "Hack and Seek Event Image 2",
    description: "Experience from Hack and Seek"
  }
];

const row4Images = [
  {
    id: "launchpad3.0-1",
    src: "/Events/launchpad3.0/DSC_0767.JPG",
    eventTitle: "launchpad3.0",
    alt: "launchpad3.0 Event Image 2",
    description: "Experience from launchpad3.0"
  },
  {
    id: "hackverse-2",
    src: "/Events/hackverse/hackverse-003.jpg",
    eventTitle: "hackverse",
    alt: "hackverse Event Image 3",
    description: "Experience from hackverse"
  },
  {
    id: "IBW-1",
    src: "/Events/IBW/2ce537d7-c0c0-40a3-84fb-de58faea24a9.jpg",
    eventTitle: "IBW",
    alt: "IBW Event Image 2",
    description: "Experience from IBW"
  },
  {
    id: "HHGOA-1",
    src: "/HACKATHONS/HHGOA/e11c483c-bc35-4531-8db1-115d51da5074.jpg",
    eventTitle: "HHGOA",
    alt: "HHGOA Event Image 2",
    description: "Experience from HHGOA"
  },
  {
    id: "Metamask event-1",
    src: "/Events/Metamask event/7a3eac7f-5c30-4bdc-b32f-87fe8e227553.jpg",
    eventTitle: "Metamask event",
    alt: "Metamask event Event Image 2",
    description: "Experience from Metamask event"
  },
  {
    id: "EthDelhi-1",
    src: "/HACKATHONS/EthDelhi/2ad5c62a-4870-4b03-99e9-3337df228ffd.jpg",
    eventTitle: "EthDelhi",
    alt: "EthDelhi Event Image 2",
    description: "Experience from EthDelhi"
  },
  {
    id: "ARBITRUM EVENT-2",
    src: "/Events/ARBITRUM EVENT/be6f7602-d760-4c3f-a8b9-ef5be22d12e3.jpg",
    eventTitle: "ARBITRUM EVENT",
    alt: "ARBITRUM EVENT Event Image 3",
    description: "Experience from ARBITRUM EVENT"
  },
  {
    id: "Qonneqt-2",
    src: "/Events/Qonneqt/qonneqt-003.jpg",
    eventTitle: "Qonneqt",
    alt: "Qonneqt Event Image 3",
    description: "Experience from Qonneqt"
  },
  {
    id: "Build on Stacks-1",
    src: "/HACKATHONS/Build on Stacks/8fb51aa8-93c9-4bed-9a31-875004294dd5.jpg",
    eventTitle: "Build on Stacks",
    alt: "Build on Stacks Event Image 2",
    description: "Experience from Build on Stacks"
  },
  {
    id: "Solana Frontier Villa party-1",
    src: "/HACKATHONS/Solana Frontier Villa party/f44092e0-6d12-4518-aa98-e26af6e96262.jpg",
    eventTitle: "Solana Frontier Villa party",
    alt: "Solana Frontier Villa party Event Image 2",
    description: "Experience from Solana Frontier Villa party"
  }
];

const EventCard = ({ event }: { event: typeof row1Images[0] }) => (
  <div className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 aspect-video flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] hover:border-white/30 transition-all duration-300">
    <Image
      src={event.src}
      alt={event.alt}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      sizes="(max-width: 768px) 280px, (max-width: 1200px) 320px, 380px"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221]/90 via-[#0B1221]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{event.eventTitle}</h3>
      <p className="text-white/70 text-sm">{event.description}</p>
    </div>
  </div>
);

const InfiniteScrollRow = ({ items, direction = 'left', speed = 30 }: { items: typeof row1Images, direction?: 'left' | 'right', speed?: number }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollPos = 0;
    
    // Create seamless loop by tripling the content
    const scrollContent = () => {
      if (isHovered) {
        animationFrameId = requestAnimationFrame(scrollContent);
        return;
      }

      scrollPos += direction === 'left' ? 1 : -1;
      
      const maxScroll = scrollContainer.scrollWidth / 3;
      
      if (direction === 'left' && scrollPos >= maxScroll) {
        scrollPos = 0;
      } else if (direction === 'right' && scrollPos <= 0) {
        scrollPos = maxScroll;
      }

      scrollContainer.scrollLeft = scrollPos;
      animationFrameId = requestAnimationFrame(scrollContent);
    };

    animationFrameId = requestAnimationFrame(scrollContent);

    return () => cancelAnimationFrame(animationFrameId);
  }, [direction, isHovered, speed]);

  return (
    <div 
      className="relative flex overflow-hidden py-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-hidden whitespace-nowrap"
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Render 3 sets of items for seamless infinite scroll */}
        {[...items, ...items, ...items].map((item, idx) => (
          <EventCard key={item.id + "-" + idx} event={item} />
        ))}
      </div>
    </div>
  );
};

export default function Events() {
  return (
    <section className="relative py-20 overflow-hidden bg-[#0B1221]" id="events">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#F2B200]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 mb-16 relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#F2B200] animate-pulse" />
            <span className="text-white/80 text-sm font-medium tracking-wide">MOMENTS</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight">
            OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2B200] to-[#FFD700]">EVENTS</span>
          </h2>
          <p className="text-white/60 max-w-2xl text-sm md:text-base font-medium">
            Glimpses of our vibrant community in action across various events and workshops.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        {/* Left and Right Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0B1221] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0B1221] to-transparent z-20 pointer-events-none" />

        <InfiniteScrollRow items={row1Images} direction="left" />
        <InfiniteScrollRow items={row2Images} direction="right" />
        <InfiniteScrollRow items={row3Images} direction="left" />
        <InfiniteScrollRow items={row4Images} direction="right" />
      </div>
    </section>
  );
}
