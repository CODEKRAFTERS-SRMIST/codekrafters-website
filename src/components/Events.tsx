'use client';

import React from "react";
import { Russo_One, Montserrat } from 'next/font/google';

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["800", "900"] });

function Card({ src, label }: { src: string; label: string }) {
  return (
    <div className="relative group mx-2 sm:mx-3 md:mx-4 flex-shrink-0">
      <img
        src={src || "/placeholder.svg"}
        alt={label}
        loading="lazy"
        className="h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 w-auto rounded-lg sm:rounded-xl transition-transform duration-300 group-hover:scale-95"
      />

      <div className="absolute inset-0 bg-black/60 rounded-lg sm:rounded-xl opacity-0 
        group-hover:opacity-100 transition-opacity duration-300 
        flex items-center justify-center pointer-events-none">
        <span className="text-white text-xs sm:text-sm md:text-lg lg:text-xl font-semibold text-center px-2">
          {label}
        </span>
      </div>
    </div>
  );
}

function EventRow({
  items,
  reverse = false,
}: {
  items: { src: string; label: string }[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <section className="w-full overflow-hidden py-4 sm:py-6 md:py-8">
      <div className={`scroll-row ${reverse ? "reverse" : ""}`}>
        {doubled.map((item, i) => (
          <Card key={`event-${i}`} src={`/${item.src}`} label={item.label} />
        ))}
      </div>

      <style jsx>{`
        .scroll-row {
          display: flex;
          width: max-content;     
          animation: scrollX 25s linear infinite;
        }

        .scroll-row.reverse {
          animation-direction: reverse;
        }

        .scroll-row:hover {
          animation-play-state: paused;
        }
        @keyframes scrollX {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

export default function EventSection() {
  const row1Images = [
    {
        "src": "events/ARBITRUM EVENT/29fb1fc3-061e-4eaa-b4d6-cb321d31d414.jpg",
        "label": "ARBITRUM EVENT"
    },
    {
        "src": "events/ARBITRUM EVENT/8f20c129-f8c1-4cdf-b164-5e9957972865.jpg",
        "label": "ARBITRUM EVENT"
    },
    {
        "src": "events/ARBITRUM EVENT/be6f7602-d760-4c3f-a8b9-ef5be22d12e3.jpg",
        "label": "ARBITRUM EVENT"
    },
    {
        "src": "events/DEVCON INDIA/515cc581-d9a2-40e1-85b2-d7059d132de3.jpg",
        "label": "DEVCON INDIA"
    },
    {
        "src": "events/DEVCON INDIA/fc000b35-4318-44c8-a26e-587c85bb074d.jpg",
        "label": "DEVCON INDIA"
    },
    {
        "src": "events/FRONTIER BUILD STATIONS/70c25c52-775b-40b6-b16c-6d1feecc9e65.jpg",
        "label": "FRONTIER BUILD STATIONS"
    }
];

  const row2Images = [
    {
        "src": "events/Hack and Seek/30badb48-7d17-4b4f-b2a4-59a7487eb150.jpg",
        "label": "Hack and Seek"
    },
    {
        "src": "events/Hack and Seek/fb43b909-1c2a-4b74-9d57-d249be8da97c.jpg",
        "label": "Hack and Seek"
    },
    {
        "src": "events/hackverse/hackverse-001.jpg",
        "label": "hackverse"
    },
    {
        "src": "events/hackverse/hackverse-002.jpg",
        "label": "hackverse"
    },
    {
        "src": "events/hackverse/hackverse-003.jpg",
        "label": "hackverse"
    },
    {
        "src": "events/IBW/1ef44ea2-0046-4fa7-a5f3-06863fc276ef.jpg",
        "label": "IBW"
    }
];

  const row3Images = [
    {
        "src": "events/IBW/2ce537d7-c0c0-40a3-84fb-de58faea24a9.jpg",
        "label": "IBW"
    },
    {
        "src": "events/IBW/a109d46c-7d6a-48c1-9b32-4226d402f17a.jpg",
        "label": "IBW"
    },
    {
        "src": "events/launchpad/launchpad-001.jpg",
        "label": "launchpad"
    },
    {
        "src": "events/launchpad/launchpad-002.jpg",
        "label": "launchpad"
    },
    {
        "src": "events/launchpad/launchpad-003.png",
        "label": "launchpad"
    },
    {
        "src": "events/Metamask event/1999d234-f808-4c94-8544-668cb436ad25.jpg",
        "label": "Metamask event"
    }
];

  const row4Images = [
    {
        "src": "events/Metamask event/7a3eac7f-5c30-4bdc-b32f-87fe8e227553.jpg",
        "label": "Metamask event"
    },
    {
        "src": "events/Metamask event/b174fb46-baa0-4be9-9cd2-fa67f8ff091e.jpg",
        "label": "Metamask event"
    },
    {
        "src": "events/Qonneqt/qonneqt-001.jpg",
        "label": "Qonneqt"
    },
    {
        "src": "events/Qonneqt/qonneqt-002.jpg",
        "label": "Qonneqt"
    },
    {
        "src": "events/Qonneqt/qonneqt-003.jpg",
        "label": "Qonneqt"
    },
    {
        "src": "events/X402 EVENT/071627b2-c452-42ef-83cd-93047cae7a7b.jpg",
        "label": "X402 EVENT"
    }
];

  return (
    <div className="w-full bg-[#FFEFB4] overflow-x-hidden">
      {/* Row 1 - Left Scroll */}
      <EventRow
        items={row1Images}
      />

      {/* Row 2 - Right Scroll */}
      <EventRow
        items={row2Images}
        reverse
      />

      {/* Title */}
      <div className="text-center py-8 sm:py-12 md:py-16 px-4">
        <h2 className={`${russoOne.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight`}>
          <span className="text-[#0b1220]">CODE</span>
          <span className="text-[#F2B200]">KRAFTERS </span>
        </h2>
        <h2 className={`${russoOne.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight`}>
          <span className="text-[#0b1220]">EVENTS</span>
        </h2>
      </div>

      {/* Row 3 - Left Scroll */}
      <EventRow
        items={row3Images}
      />

      {/* Row 4 - Right Scroll */}
      <EventRow
        items={row4Images}
        reverse
      />
    </div>
  );
}
