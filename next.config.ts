import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Blog pages re-read content/posts every hour so scheduled posts appear on their date
  // without a redeploy; make sure the post files ship with the server code.
  outputFileTracingIncludes: {
    "/**": ["./content/posts/**/*"],
  },
};

export default nextConfig;
