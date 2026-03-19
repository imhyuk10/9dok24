import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;

try {
  createRoot(root).render(<App />);
} catch (e) {
  root.innerHTML = `<pre style="color:red;padding:20px">${e}\n${(e as Error).stack}</pre>`;
}
