import { useEffect, useState } from "react";
import "./App.css";
import logo from "@/assets/images/logo.svg";

function App() {
  const [ping, setPing] = useState<string | null>(null);

  useEffect(() => {
    const fetchPing = async () => {
      try {
        const response = await fetch("/api/ping");
        const data = await response.json();
        setPing(JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching ping:", error);
      }
    };
    fetchPing();
  }, []);

  return (
    <>
      <img src={logo} alt="Logo" className="mb-4" />
      <h1 className="text-4xl">Client + Server test</h1>
      <p>Ping result: {ping ?? "fetching..."}</p>
    </>
  );
}

export default App;
