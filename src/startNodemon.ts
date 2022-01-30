import { ChildProcess, spawn } from 'child_process'
import fs from 'fs'

import { developmentBuildFolder, rawFilePath } from './constants'
import { finishProcesses } from './finishProcesses'
import { formatMessage } from './formatMessage'
import { getConfig } from './getConfig'

type StartNodemonInputDTO = {
  filePath: string
  watchFolder: string
}

export function startNodemon({ filePath, watchFolder }: StartNodemonInputDTO) {
  const config = getConfig()

  return new Promise<ChildProcess>((resolve) => {
    const command = ['nodemon', filePath, '--watch', watchFolder]

    if (config.nodemonConfigFilePath && fs.existsSync(config.nodemonConfigFilePath)) {
      command.push('--config', config.nodemonConfigFilePath)
    }

    const nodemonProcess = spawn('npx', command, {
      cwd: developmentBuildFolder,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    })

    nodemonProcess.stdout?.on('data', (data) => {
      console.log(formatMessage(data).replace(filePath, rawFilePath))
    })

    nodemonProcess.stderr?.on('data', (data) => {
      console.log(formatMessage(data))
    })

    nodemonProcess.on('error', (error) => {
      console.log(error.message)
      finishProcesses({ code: -1 })
    })

    nodemonProcess.on('close', (code) => {
      console.log(`[nodemon-close] ${code}`)
      finishProcesses({ code: code || -1 })
    })

    resolve(nodemonProcess)
  })
}
