import { memo } from "react";
import { ToastComponentsProps } from "../Dashboard/types";

const ToastComponents = memo(
  ({
    info,
    error,
    label,
    success,
    withAction,
    handleUndo,
  }: ToastComponentsProps) => {
    return (
      <div>
        <div className="text-sm font-medium text-gray-700 mb-1 inline-block">
          {label}
        </div>
        <div className="flex gap-4 flex-wrap">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all duration-300 transform"
            onClick={() =>
              withAction
                ? success("Item deleted!", {
                    action: { label: "Undo", onClick: handleUndo },
                  })
                : success("Item deleted!")
            }
          >
            Success
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all duration-300 transform"
            onClick={() =>
              withAction
                ? error("Failed to save.", {
                    action: { label: "Retry", onClick: handleUndo },
                  })
                : error("Failed to save.")
            }
          >
            Error
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all duration-300 transform"
            onClick={() =>
              withAction
                ? info("Check details.", {
                    action: { label: "View", onClick: handleUndo },
                  })
                : info("Check details.")
            }
          >
            Info
          </button>
        </div>
      </div>
    );
  }
);

ToastComponents.displayName = "ToastComponents";

export default ToastComponents;
