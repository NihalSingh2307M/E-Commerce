import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // This hook gets the current location object
  const { pathname } = useLocation();

  // This effect runs every time the 'pathname' (the URL) changes
  useEffect(() => {
    // This command scrolls the window to the top left corner
    window.scrollTo(0, 0);
  }, [pathname]);
  // This component doesn't render any HTML
  return null;
}

export default ScrollToTop;