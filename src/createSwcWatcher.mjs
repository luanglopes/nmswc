import { spawn } from 'child_process'
import { projectRoot } from './constants.mjs'

import { finishProcesses } from './finishProcesses.mjs'
import { formatMessage } from './formatMessage.mjs'

export function createSwcWatcher({ sourceFolder, targetFolder }) {
  return new Promise((resolve, reject) => {
    let hasInitialized = false
    const command = ['swc', sourceFolder, '-w', '-d', targetFolder]

    const swcBuildWatcher = spawn('npx', command, {
      cwd: projectRoot,
    })

    swcBuildWatcher.stdout.on('data', (data) => {
      if (!hasInitialized) {
        resolve(swcBuildWatcher)
        hasInitialized = true
      }

      console.log('[swc] ', formatMessage(data))
    })

    swcBuildWatcher.stderr.on('data', (data) => {
      console.error('[swc-error] ', formatMessage(data))
    })

    swcBuildWatcher.on('error', (error) => {
      if (!hasInitialized) {
        reject(error)
        hasInitialized = true
      }

      console.error('[swc-error] ', error.message)
    })

    swcBuildWatcher.on('close', (code) => {
      console.log('[swc-close] ', code)
      finishProcesses({ code })
    })
  })
}
