// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: {
        bodySizeLimit: "10mb", // Increase to 10MB or adjust as needed
      },
    },
  };
  
  export default nextConfig;