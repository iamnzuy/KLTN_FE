/** @type {import('next').NextConfig} */
const nextConfig = {
  // For local development, basePath is '/'
  // This file will be overwritten during deployment with the appropriate basePath
  images: {
    domains: ['localhost', '127.0.0.1', 'kltn-fe.vercel.app', 'res.cloudinary.com' ],
  },
};

export default nextConfig;
