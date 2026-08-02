import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    watch: {
      /* Everything under public/ is a static asset with nothing to hot-reload,
         and watching it is what kept killing the dev server: OneDrive holds a
         lock while syncing a file and the watcher dies with EBUSY. Swapping an
         image or video here needs a manual browser refresh — cheap trade for a
         server that stays up. */
      ignored: ['**/public/**'],
    },
  },
})
