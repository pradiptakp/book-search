function Button({
  onClick,
  text,
  outline,
}: {
  onClick: () => void;
  text: string;
  outline?: boolean;
}) {
  return (
    <button
      className={`font-bold text-sm transition w-32 py-3 rounded-full ${
        outline
          ? "text-blue-600 border border-blue-600 hover:bg-blue-100"
          : "text-white bg-blue-600 hover:bg-blue-700 "
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
