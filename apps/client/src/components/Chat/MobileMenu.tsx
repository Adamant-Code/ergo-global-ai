import { Menu } from "lucide-react";

const MobileMenu = ({
  setIsOpen,
}: {
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
}) => {
  return (
    <button
      onClick={() => setIsOpen((prev) => !prev)}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#252628] text-white rounded-lg border border-gray-700"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
};

export default MobileMenu;
