import { useEffect, useState } from "react";

function getRouteFromHash() {
  if (window.location.hash === "#movie") {
    return "movie";
  }

  if (window.location.hash === "#booking") {
    return "booking";
  }

  if (window.location.hash === "#payment") {
    return "payment";
  }

  return "home";
}

export function useHashRoute() {
  const [route, setRoute] = useState(getRouteFromHash);

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash;
      setRoute(getRouteFromHash());

      if (hash === "#movie" || hash === "#booking" || hash === "#payment" || hash === "#" || hash === "") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return route;
}
