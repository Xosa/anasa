function Divider({ children, style = {}, className = "", ...rest }) {
  return (
    <div style={style} className={className} {...rest}>
      {children}
    </div>
  );
}

export default Divider;
