import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const AlertModal = ({ isOpen, children, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative min-h-[100px] min-w-[400px] rounded-md bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="absolute right-2 top-2 z-10" onClick={onClose}>
          <FontAwesomeIcon className="h-6 w-6 text-white hover:text-slate-500" icon={faXmark} />
        </button>
        {children}
        <div className="mb-4 flex justify-center">
          <button
            type="button"
            className="rounded-md border border-slate-300 px-4 py-1 text-blue-500 shadow-md hover:bg-blue-500 hover:text-white"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default AlertModal;
