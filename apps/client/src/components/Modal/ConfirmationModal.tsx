import { ModalProps } from "./types";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { FocusTrap } from "focus-trap-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const ComfirmationModal = ({
  title,
  onCancel,
  onConfirm,
  description,
  isModalOpen,
  className = "",
  titleClassName = "",
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  descriptionClassName = "",
  cancelButtonClassName = "",
  confirmButtonClassName = "",
  buttonContainerClassName = "",
}: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel?.();
      }
      if (e.key === "Enter" && !e.defaultPrevented) {
        e.preventDefault();
        onConfirm?.();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () =>
        document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isModalOpen, onConfirm, onCancel]);

    const handleOverlayClick = useCallback((
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (e.target === e.currentTarget) onCancel?.();
  }, [onCancel]);

  const overlayClass = useMemo(
    () =>
      twMerge(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-in-out",
        isModalOpen ? "opacity-100" : "opacity-0"
      ),
    [isModalOpen]
  );

  const dialogClass = useMemo(
    () =>
      twMerge(
        "w-full max-w-sm sm:max-w-md mx-4 sm:mx-0 rounded-lg bg-white p-4 sm:p-6 shadow-lg transform transition-transform duration-300 ease-in-out",
        isModalOpen ? "modal-enter" : "modal-exit",
        className
      ),
    [isModalOpen, className]
  );

  const titleClass = useMemo(
    () =>
      twMerge(
        "text-lg sm:text-xl font-semibold text-gray-900",
        titleClassName
      ),
    [titleClassName]
  );

  const descriptionClass = useMemo(
    () =>
      twMerge(
        "mt-2 text-sm sm:text-base text-gray-600",
        descriptionClassName
      ),
    [descriptionClassName]
  );

  const buttonContainerClass = useMemo(
    () =>
      twMerge(
        "mt-4 sm:mt-6 flex justify-end gap-2",
        buttonContainerClassName
      ),
    [buttonContainerClassName]
  );

  const cancelBtnClass = useMemo(
    () =>
      twMerge(
        "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200",
        cancelButtonClassName
      ),
    [cancelButtonClassName]
  );

  const confirmBtnClass = useMemo(
    () =>
      twMerge(
        "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200",
        confirmButtonClassName
      ),
    [confirmButtonClassName]
  );

  return (
    <>
      {isMounted &&
        isVisible &&
        createPortal(
          <FocusTrap>
            <div
              role="dialog"
              aria-modal="true"
              className={overlayClass}
              onClick={handleOverlayClick}
              aria-labelledby="modal-title"
            >
              <div className={dialogClass}>
                <h2
                  id="modal-title"
                  className={titleClass}
                >
                  {title}
                </h2>
                <p className={descriptionClass}>{description}</p>
                <div className={buttonContainerClass}>
                  <button
                    onClick={onCancel}
                    className={cancelBtnClass}
                  >
                    {cancelLabel}
                  </button>
                  <button
                    onClick={onConfirm}
                    className={confirmBtnClass}
                  >
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </div>
          </FocusTrap>,
          document.body
        )}
    </>
  );
};

export default ComfirmationModal;
