import { spawn } from 'child_process'

import { finishProcesses } from './finishProcesses.mjs'
import { developmentBuildFolder, rawFilePath } from './constants.mjs'
import { formatMessage } from './formatMessage.mjs'
import fs from 'fs'
import { getConfig } from './getConfig.mjs'

export function startNodemon({ filePath, watchFolder }) {
  const config = getConfig()

  return new Promise((resolve) => {
    const command = ['nodemon', filePath, '--watch', watchFolder]

    if (config.nodemonConfigFilePath && fs.existsSync(config.nodemonConfigFilePath)) {
      command.push('--config', config.nodemonConfigFilePath)
    }

    const nodemonProcess = spawn('npx', command, {
      cwd: developmentBuildFolder,
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
