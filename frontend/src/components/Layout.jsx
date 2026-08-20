import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Ticker from './Ticker';
import Footer from './Footer';
import CustomCursor from './CustomCursor';
import ScrollTopButton from './ScrollTopButton';
import { useReveal } from '../hooks/useReveal';

export default function Layout() {
  const { pathname } = useLocation();
  useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isHome = pathname === '/';

  return (
    <>
      <CustomCursor />
      <Navbar />
      {isHome && <Ticker />}
      <Outlet />
      {!isHome && <Footer />}
      <ScrollTopButton />
    </>
  );
}
