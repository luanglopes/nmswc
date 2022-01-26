import { spawn } from 'child_process'

import { finishProcesses } from "./finishProcesses.mjs"
import { developmentBuildFolder } from './constants.mjs'

export function createSwcWatcher({ targetFolder }) {
  return new Promise((resolve, reject) => {
    let hasInitialized = false
    const swcBuildWatcher = spawn('npx', ['swc', targetFolder, '-w', '-d', developmentBuildFolder])

    swcBuildWatcher.stdout.on('data', (data) => {
      if(!hasInitialized) {
        resolve(swcBuildWatcher)
        hasInitialized = true
      }

      console.log('[swc] ', data.toString('utf8'))
    })

    swcBuildWatcher.stderr.on('data', (data) => {
      console.error('[swc-error] ', data.toString('utf8'))
    })

    swcBuildWatcher.on('error', (error) => {
      if(!hasInitialized) {
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
