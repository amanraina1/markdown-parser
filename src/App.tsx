import { useState, useCallback } from "react";
import Toolbar from "./components/Toolbar";
import "./App.css";

const DEFAULT_CONTENT = `hello`;

function App() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_CONTENT);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return <Toolbar />;
}

export default App;
