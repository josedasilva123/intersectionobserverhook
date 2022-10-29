/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from "react";

export const useIntersectionObserver = <Element extends globalThis.Element>(
  callback: (entries: IntersectionObserverEntry[]) => void,
  deps: any[],
  canObserve: boolean
) => {
  const observingElement = useRef<Element>(null);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(async (entries) => {
      if (callback) {
        callback(entries);
      }
    });

    if (canObserve) {
      intersectionObserver.observe(observingElement.current as Element);
    }

    return () => {
      intersectionObserver.disconnect();
    };
  }, deps);

  return observingElement;
};
