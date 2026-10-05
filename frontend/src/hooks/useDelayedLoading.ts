import { useEffect, useState } from "react";

// True only once `isLoading` has stayed true for `delayMs`. Fast loads never
// show a skeleton, which avoids a skeleton flashing up and vanishing.
export function useDelayedLoading(isLoading: boolean, delayMs = 300) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShow(false);
      return;
    }
    const timer = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(timer);
  }, [isLoading, delayMs]);

  return show;
}
