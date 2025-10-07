import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function TableLoader() {
  return (
    <div className="p-8 h-2/3">
      <div className="animate-pulse flex space-x-4 h-full">
        <div className="flex-1 space-y-4 py-1 h-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </div>
    </div>
  );
}
