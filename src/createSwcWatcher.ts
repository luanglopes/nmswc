import { ChildProcessWithoutNullStreams, spawn } from 'child_process'

import { projectRoot } from './constants'
import { finishProcesses } from './finishProcesses'
import { formatMessage } from './formatMessage'

type CreateSwcWatcherInputDTO = {
  sourceFolder: string
  targetFolder: string
}

export function createSwcWatcher({ sourceFolder, targetFolder }: CreateSwcWatcherInputDTO) {
  return new Promise<ChildProcessWithoutNullStreams>((resolve, reject) => {
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
      finishProcesses({ code: code || -1 })
    })
  })
}
