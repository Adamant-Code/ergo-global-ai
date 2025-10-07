import { useEffect, useState } from "react";

const useComponentMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  return { isMounted };
};

export default useComponentMounted;
