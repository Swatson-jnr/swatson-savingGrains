"use client";

import { Construction, Hammer, HardHat, Wrench } from "lucide-react";
import { AppLayout } from "../layout/app";

export default function UnderConstructionIllustration() {
  return (
    <AppLayout>
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-3xl w-full">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Illustration */}
          <div className="relative">
            <svg viewBox="0 0 400 400" className="w-full h-auto">
              {/* Ground */}
              <rect x="0" y="350" width="400" height="50" fill="#f5f5f5" />

              {/* Building structure */}
              <rect
                x="80"
                y="180"
                width="240"
                height="170"
                fill="#E7B00E"
                opacity="0.2"
              />
              <rect x="80" y="180" width="240" height="20" fill="#E7B00E" />
              <rect
                x="100"
                y="220"
                width="60"
                height="80"
                fill="white"
                stroke="#E7B00E"
                strokeWidth="3"
              />
              <rect
                x="180"
                y="220"
                width="60"
                height="80"
                fill="white"
                stroke="#E7B00E"
                strokeWidth="3"
              />
              <rect
                x="260"
                y="220"
                width="60"
                height="80"
                fill="white"
                stroke="#E7B00E"
                strokeWidth="3"
              />

              {/* Crane */}
              <line
                x1="300"
                y1="350"
                x2="300"
                y2="100"
                stroke="#E7B00E"
                strokeWidth="6"
              />
              <line
                x1="300"
                y1="100"
                x2="380"
                y2="100"
                stroke="#E7B00E"
                strokeWidth="4"
              />
              <line
                x1="380"
                y1="100"
                x2="360"
                y2="200"
                stroke="#E7B00E"
                strokeWidth="2"
                strokeDasharray="4"
              />
              <rect x="355" y="200" width="10" height="30" fill="#E7B00E" />

              {/* Constructor 1 - with hard hat */}
              <circle cx="150" cy="320" r="15" fill="#E7B00E" />
              <rect x="140" y="335" width="20" height="15" fill="#E7B00E" />
              <path
                d="M 135 320 L 140 310 L 160 310 L 165 320"
                fill="#E7B00E"
              />

              {/* Constructor 2 */}
              <circle cx="220" cy="320" r="15" fill="#666" />
              <rect x="210" y="335" width="20" height="15" fill="#666" />
              <path
                d="M 205 320 L 210 310 L 230 310 L 235 320"
                fill="#E7B00E"
              />

              {/* Tools on ground */}
              <rect x="30" y="330" width="30" height="5" fill="#E7B00E" />
              <rect x="43" y="320" width="4" height="15" fill="#E7B00E" />
            </svg>
          </div>

          {/* Right side - Text */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#E7B00E] bg-opacity-10 text-[#E7B00E] px-4 py-2 rounded-full mb-4">
              <HardHat size={20} />
              <span className="font-semibold text-white">In Progress</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">
             Page Under Construction
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Our construction crew is working around the clock to build
              something extraordinary for you.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E7B00E] flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-gray-700">Foundation laid</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E7B00E] flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-gray-700">Framework in place</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#E7B00E] flex items-center justify-center text-[#E7B00E] font-bold animate-pulse">
                  ...
                </div>
                <span className="text-gray-700">Final touches pending</span>
              </div>
            </div>

            <button className="bg-[#E7B00E] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d4a00d] transition">
              Notify Me When Ready
            </button>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
