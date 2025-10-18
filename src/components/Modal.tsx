import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  cancelText?: string;
  confirmText: string;
  confirmVariant?: 'primary' | 'danger';
  onCancel: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  cancelText = 'Cancel',
  confirmText,

  confirmVariant = 'primary',
  onCancel,
  onConfirm
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const confirmButtonClasses = {
    primary: 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800',
    danger: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800'
  };

  const cancelButtonClasses = 'px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className="relative bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="mb-6">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-white leading-tight"
          >
            {title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed mb-8 text-sm">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className={cancelButtonClasses}
            autoFocus
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={confirmButtonClasses[confirmVariant]}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
