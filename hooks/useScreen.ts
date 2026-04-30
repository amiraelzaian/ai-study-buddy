import { useState, useEffect } from "react";

type ScreenSize = {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

export function useScreenSize(): ScreenSize {
  const getSize = (): ScreenSize => {
    if (typeof window === "undefined") {
      return {
        width: 0,
        height: 0,
        isMobile: false,
        isTablet: false,
        isDesktop: false,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    };
  };

  const [screenSize, setScreenSize] = useState<ScreenSize>(getSize);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
}
