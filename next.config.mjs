/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'ucarecdn.com'
        }],
        domains: ['lh3.googleusercontent.com'],
    }
};

console.log("Next.js configuration:", nextConfig);

export default nextConfig;