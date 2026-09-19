import type { NextConfig } from "next";

const r2CustomHostname = (() => {
  try {
    return process.env.NEXT_PUBLIC_R2_PUBLIC_URL 
      ? new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_URL).hostname 
      : null;
  } catch {
    return null;
  }
})();

const remotePatterns: Array<{
  protocol?: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname?: string;
}> = [
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'imgs.search.brave.com',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'i.pravatar.cc',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'ik.imagekit.io',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: '**.r2.cloudflarestorage.com',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: '**.r2.dev',
    port: '',
    pathname: '/**',
  },
];

if (r2CustomHostname && !remotePatterns.some((p) => p.hostname === r2CustomHostname)) {
  remotePatterns.push({
    protocol: 'https',
    hostname: r2CustomHostname,
    port: '',
    pathname: '/**',
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
