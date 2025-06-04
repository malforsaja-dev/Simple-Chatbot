type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export const Button = ({
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition disabled:opacity-50 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
