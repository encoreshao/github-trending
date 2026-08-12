import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// react-router doesn't reset scroll position on navigation, so clicking an
// internal link while scrolled down on the current page keeps that scroll
// offset on the next page. Force it back to the top on every route change.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
