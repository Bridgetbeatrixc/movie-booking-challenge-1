import { useEffect, useState } from "react";

function getRouteFromHash() {
  const hash = window.location.hash;

  if (window.location.hash === "#booking") {
    return "booking";
  }

  if (window.location.hash === "#payment") {
    return "payment";
  }

  if (hash.startsWith("#admin")) {
    return "admin";
  }

  return "home";
}

export function useHashRoute() {
  const [route, setRoute] = useState(getRouteFromHash);

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash;
      setRoute(getRouteFromHash());

      if (hash === "#booking" || hash === "#payment" || hash.startsWith("#admin") || hash === "#" || hash === "") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return route;
}
