import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 5173,
		proxy: {
			"/api": {
				target: "http://13.234.29.166:8080",
				changeOrigin: true,
				secure: false,
				ws: true,
				pathRewrite: {
					"^/api": "", // Remove the '/api' prefix from the URL before forwarding
				},
			},
		},
	},
});
