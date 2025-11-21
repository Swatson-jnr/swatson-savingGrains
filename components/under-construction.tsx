import { Hammer, HardHat, Wrench } from "lucide-react";

export function UnderConstructionAnimated() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl w-full text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div
          className="absolute top-4 right-4 opacity-30 animate-spin"
          style={{ animationDuration: "3s" }}
        >
          <Wrench size={48} color="#E7B00E" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-30 animate-bounce">
          <Hammer size={48} color="#E7B00E" />
        </div>

        <div className="mb-6 flex justify-center gap-4">
          <div className="bg-[#E7B00E] rounded-full p-4 animate-pulse">
            <HardHat size={48} color="white" strokeWidth={2} />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          We're Building Something Great
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Our team is hard at work constructing this page. Stay tuned for the
          grand opening!
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
          <div
            className="h-4 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: "65%",
              background: "#E7B00E",
            }}
          ></div>
        </div>
        <p className="text-sm font-semibold" style={{ color: "#E7B00E" }}>
          Progress: 65%
        </p>
      </div>
    </div>
  );
}
