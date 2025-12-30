import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  server: {
    port: 5000,
  },

  plugins: [
    react(),

    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core libraries
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react-core";
          }

          // React Router
          if (id.includes("node_modules/react-router")) {
            return "react-router";
          }

          // Redux and state management
          if (
            id.includes("node_modules/@reduxjs") ||
            id.includes("node_modules/react-redux") ||
            id.includes("node_modules/redux-persist")
          ) {
            return "redux";
          }

          // Form libraries
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform") ||
            id.includes("node_modules/zod")
          ) {
            return "forms";
          }

          // Charts library (heavy dependency)
          if (
            id.includes("node_modules/apexcharts") ||
            id.includes("node_modules/react-apexcharts")
          ) {
            return "charts";
          }

          // Calendar library (heavy dependency)
          if (id.includes("node_modules/@fullcalendar")) {
            return "calendar";
          }

          // PDF library (heavy dependency)
          if (id.includes("node_modules/@react-pdf")) {
            return "pdf";
          }

          // Maps library
          if (id.includes("node_modules/@react-jvectormap")) {
            return "maps";
          }

          // Date utilities
          if (
            id.includes("node_modules/date-fns") ||
            id.includes("node_modules/flatpickr")
          ) {
            return "date-utils";
          }

          // UI utilities
          if (
            id.includes("node_modules/lucide-react") ||
            id.includes("node_modules/react-toastify") ||
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/tailwind-merge")
          ) {
            return "ui-utils";
          }

          // Drag and drop
          if (
            id.includes("node_modules/react-dnd") ||
            id.includes("node_modules/react-dropzone")
          ) {
            return "dnd";
          }

          // Other libraries
          if (
            id.includes("node_modules/swiper") ||
            id.includes("node_modules/react-helmet-async") ||
            id.includes("node_modules/react-qr-code") ||
            id.includes("node_modules/jsbarcode") ||
            id.includes("node_modules/react-to-print")
          ) {
            return "misc-libs";
          }

          // All other node_modules
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
