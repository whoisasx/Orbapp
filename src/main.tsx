import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SolanaProvider } from "./providers/SolanaProviders.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<SolanaProvider>
				<App />
			</SolanaProvider>
		</ThemeProvider>
	</StrictMode>
);
