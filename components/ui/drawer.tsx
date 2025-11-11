import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

interface DrawerProps {
  visible: boolean;
  children: ReactNode;
  position: "left" | "right";
  contentClassName?: string;
}

const Drawer = (props: DrawerProps) => {
  // State
  const { children, visible, contentClassName, position = "right" } = props;
  const computedOverlayClass = useMemo(() => {
    return visible ? "opacity-100 block" : "opacity-0 hidden";
  }, [visible]);
  const computedContentVisibility = () => {
    switch (position) {
      case "right":
        return visible ? "translate-x-0" : "translate-x-full";
      default:
        return visible ? "translate-x-0" : "-translate-x-full";
    }
  };

  // Effects
  useEffect(() => {
    if (visible) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [visible]);

  // Template
  return createPortal(
    <div className="drawer">
      <div
        className={cn(
          "fixed top-0 z-[1040] h-screen w-full transform bg-white transition-all duration-300 ease-in-out sm:w-3/5 lg:w-96",
          position === "right" ? "right-0" : "left-0",
          computedContentVisibility(),
          contentClassName,
        )}
      >
        {children}
      </div>

      <div className={cn("drawer-overlay", computedOverlayClass)}></div>
    </div>,
    document.body,
  );
};

export default Drawer;
