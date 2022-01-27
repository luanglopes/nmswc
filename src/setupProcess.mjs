import { finishProcesses } from './finishProcesses.mjs'

export function setupProcess() {
  process.on('exit', (code) => {
    finishProcesses({ callExit: false, code })
  })

  process.on('SIGTERM', (code) => {
    process.exit(code)
  })

  process.on('SIGINT', (code) => {
    process.exit(code)
  })
}
