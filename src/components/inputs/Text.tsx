import FeatherIcon from "feather-icons-react";
import React from "react";

const TextInput: React.FC<{
  icon?: FeatherIcon.Icon;
  id: string;
  isValid?: boolean;
  label: string;
  maxLength?: number;
  name: string;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange: (val: string) => void;
  value: string;
  [key: string]: any;
}> = ({
  icon,
  id,
  isValid = true,
  label,
  maxLength,
  name,
  onChange,
  value,
  ...props
}) => {
  return (
    <fieldset
      className={`relative focus-within:text-violet-600 dark:focus-within:text-violet-400 ${
        !isValid && "text-rose-600 dark:text-rose-400"
      } ${props.disabled && "cursor-not-allowed opacity-75"}`}
    >
      <div className="absolute inset-x-0 top-1 flex w-full items-center justify-between px-3 text-sm font-medium">
        <label htmlFor={id}>{label}</label>
        {maxLength && (
          <span className="opacity-75">
            {value.length} / {maxLength}
          </span>
        )}
      </div>
      <input
        type="text"
        id={id}
        name={name}
        className={`w-full rounded-md bg-transparent pt-6 text-zinc-800 focus:border-violet-600 dark:text-white dark:focus:border-violet-400 ${
          icon && "pl-8"
        } ${!isValid && "border-rose-600 dark:border-rose-400"} ${
          props.disabled && "cursor-not-allowed"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {icon && (
        <FeatherIcon
          icon={icon}
          className="absolute bottom-[13px] left-3 text-zinc-600 dark:text-zinc-300"
          size={16}
        />
      )}
    </fieldset>
  );
};

export default TextInput;
