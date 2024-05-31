// Modal.js
import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, children, onClose }) => {
  const backdropRef = useRef(null);

  useEffect(() => {
    const $body = document.querySelector('body');
    const overflow = $body.style.overflow;
    $body.style.overflow = 'hidden';
    return () => {
      $body.style.overflow = overflow;
    };
  }, []);

  const handleBackdropClick = (event) => {
    if (backdropRef.current === event.target) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        className="relative mx-auto min-h-[500px] min-w-[400px] rounded-md bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="absolute right-2 top-2" onClick={onClose}>
          <FontAwesomeIcon className='w-6" h-6 text-white hover:text-slate-500' icon={faXmark} />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
