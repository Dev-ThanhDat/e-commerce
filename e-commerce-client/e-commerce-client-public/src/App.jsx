import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <Header />
      <main className='flex flex-col min-h-[70vh]'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
