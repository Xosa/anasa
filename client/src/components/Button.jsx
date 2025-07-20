function Button({
  children,
  onClick,
  type = "button",
  style = {},
  className = "",
}) {
  const baseStyle = {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#01a9ac",
    color: "white",
    cursor: "pointer",
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      style={baseStyle}
      className={className}
    >
      {children}
    </button>
  );
}

export default Button;
