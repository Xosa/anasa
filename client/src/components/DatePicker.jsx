function DatePicker({ date, minDate, maxDate, setDate }) {
  return (
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      min={minDate}
      max={maxDate}
      required
      style={{
        padding: "0.5rem",
        fontSize: "1rem",
        borderRadius: "4px",
        marginRight: "1rem",
      }}
    />
  );
}

export default DatePicker;
