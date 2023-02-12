import { Menu, Transition } from "@headlessui/react";

import FeatherIcon from "feather-icons-react";
import { Fragment } from "react";

export interface DialogMenuItemProps {
  disabled?: boolean;
  icon: FeatherIcon.Icon;
  onClick: () => void;
  text: string;
}

const DialogMenuItem: React.FC<DialogMenuItemProps> = ({
  disabled = false,
  icon,
  onClick,
  text,
}) => {
  return (
    <Menu.Item disabled={disabled}>
      {({ active }) => (
        <button
          className={`${
            active
              ? "bg-zinc-200 text-violet-800 dark:bg-zinc-700 dark:text-violet-200"
              : "text-zinc-800 dark:text-zinc-200"
          } ${
            disabled && "opacity-50"
          } group flex w-full items-center gap-4 rounded px-2 py-2 text-sm`}
          onClick={onClick}
        >
          <FeatherIcon
            icon={icon}
            size={20}
            className={`${!disabled && "dark:group-hover:text-violet-400"}`}
          />
          <span>{text}</span>
        </button>
      )}
    </Menu.Item>
  );
};

const DialogMenu: React.FC<{
  items: (DialogMenuItemProps | DialogMenuItemProps[])[];
}> = ({ items }) => {
  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center px-4 py-2 text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-white">
            <FeatherIcon icon="menu" size={24} aria-hidden="true" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-zinc-400 rounded border border-zinc-400 bg-white py-1 shadow-lg focus:outline-none dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-800">
            {items.map((item, index) =>
              Array.isArray(item) ? (
                <div className="px-2 py-1" key={index}>
                  {item.map((i, idx) => (
                    <DialogMenuItem key={index + "-" + idx} {...i} />
                  ))}
                </div>
              ) : (
                <div className="px-2 py-1" key={index}>
                  <DialogMenuItem {...item} />
                </div>
              )
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DialogMenu;
