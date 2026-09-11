"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const row1Images = [
  {
    id: "ARBITRUM EVENT-0",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/ARBITRUM EVENT/29fb1fc3-061e-4eaa-b4d6-cb321d31d414.jpg",
    eventTitle: "Arbitrum Event",
    alt: "Arbitrum Event Image",
    description: "Experience from Arbitrum Event"
  },
  {
    id: "Coinex After-Party-4",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Coinex After-Party/IMG-20260820-WA0121.jpg",
    eventTitle: "CoinEx After-Party",
    alt: "CoinEx After-Party Image",
    description: "Experience from CoinEx After-Party"
  },
  {
    id: "Coinex Event-8",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Coinex Event/Lauchpad ppt.png",
    eventTitle: "CoinEx Event",
    alt: "CoinEx Event Image",
    description: "Experience from CoinEx Event"
  },
  {
    id: "FRONTIER BUILD STATIONS-12",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/FRONTIER BUILD STATIONS/WhatsApp Image 2026-09-11 at 7.07.49 PM.jpeg",
    eventTitle: "Frontier Build Stations",
    alt: "Frontier Build Stations Image",
    description: "Experience from Frontier Build Stations"
  },
  {
    id: "IBW-16",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/IBW/b9c0fb4f-5ae6-47a0-85da-fd81898f3f24.jpg",
    eventTitle: "IBW",
    alt: "IBW Image",
    description: "Experience from IBW"
  },
  {
    id: "launchpad 2.0-20",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/launchpad 2.0/launchpad-002.jpg",
    eventTitle: "Launchpad 2.0",
    alt: "Launchpad 2.0 Image",
    description: "Experience from Launchpad 2.0"
  },
  {
    id: "launchpad 3.0-24",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/launchpad 3.0/IMG_1501.DNG",
    eventTitle: "Launchpad 3.0",
    alt: "Launchpad 3.0 Image",
    description: "Experience from Launchpad 3.0"
  },
  {
    id: "Qonneqt-28",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Qonneqt/Builders Qoonet.png",
    eventTitle: "Qonneqt",
    alt: "Qonneqt Image",
    description: "Experience from Qonneqt"
  },
  {
    id: "Skate Brunch - ETH Delhi-32",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Skate Brunch - ETH Delhi/1ef44ea2-0046-4fa7-a5f3-06863fc276ef.jpg",
    eventTitle: "Skate Brunch - ETH Delhi",
    alt: "Skate Brunch - ETH Delhi Image",
    description: "Experience from Skate Brunch - ETH Delhi"
  },
  {
    id: "Team 1 StarBucks Event-36",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Team 1 StarBucks Event/e68535c3-030f-4ea7-a623-e55992b19901.jpg",
    eventTitle: "Team 1 Starbucks Event",
    alt: "Team 1 Starbucks Event Image",
    description: "Experience from Team 1 Starbucks Event"
  },
  {
    id: "Aptos Hackathon-40",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Aptos Hackathon/ab281615-0af3-4538-8023-a62257c88546.jpg",
    eventTitle: "Aptos Hackathon",
    alt: "Aptos Hackathon Image",
    description: "Experience from Aptos Hackathon"
  },
  {
    id: "DevsHouse 25-44",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/DevsHouse 25/WhatsApp Image 2026-09-11 at 8.08.52 PM.jpeg",
    eventTitle: "DevsHouse '25",
    alt: "DevsHouse '25 Image",
    description: "Experience from DevsHouse '25"
  },
  {
    id: "EthBangkok-48",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/EthBangkok/WhatsApp Image 2026-09-11 at 7.58.39 PM.jpeg",
    eventTitle: "ETH Bangkok",
    alt: "ETH Bangkok Image",
    description: "Experience from ETH Bangkok"
  },
  {
    id: "ETHMumbai-52",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/ETHMumbai/WhatsApp Image 2026-09-11 at 7.58.39 PM (2).jpeg",
    eventTitle: "ETH Mumbai",
    alt: "ETH Mumbai Image",
    description: "Experience from ETH Mumbai"
  },
  {
    id: "HHGOA-56",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/HHGOA/d4b77164-7ff9-40be-b7c6-ed085d94e540.jpg",
    eventTitle: "HH Goa",
    alt: "HH Goa Image",
    description: "Experience from HH Goa"
  },
  {
    id: "Solana Frontier Villa party-60",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Solana Frontier Villa party/29750a86-bedf-45b7-b4eb-962ac319e9dd.jpg",
    eventTitle: "Solana Frontier Villa Party",
    alt: "Solana Frontier Villa Party Image",
    description: "Experience from Solana Frontier Villa Party"
  },
  {
    id: "Stellar Hackathon-64",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Stellar Hackathon/WhatsApp Image 2026-09-11 at 7.40.57 PM.jpeg",
    eventTitle: "Stellar Hackathon",
    alt: "Stellar Hackathon Image",
    description: "Experience from Stellar Hackathon"
  }
];

