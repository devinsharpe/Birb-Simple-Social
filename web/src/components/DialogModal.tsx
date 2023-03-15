import { Dialog, Transition } from "@headlessui/react";

import FeatherIcon from "feather-icons-react";
import { Fragment } from "react";
import atoms from "../atoms/";
import { useAtom } from "jotai";
import { createPortal } from "react-dom";

const DialogModal: React.FC<{
  name: string;
  children: JSX.Element;
  title: string;
  isDismissable?: boolean;
  position?: "top" | "middle" | "bottom";
}> = ({ children, isDismissable = true, name, position = "middle", title }) => {
  const [modal, setModal] = useAtom(atoms.modal);
  if (typeof window === "undefined") return null;
  return createPortal(
    <>
      <Transition appear show={modal === name} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => isDismissable && setModal(undefined)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div
            className={`fixed inset-x-0 overflow-y-auto ${
              position === "top" ? "top-4" : ""
            } ${position === "middle" ? "inset-y-0" : ""} ${
              position === "bottom" ? "bottom-4" : ""
            }`}
          >
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`relative max-h-[85vh] w-full max-w-lg transform overflow-hidden rounded-lg border border-zinc-200 bg-white text-left shadow-lg transition-all dark:border-zinc-700 dark:bg-zinc-800`}
                >
                  <div className="absolute inset-x-0 top-0 z-[2] flex w-full items-center justify-between bg-white/50 py-4 px-6 backdrop-blur-md dark:bg-zinc-800/50">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-zinc-800 dark:text-zinc-200"
                    >
                      {title}
                    </Dialog.Title>
                    {isDismissable ? (
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-200"
                        onClick={() => setModal(undefined)}
                      >
                        <FeatherIcon icon="x" size={20} />
                      </button>
                    ) : (
                      <div className="h-8"></div>
                    )}
                  </div>
                  <section className="max-h-[85vh] overflow-y-auto px-6 pt-20 pb-8">
                    {children}
                  </section>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>,
    document.body
  );
};

export default DialogModal;
