/** @type {import('next').NextConfig} */
const nextConfig = {
  // @turtle-soccer/core ships raw TypeScript (no build step, by design — see
  // its package.json), so Next.js needs to be told to compile it itself
  // rather than expecting pre-built JS, same as it would for any of the
  // app's own source files.
  transpilePackages: ["@turtle-soccer/core"],
};

export default nextConfig;
