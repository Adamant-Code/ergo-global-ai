"use client";

import ComfirmationModal from "./ConfirmationModal";
import { memo, useState } from "react";
import { ConfirmationModalProps } from "./types";

export const Modal = memo(
  ({
    title,
    buttonName,
    description,
    className = "",
    onCancel = () => {},
    onConfirm = () => {},
    cancelLabel = "Cancel",
    confirmLabel = "Confirm",
    cancelButtonClassName = "",
    confirmButtonClassName = "",
  }: ConfirmationModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = () => {
      onCancel();
      setIsModalOpen(false);
    };

    const handleConfirm = () => {
      onConfirm();
      setIsModalOpen(false);
    };

    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-101"
        >
          {buttonName || "Open Modal"}
        </button>

        <ComfirmationModal
          title={title}
          className={className}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          description={description}
          isModalOpen={isModalOpen}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          cancelButtonClassName={cancelButtonClassName}
          confirmButtonClassName={confirmButtonClassName}
        />
      </>
    );
  }
);

Modal.displayName = "Modal";
