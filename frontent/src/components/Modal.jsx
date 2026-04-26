import { useEffect } from 'react';

export function Modal({ isOpen, title, onClose, children }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[540px] rounded-[24px] border border-[#d6dfeb] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-[18px] flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <button
            aria-label="Close modal"
            className="h-9 w-9 cursor-pointer rounded-full border border-[#d6dfeb] bg-[#f7f9fc] text-slate-700"
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
