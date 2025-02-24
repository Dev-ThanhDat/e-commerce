import Brands from '@/components/Brands';
import FeaturedProducts from '@/components/FeaturedProducts';
import News from '@/components/News';
import Services from '@/components/Services';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    document.title = 'Trang chủ';
  }, []);

  return (
    <section className='w-full max-w-screen-xl mx-auto px-[15px]'>
      <Services />
      <FeaturedProducts />
      <Brands />
      <News />
    </section>
  );
};

export default Home;
