import { spawn } from 'child_process'

import { finishProcesses } from './finishProcesses.mjs'
import { rawFilePath } from './constants.mjs'

export function startNodemon({ filePath }) {
  return new Promise((resolve) => {
    const nodemonProcess = spawn('npx', ['nodemon', filePath], { argv0: '' })

    nodemonProcess.stdout.on('data', (data) => {
      console.log(data.toString('utf8').replace(filePath, rawFilePath))
    })

    nodemonProcess.stderr.on('data', (data) => {
      console.log(data.toString('utf8'))
    })

    nodemonProcess.on('error', (error) => {
      console.log(error.message)
      finishProcesses({ code: -1 })
    })

    nodemonProcess.on('close', (code) => {
      console.log(`[nodemon-close] ${code}`)
      finishProcesses({ code })
    })

    resolve(nodemonProcess)
  })
}
