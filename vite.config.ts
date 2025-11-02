import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), nodePolyfills(), tailwindcss()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: undefined,
			},
		},
		target: "esnext",
		minify: "esbuild",
	},
	optimizeDeps: {
		include: ["react", "react-dom"],
	},
	define: {
		global: "globalThis",
	},
});
