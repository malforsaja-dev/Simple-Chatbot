type TextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
};

export const Textarea = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  rows = 3,
  required = false,
  className = "",
}: TextareaProps) => {
  return (
    <textarea
      className={`w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-3 rounded-md text-gray-800 ${className}`}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={rows}
      required={required}
    />
  );
}
