/**
 * Common props for a generic confirmation modal component.
 * These describe the content, labels and actions available in the modal.
 */
export interface ConfirmationModalProps {
  /**
   * Title displayed at the top of the modal.
   */
  title: string;
  /**
   * Additional Tailwind (or other) classes applied to the modal container.
   * Merged with sensible defaults using tailwind-merge so later classes win.
   */
  className?: string;
  /**
   * Optional label for an external/trigger button that opens the modal
   * (used by some consumers of ConfirmationModal).
   */
  buttonName?: string;
  /**
   * Descriptive text shown in the modal body under the title.
   */
  description: string;
  /**
   * Text for the cancel action button. Defaults to "Cancel" in consumers.
   */
  cancelLabel?: string;
  /**
   * Text for the confirm action button. Defaults to "Confirm" in consumers.
   */
  confirmLabel?: string;
  /**
   * Called when the user cancels/closes the modal.
   * Also invoked on overlay click and Escape key press.
   */
  onCancel: () => void;
  /**
   * Called when the user confirms the action.
   * Also invoked on Enter key press if not prevented.
   */
  onConfirm: () => void;
  /**
   * Extra classes for the cancel button. Merged with defaults.
   */
  cancelButtonClassName?: string;
  /**
   * Extra classes for the confirm button. Merged with defaults.
   */
  confirmButtonClassName?: string;
}

/**
 * Props for the reusable Modal component.
 * Includes a subset of ConfirmationModal props and additional styling/visibility controls.
 *
 * Behavior:
 * - Visibility is controlled via `isModalOpen`.
 * - Escape closes the modal (calls `onCancel`).
 * - Enter confirms (calls `onConfirm`).
 * - Clicking the backdrop closes the modal (calls `onCancel`).
 * - All className props are merged with defaults using tailwind-merge; later classes take precedence.
 */
export type ModalProps = Pick<
  ConfirmationModalProps,
  | "title"
  | "onCancel"
  | "onConfirm"
  | "className"
  | "description"
  | "cancelLabel"
  | "confirmLabel"
  | "cancelButtonClassName"
  | "confirmButtonClassName"
> & {
  /**
   * Controls whether the modal is open. When false, the modal can play its exit animation
   * before being removed from the DOM by the consumer implementation.
   */
  isModalOpen: boolean;
  /**
   * Extra classes for the title element.
   */
  titleClassName?: string;
  /**
   * Extra classes for the description/body text element.
   */
  descriptionClassName?: string;
  /**
   * Extra classes for the button container (the wrapper around the action buttons).
   */
  buttonContainerClassName?: string;
};
