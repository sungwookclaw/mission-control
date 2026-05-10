/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MISSION_STATE_API_URL: process.env.MISSION_STATE_API_URL || "http://150.109.244.22:18829",
    MISSION_API_TOKEN: process.env.MISSION_API_TOKEN || "",
  },
};
module.exports = nextConfig;
