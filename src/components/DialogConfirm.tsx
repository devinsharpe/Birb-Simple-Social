import DialogModal from "./DialogModal";
import React from "react";

interface DialogConfirmProps {
  children?: JSX.Element;
  disabled?: boolean;
  title: string;
  name: string;
  text: string;
  confirmText?: string;
  denyText?: string;
  onConfirm: () => void;
  onDeny: () => void;
}

const DialogConfirm: React.FC<DialogConfirmProps> = ({
  children,
  confirmText = "Yes",
  denyText = "No",
  disabled = false,
  name,
  onConfirm,
  onDeny,
  text,
  title,
}) => {
  return (
    <DialogModal title={title} name={name} isDismissable={false}>
      <>
        <section className="space-y-4">
          <p>{text}</p>
          <div className="flex w-full items-center gap-2">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-600 px-6 py-2 text-white hover:bg-zinc-700 dark:hover:bg-zinc-500"
              onClick={onDeny}
              disabled={disabled}
            >
              {denyText}
            </button>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 px-6 py-2 text-white hover:bg-violet-700 dark:hover:bg-violet-500"
              onClick={onConfirm}
              disabled={disabled}
            >
              {confirmText}
            </button>
          </div>
          {children}
        </section>
      </>
    </DialogModal>
  );
};

export default DialogConfirm;
