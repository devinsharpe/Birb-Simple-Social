import { Dialog, Transition } from "@headlessui/react";

import FeatherIcon from "feather-icons-react";
import { Fragment } from "react";
import atoms from "../atoms/";
import { useAtom } from "jotai";

const DialogModal: React.FC<{
  name: string;
  children: JSX.Element;
  title: string;
  isDismissable?: boolean;
}> = ({ children, isDismissable = true, name, title }) => {
  const [modal, setModal] = useAtom(atoms.modal);

  return (
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

          <div className="fixed inset-0 overflow-y-auto">
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
                <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 text-left align-middle shadow-lg transition-all dark:border-zinc-700 dark:bg-zinc-800">
                  <button
                    type="button"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-200"
                    onClick={() => setModal(undefined)}
                  >
                    <FeatherIcon icon="x" size={20} />
                  </button>
                  <div className="w-full pb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-zinc-800 dark:text-zinc-200"
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DialogModal;
