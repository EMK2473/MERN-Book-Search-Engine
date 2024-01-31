// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     open: true,
//     proxy: {
//       '/graphQL': {
//         target: 'http://localhost:3001',
//         secure: false,
//         changeOrigin: true
//       }
//     }
//   }
// })
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
     plugins: [react()],
     build: {
          base: "./", // Add this line
          outDir: "dist", // Output directory for the build.
          emptyOutDir: true, // Empty the output directory when the build starts.
     },
     server: {
          port: 3000,
          open: true,
          proxy: {
               "/graphql": {
                    target: "http://localhost:3001",
                    secure: false,
                    changeOrigin: true,
               },
          },
     },
});