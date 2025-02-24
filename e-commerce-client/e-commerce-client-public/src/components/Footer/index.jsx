const Footer = () => {
  return (
    <footer className='py-5 px-[15px] text-white bg-color-232f3e'>
      <div className='flex flex-col items-center justify-center w-full max-w-screen-xl gap-5 mx-auto md:flex-row'>
        <p className='font-medium'>
          &copy; {new Date().getFullYear()}, Thanh Dat
        </p>
      </div>
    </footer>
  );
};

export default Footer;
