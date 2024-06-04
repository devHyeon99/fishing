import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const ConfirmModal = ({ isOpen, children, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative flex min-h-[100px] min-w-[400px] flex-col rounded-md bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="absolute right-2 top-2 z-10" onClick={onClose}>
          <FontAwesomeIcon className="h-6 w-6 text-white hover:text-slate-500" icon={faXmark} />
        </button>
        <h2 className="rounded-t-md bg-blue-400 p-4 text-center font-semibold text-white">알림</h2>
        {children}
        <div className="py-4 text-center">
          <button
            type="button"
            className="mr-2 rounded border border-slate-300 px-4 py-1 text-sm font-semibold text-red-500 shadow-md hover:bg-red-500 hover:text-white"
            onClick={onConfirm}
          >
            예
          </button>
          <button
            type="button"
            className="rounded border border-slate-300 px-4 py-1 text-sm font-semibold text-blue-400 shadow-md hover:bg-blue-500 hover:text-white"
            onClick={onClose}
          >
            아니오
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default ConfirmModal;
