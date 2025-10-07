import { memo, ReactElement } from "react";

const ComponentWrapper = memo(
  ({
    children,
    className,
    componentName,
  }: {
    className?: string;
    componentName: string;
    children: ReactElement;
  }) => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {componentName}
        </h2>
        <div
          className={`bg-gray-100 rounded-lg p-3 border border-gray-200 focus-within:ring-1 focus-within:ring-indigo-200 transition-all ${
            className ? className : ""
          }`}
        >
          {children}
        </div>
      </div>
    );
  }
);

ComponentWrapper.displayName = "ComponentWrapper";

export default ComponentWrapper;
