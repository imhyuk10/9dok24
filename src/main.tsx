import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 브라우저에서 dev 서버를 직접 열었을 때만 UI 확인용 목 설치
if (import.meta.env.DEV && !window.electronAPI) {
  const { installDevMock } = await import("./lib/dev-mock");
  installDevMock();
}

const root = document.getElementById("root")!;

try {
  createRoot(root).render(<App />);
} catch (e) {
  root.innerHTML = `<pre style="color:red;padding:20px">${e}\n${(e as Error).stack}</pre>`;
}