const row2Images = [
  {
    id: "ARBITRUM EVENT-1",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/ARBITRUM EVENT/8f20c129-f8c1-4cdf-b164-5e9957972865.jpg",
    eventTitle: "Arbitrum Event",
    alt: "Arbitrum Event Image",
    description: "Experience from Arbitrum Event"
  },
  {
    id: "Coinex After-Party-5",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Coinex After-Party/IMG-20260820-WA0141.jpg",
    eventTitle: "CoinEx After-Party",
    alt: "CoinEx After-Party Image",
    description: "Experience from CoinEx After-Party"
  },
  {
    id: "DEVCON INDIA-9",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/DEVCON INDIA/515cc581-d9a2-40e1-85b2-d7059d132de3.jpg",
    eventTitle: "Devcon India",
    alt: "Devcon India Image",
    description: "Experience from Devcon India"
  },
  {
    id: "Hack and Seek-13",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Hack and Seek/30badb48-7d17-4b4f-b2a4-59a7487eb150.jpg",
    eventTitle: "Hack and Seek",
    alt: "Hack and Seek Image",
    description: "Experience from Hack and Seek"
  },
  {
    id: "IBW-17",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/IBW/e89372d5-fd78-4e3e-aba1-69d76c4c2972.jpg",
    eventTitle: "IBW",
    alt: "IBW Image",
    description: "Experience from IBW"
  },
  {
    id: "launchpad 2.0-21",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/launchpad 2.0/launchpad-003.png",
    eventTitle: "Launchpad 2.0",
    alt: "Launchpad 2.0 Image",
    description: "Experience from Launchpad 2.0"
  },
  {
    id: "Metamask event-25",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Metamask event/1999d234-f808-4c94-8544-668cb436ad25.jpg",
    eventTitle: "MetaMask Event",
    alt: "MetaMask Event Image",
    description: "Experience from MetaMask Event"
  },
  {
    id: "Qonneqt-29",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Qonneqt/qonneqt-001.jpg",
    eventTitle: "Qonneqt",
    alt: "Qonneqt Image",
    description: "Experience from Qonneqt"
  },
  {
    id: "Solana Superteam Event-33",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Solana Superteam Event/e61a4000-56c5-402c-8855-96c10edabbe2.jpg",
    eventTitle: "Solana Superteam Event",
    alt: "Solana Superteam Event Image",
    description: "Experience from Solana Superteam Event"
  },
  {
    id: "X402 EVENT-37",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/X402 EVENT/071627b2-c452-42ef-83cd-93047cae7a7b.jpg",
    eventTitle: "X402 Event",
    alt: "X402 Event Image",
    description: "Experience from X402 Event"
  },
  {
    id: "Build on Stacks-41",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Build on Stacks/082cbb62-9b23-4f69-be1f-18bfd9a0e8ee.jpg",
    eventTitle: "Build on Stacks",
    alt: "Build on Stacks Image",
    description: "Experience from Build on Stacks"
  },
  {
    id: "Devshouse 26-45",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Devshouse 26/5e46cea6-8b58-4e8b-a75b-e51345cb21c3.jpg",
    eventTitle: "DevsHouse '26",
    alt: "DevsHouse '26 Image",
    description: "Experience from DevsHouse '26"
  },
  {
    id: "EthDelhi-49",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/EthDelhi/2ad5c62a-4870-4b03-99e9-3337df228ffd.jpg",
    eventTitle: "ETH Delhi",
    alt: "ETH Delhi Image",
    description: "Experience from ETH Delhi"
  },
  {
    id: "hackverse-53",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/hackverse/hackverse-001.jpg",
    eventTitle: "Hackverse",
    alt: "Hackverse Image",
    description: "Experience from Hackverse"
  },
  {
    id: "HHGOA-57",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/HHGOA/e11c483c-bc35-4531-8db1-115d51da5074.jpg",
    eventTitle: "HH Goa",
    alt: "HH Goa Image",
    description: "Experience from HH Goa"
  },
  {
    id: "Solana Frontier Villa party-61",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Solana Frontier Villa party/f44092e0-6d12-4518-aa98-e26af6e96262.jpg",
    eventTitle: "Solana Frontier Villa Party",
    alt: "Solana Frontier Villa Party Image",
    description: "Experience from Solana Frontier Villa Party"
  },
  {
    id: "Team1 Hackathon-65",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Team1 Hackathon/06a33328-c136-4069-97eb-1f6492aa9230.jpg",
    eventTitle: "Team 1 Hackathon",
    alt: "Team 1 Hackathon Image",
    description: "Experience from Team 1 Hackathon"
  }
];

