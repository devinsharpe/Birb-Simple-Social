import NProgress from "nprogress";
import type { NextRouter } from "next/router";
import { useEffect } from "react";

const NProgressProvider: React.FC<{ router: NextRouter }> = ({ router }) => {
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
    });
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => {
      if (window) {
        const mainEl = document.querySelector("main");
        if (mainEl) mainEl.scrollTop = 0;
      }
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default NProgressProvider;
