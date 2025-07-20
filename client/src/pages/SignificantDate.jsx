import { useState } from "react";
import DatePicker from "../components/DatePicker";
import Button from "../components/Button";
import Divider from "../components/Divider";
import Form from "../components/Form";

function formatToday() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

const MIN_DATE = "2015-01-01";
const MAX_DATE = formatToday();

function SignificantDatePage({ onDateSelected }) {
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date) onDateSelected(date);
  };

  return (
    <Divider
      style={{
        height: "100vh",
        background: "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Welcome to Anasa</h1>
      <p style={{ marginBottom: "2rem" }}>
        Enter a significant date of your recent past to reveal your cosmic path
      </p>
      <Form onSubmit={handleSubmit}>
        <DatePicker
          date={date}
          minDate={MIN_DATE}
          maxDate={MAX_DATE}
          setDate={setDate}
        />
        <Button type="submit">Reveal</Button>
      </Form>
    </Divider>
  );
}

export default SignificantDatePage;
