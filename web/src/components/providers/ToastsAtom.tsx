import { Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Toast } from "../../atoms";
import atoms from "../../atoms";

const ToastsAtomProvider = () => {
  const [currentToast, setCurrentToast] = useState<Toast | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null);
  const [toasts, setToasts] = useAtom(atoms.toasts);

  const dismissToast = () => {
    setShowToast(false);
    setTimeout(() => {
      setCurrentToast(null);
      setToasts(toasts.slice(1));
    }, 300);
  };

  const clearToastTimeout = () => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
      setToastTimeout(null);
    }
  };

  useEffect(() => {
    if (!currentToast && toasts[0]) {
      setShowToast(true);
      setCurrentToast(toasts[0]);

      setToastTimeout(
        setTimeout(() => {
          dismissToast();
        }, 10000)
      );
    }

    return clearToastTimeout;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toasts]);

  const CurrentIcon = useMemo(() => {
    if (currentToast && currentToast.icon) return currentToast.icon;
    else return null;
  }, [currentToast]);

  if (typeof window !== "undefined")
    return createPortal(
      <>
        <Transition
          show={showToast}
          enter="transform duration-300 ease-in-out"
          enterFrom="opacity-0 scale-75"
          enterTo="-translate-y-20 opacity-100 scale-100"
          leave="transform duration-300 ease-in-out"
          leaveFrom="opacity-100 scale-100 -translate-y-24"
          leaveTo="opacity-0 scale-75"
        >
          {currentToast && (
            <div className="pointer-events-none fixed -bottom-16 z-[1] ml-[50vw] flex w-auto -translate-x-1/2 items-center gap-4 rounded-md  bg-zinc-800 px-4 py-2 text-white shadow">
              {CurrentIcon && <CurrentIcon size={20} />}
              <span className="whitespace-nowrap">{currentToast.content}</span>
            </div>
          )}
        </Transition>
      </>,
      document.body
    );
  else return null;
};

export default ToastsAtomProvider;
