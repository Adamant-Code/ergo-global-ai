import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function Loader() {
  return (
    <div className="w-full min-h-screen absolute inset-0">
      <div className="w-full h-2/3 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    </div>
  );
}