const row3Images = [
  {
    id: "ARBITRUM EVENT-2",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/ARBITRUM EVENT/be6f7602-d760-4c3f-a8b9-ef5be22d12e3.jpg",
    eventTitle: "Arbitrum Event",
    alt: "Arbitrum Event Image",
    description: "Experience from Arbitrum Event"
  },
  {
    id: "Coinex After-Party-6",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Coinex After-Party/IMG-20260911-WA0244.jpg",
    eventTitle: "CoinEx After-Party",
    alt: "CoinEx After-Party Image",
    description: "Experience from CoinEx After-Party"
  },
  {
    id: "DEVCON INDIA-10",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/DEVCON INDIA/fc000b35-4318-44c8-a26e-587c85bb074d.jpg",
    eventTitle: "Devcon India",
    alt: "Devcon India Image",
    description: "Experience from Devcon India"
  },
  {
    id: "Hack and Seek-14",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Hack and Seek/fb43b909-1c2a-4b74-9d57-d249be8da97c.jpg",
    eventTitle: "Hack and Seek",
    alt: "Hack and Seek Image",
    description: "Experience from Hack and Seek"
  },
  {
    id: "IBW-18",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/IBW/ffc248bd-42ef-41f0-849b-19a3ee81e053.jpg",
    eventTitle: "IBW",
    alt: "IBW Image",
    description: "Experience from IBW"
  },
  {
    id: "launchpad 3.0-22",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/launchpad 3.0/DSC_0712.JPG",
    eventTitle: "Launchpad 3.0",
    alt: "Launchpad 3.0 Image",
    description: "Experience from Launchpad 3.0"
  },
  {
    id: "Metamask event-26",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Metamask event/7a3eac7f-5c30-4bdc-b32f-87fe8e227553.jpg",
    eventTitle: "MetaMask Event",
    alt: "MetaMask Event Image",
    description: "Experience from MetaMask Event"
  },
  {
    id: "Qonneqt-30",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Qonneqt/qonneqt-002.jpg",
    eventTitle: "Qonneqt",
    alt: "Qonneqt Image",
    description: "Experience from Qonneqt"
  },
  {
    id: "SuperMove Event-34",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/SuperMove Event/Supermove.png",
    eventTitle: "SuperMove Event",
    alt: "SuperMove Event Image",
    description: "Experience from SuperMove Event"
  },
  {
    id: "Aptos Hackathon-38",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Aptos Hackathon/0a6597fa-6405-47e4-a901-dc1c8d05fe22.jpg",
    eventTitle: "Aptos Hackathon",
    alt: "Aptos Hackathon Image",
    description: "Experience from Aptos Hackathon"
  },
  {
    id: "Build on Stacks-42",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Build on Stacks/8fb51aa8-93c9-4bed-9a31-875004294dd5.jpg",
    eventTitle: "Build on Stacks",
    alt: "Build on Stacks Image",
    description: "Experience from Build on Stacks"
  },
  {
    id: "Devshouse 26-46",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Devshouse 26/9fd39535-6d43-4607-956f-7a2cc4fe8f76.jpg",
    eventTitle: "DevsHouse '26",
    alt: "DevsHouse '26 Image",
    description: "Experience from DevsHouse '26"
  },
  {
    id: "EthDelhi-50",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/EthDelhi/77fe8e14-79ea-4363-bd0b-63736669fc5d.jpg",
    eventTitle: "ETH Delhi",
    alt: "ETH Delhi Image",
    description: "Experience from ETH Delhi"
  },
  {
    id: "hackverse-54",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/hackverse/hackverse-002.jpg",
    eventTitle: "Hackverse",
    alt: "Hackverse Image",
    description: "Experience from Hackverse"
  },
  {
    id: "Parallax-58",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Parallax/WhatsApp Image 2026-09-11 at 8.20.24 PM.jpeg",
    eventTitle: "Parallax Hackathon",
    alt: "Parallax Hackathon Image",
    description: "Experience from Parallax Hackathon"
  },
  {
    id: "Stellar Hackathon-62",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Stellar Hackathon/WhatsApp Image 2026-09-11 at 7.40.57 PM (1).jpeg",
    eventTitle: "Stellar Hackathon",
    alt: "Stellar Hackathon Image",
    description: "Experience from Stellar Hackathon"
  },
  {
    id: "Team1 Hackathon-66",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Team1 Hackathon/21f750b8-f0fe-4743-868e-3021cba6fff4.jpg",
    eventTitle: "Team 1 Hackathon",
    alt: "Team 1 Hackathon Image",
    description: "Experience from Team 1 Hackathon"
  }
];

