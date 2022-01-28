import { spawn } from 'child_process'

import { finishProcesses } from './finishProcesses.mjs'
import { developmentBuildFolder, rawFilePath } from './constants.mjs'
import { formatMessage } from './formatMessage.mjs'

export function startNodemon({ filePath }) {
  return new Promise((resolve) => {
    const nodemonProcess = spawn('node', ['./node_modules/.bin/nodemon', filePath, '--watch', developmentBuildFolder], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    })

    nodemonProcess.stdout.on('data', (data) => {
      console.log(formatMessage(data).replace(filePath, rawFilePath))
    })

    nodemonProcess.stderr.on('data', (data) => {
      console.log(formatMessage(data))
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
