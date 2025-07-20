function Form({ onSubmit = {}, children, style = {}, className = "" }) {
  return (
    <form onSubmit={onSubmit} style={style} className={className}>
      {children}
    </form>
  );
}

export default Form;