const row4Images = [
  {
    id: "Chai with Skate - Bangalore-3",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Chai with Skate - Bangalore/a109d46c-7d6a-48c1-9b32-4226d402f17a.jpg",
    eventTitle: "Chai with Skate - Bangalore",
    alt: "Chai with Skate - Bangalore Image",
    description: "Experience from Chai with Skate - Bangalore"
  },
  {
    id: "Coinex Event-7",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Coinex Event/b3fcf318-669b-4b3d-bc36-14714ad83d01.jpeg",
    eventTitle: "CoinEx Event",
    alt: "CoinEx Event Image",
    description: "Experience from CoinEx Event"
  },
  {
    id: "FRONTIER BUILD STATIONS-11",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/FRONTIER BUILD STATIONS/70c25c52-775b-40b6-b16c-6d1feecc9e65.jpg",
    eventTitle: "Frontier Build Stations",
    alt: "Frontier Build Stations Image",
    description: "Experience from Frontier Build Stations"
  },
  {
    id: "IBW-15",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/IBW/2ce537d7-c0c0-40a3-84fb-de58faea24a9.jpg",
    eventTitle: "IBW",
    alt: "IBW Image",
    description: "Experience from IBW"
  },
  {
    id: "launchpad 2.0-19",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/launchpad 2.0/launchpad-001.jpg",
    eventTitle: "Launchpad 2.0",
    alt: "Launchpad 2.0 Image",
    description: "Experience from Launchpad 2.0"
  },
  {
    id: "launchpad 3.0-23",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/launchpad 3.0/DSC_0767.JPG",
    eventTitle: "Launchpad 3.0",
    alt: "Launchpad 3.0 Image",
    description: "Experience from Launchpad 3.0"
  },
  {
    id: "Metamask event-27",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Metamask event/b174fb46-baa0-4be9-9cd2-fa67f8ff091e.jpg",
    eventTitle: "MetaMask Event",
    alt: "MetaMask Event Image",
    description: "Experience from MetaMask Event"
  },
  {
    id: "Qonneqt-31",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Qonneqt/qonneqt-003.jpg",
    eventTitle: "Qonneqt",
    alt: "Qonneqt Image",
    description: "Experience from Qonneqt"
  },
  {
    id: "Team 1 StarBucks Event-35",
    src: "https://ik.imagekit.io/ysfz8n1no/public/Events/Team 1 StarBucks Event/237635e0-c2f4-4aae-82df-8e60a306879e.jpg",
    eventTitle: "Team 1 Starbucks Event",
    alt: "Team 1 Starbucks Event Image",
    description: "Experience from Team 1 Starbucks Event"
  },
  {
    id: "Aptos Hackathon-39",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Aptos Hackathon/2f7683bd-9459-4001-9921-14ae33448c39.jpg",
    eventTitle: "Aptos Hackathon",
    alt: "Aptos Hackathon Image",
    description: "Experience from Aptos Hackathon"
  },
  {
    id: "DevsHouse 25-43",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/DevsHouse 25/WhatsApp Image 2026-09-11 at 8.08.51 PM.jpeg",
    eventTitle: "DevsHouse '25",
    alt: "DevsHouse '25 Image",
    description: "Experience from DevsHouse '25"
  },
  {
    id: "EthBangkok-47",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/EthBangkok/WhatsApp Image 2026-09-11 at 7.58.39 PM (1).jpeg",
    eventTitle: "ETH Bangkok",
    alt: "ETH Bangkok Image",
    description: "Experience from ETH Bangkok"
  },
  {
    id: "EthDelhi-51",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/EthDelhi/d2d9d400-e7e7-4c50-8393-5c2a5a093242.jpg",
    eventTitle: "ETH Delhi",
    alt: "ETH Delhi Image",
    description: "Experience from ETH Delhi"
  },
  {
    id: "hackverse-55",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/hackverse/hackverse-003.jpg",
    eventTitle: "Hackverse",
    alt: "Hackverse Image",
    description: "Experience from Hackverse"
  },
  {
    id: "SIH 25-59",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/SIH 25/WhatsApp Image 2026-09-11 at 8.20.24 PM (1).jpeg",
    eventTitle: "SIH '25",
    alt: "SIH '25 Image",
    description: "Experience from SIH '25"
  },
  {
    id: "Stellar Hackathon-63",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Stellar Hackathon/WhatsApp Image 2026-09-11 at 7.40.57 PM (2).jpeg",
    eventTitle: "Stellar Hackathon",
    alt: "Stellar Hackathon Image",
    description: "Experience from Stellar Hackathon"
  },
  {
    id: "Team1 Hackathon-67",
    src: "https://ik.imagekit.io/ysfz8n1no/public/HACKATHONS/Team1 Hackathon/96d2924c-845a-4a77-8dca-1e0585211d1a.jpg",
    eventTitle: "Team 1 Hackathon",
    alt: "Team 1 Hackathon Image",
    description: "Experience from Team 1 Hackathon"
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
    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221]/95 via-[#0B1221]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 space-y-1.5">
      <h3 className="text-lg sm:text-xl font-bold text-white tracking-wider [word-spacing:0.2em]">{event.eventTitle}</h3>
      <p className="text-white/80 text-sm leading-relaxed tracking-wide [word-spacing:0.14em]">{event.description}</p>
    </div>
  </div>
);

const InfiniteScrollRow = ({ items, direction = 'left', speed = 1.8 }: { items: typeof row1Images, direction?: 'left' | 'right', speed?: number }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    let rafId: number;
    let isVisible = false;
    let isRunning = false;
    let pos = 0;
    let loopWidth = 0;
    const spd = speed; // px per frame (increased from hardcoded 0.8)

    const animate = () => {
      if (!isVisible) {
        isRunning = false;
        return;
      }
      if (!pausedRef.current) {
        pos += direction === 'left' ? spd : -spd;
        if (direction === 'left' && pos >= loopWidth) pos -= loopWidth;
        if (direction === 'right' && pos <= 0) pos += loopWidth;
        track.style.transform = `translateX(-${pos}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !isRunning) {
          isRunning = true;
          rafId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(wrap);

    // Read layout once after first paint
    rafId = requestAnimationFrame(() => {
      loopWidth = track.offsetWidth / 3;
      if (direction === 'right') pos = loopWidth;
      if (isVisible) {
        isRunning = true;
        animate();
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [direction, speed]);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden py-3"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={() => { pausedRef.current = false; }}
    >
      <div
        ref={trackRef}
        className="flex gap-4 sm:gap-6 w-max"
        style={{ willChange: 'transform' }}
      >
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] sm:h-[500px] bg-[#F2B200]/10 rounded-full pointer-events-none opacity-50 blur-[30px] sm:blur-[100px]" />
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
        <div className="hidden md:flex flex-col gap-2">
          <InfiniteScrollRow items={row3Images} direction="left" />
          <InfiniteScrollRow items={row4Images} direction="right" />
        </div>
      </div>
    </section>
  );
}
