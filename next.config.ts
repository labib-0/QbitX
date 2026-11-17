import type { NextConfig } from "next";

// Environment compatibility shims
if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function (compareFn) {
    return this.slice().sort(compareFn);
  };
}

if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function () {
    return this.slice().reverse();
  };
}

if (!Array.prototype.toSpliced) {
  Array.prototype.toSpliced = function (...args: any[]) {
    const copy = this.slice();
    (copy as any).splice(...args);
    return copy;
  };
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
