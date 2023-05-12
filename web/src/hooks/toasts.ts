import { useAtom } from "jotai";
import type { Toast } from "../atoms";
import atoms from "../atoms";
import { useCallback } from "react";

const useToasts = () => {
  const [toasts, setToasts] = useAtom(atoms.toasts);

  const addToast = useCallback(
    (toast: Toast) => {
      setToasts([...toasts.filter((t) => t.id !== toast.id), toast]);
    },
    [toasts, setToasts]
  );
  return {
    toasts,
    addToast,
  };
};

export default useToasts;
