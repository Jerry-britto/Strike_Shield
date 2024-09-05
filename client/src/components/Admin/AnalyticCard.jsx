import React from "react";

export default function AnalyticCard({ title, content }) {
  return (
    <div className="w-60 relative shadow-2xl rounded-xl overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-3xl mt-4">
      {/* Wavy Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 560"
        >
          <g fill="none">
            <path
              d="M 0,48 C 57.6,76 172.8,197.2 288,188 C 403.2,178.8 460.8,-7.2 576,2 C 691.2,11.2 748.8,208.2 864,234 C 979.2,259.8 1036.8,135.4 1152,131 C 1267.2,126.6 1382.4,195.8 1440,212L1440 560L0 560z"
              fill="#184a7e"
            ></path>
            <path
              d="M 0,401 C 96,430.4 288,544.6 480,548 C 672,551.4 768,423.6 960,418 C 1152,412.4 1344,499.6 1440,520L1440 560L0 560z"
              fill="#2264ab"
            ></path>
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative p-6 rounded-lg border-2 border-gray-100">
        <h2 className="text-lg font-semibold text-white tracking-wide">
          {title}
        </h2>
        <p className="mt-4 text-4xl font-extrabold text-white leading-relaxed">
          {content}
        </p>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 border-2 border-white opacity-50"></div>
    </div>
  );
}
