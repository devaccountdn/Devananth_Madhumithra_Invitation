import react from '@vitejs/plugin-react'
import { createServer, defineConfig } from 'vite'
import type { Plugin } from 'vite'

const calendarFile = 'devananth-madhumithra-wedding.ics'

function invitationCalendar(): Plugin {
  return {
    name: 'invitation-calendar',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.url?.split('?')[0] !== `${server.config.base}${calendarFile}`) {
          next()
          return
        }
        try {
          const { calendarContent } = await server.ssrLoadModule('/src/App.tsx')
          response.setHeader('Content-Type', 'text/calendar; charset=utf-8')
          response.end(calendarContent)
        } catch (error) {
          next(error)
        }
      })
    },
    async generateBundle() {
      const server = await createServer({
        cacheDir: 'node_modules/.vite-calendar',
        optimizeDeps: { noDiscovery: true, include: [] },
        server: { middlewareMode: true },
        appType: 'custom',
      })
      try {
        const { calendarContent } = await server.ssrLoadModule('/src/App.tsx')
        this.emitFile({
          type: 'asset',
          fileName: calendarFile,
          source: calendarContent,
        })
      } finally {
        await server.close()
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/Devananth_Madhumithra_Invitation/',
  plugins: [react(), invitationCalendar()],
})
