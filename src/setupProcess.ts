import { finishProcesses } from './finishProcesses'

export function setupProcess() {
  process.on('exit', (code) => {
    finishProcesses({ callExit: false, code })
  })

  process.on('SIGTERM', () => {
    process.exit(0)
  })

  process.on('SIGINT', () => {
    process.exit(0)
  })
}
