import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoMdCloseCircle } from 'react-icons/io';

function createModelWrapper() {
  const element = document.createElement('div');
  element.id = 'portal-wrapper';
  return element;
}

const portalModelElement = createModelWrapper();

const Model = ({ open = false, onClose = () => {}, children }) => {
  useEffect(() => {
    document.body.appendChild(portalModelElement);
  }, []);

  const renderContent = (
    <div
      className={`fixed inset-0 z-50 flex transition-all items-center justify-center p-5 modal ${
        open ? '' : 'opacity-0 invisible'
      }`}
    >
      <div
        className='absolute inset-0 bg-black bg-opacity-25 cursor-zoom-out'
        onClick={onClose}
      ></div>
      <div
        className={`p-[30px] bg-white border relative shadow-lg z-[999] transition-all lg:w-[60%]  rounded-lg w-full ${
          open ? 'scale-100' : 'scale-95'
        }`}
      >
        <span
          onClick={onClose}
          className='absolute top-[5px] right-[5px] cursor-pointer text-color-232f3e hover:text-red-500 transition-all'
        >
          <IoMdCloseCircle size={25} />
        </span>
        {children}
      </div>
    </div>
  );

  return createPortal(renderContent, portalModelElement);
};

export default Model;
