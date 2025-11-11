import { useState, useEffect } from "react";

interface LocationState {
  href: string;
  pathname: string;
  search: string;
  hash: string;
}

function useLocation(): LocationState {
  const [location, setLocation] = useState<LocationState>({
    href: "",
    pathname: "",
    search: "",
    hash: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocation({
        href: window.location.href,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      });
    }
  }, []);

  return location;
}

export default useLocation;
