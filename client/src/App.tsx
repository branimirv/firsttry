import { useEffect, useState } from "react";
import "./App.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
      <Header />
      <h1 className="text-4xl">Client + Server test</h1>
      <p>Ping result: {ping ?? "fetching..."}</p>
      <Footer />
    </>
  );
}

export default App;
