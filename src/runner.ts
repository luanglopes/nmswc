import fs from 'fs'
import path from 'path'

import { developmentBuildFolder, processes, rawFilePath } from './constants'
import { createSwcWatcher } from './createSwcWatcher'
import { createSymbolicLinks } from './createSymbolicLinks'
import { finishProcesses } from './finishProcesses'
import { loadConfig } from './getConfig'
import { setupProcess } from './setupProcess'
import { startNodemon } from './startNodemon'

async function main() {
  try {
    if (!rawFilePath) {
      throw new Error('File path not provided')
    }

    const normalizedFilePath = path.normalize(rawFilePath)
    const pathParts = normalizedFilePath.split('/')

    if (!fs.existsSync(normalizedFilePath)) {
      throw new Error(`File "${rawFilePath}" not found. If it is a directory make sure you have a index.ts file on it.`)
    }

    if (fs.statSync(normalizedFilePath).isDirectory()) {
      pathParts.push('index.ts')
    }

    const rootDir = pathParts[0]
    const sanitizedFilePath = path.join(...pathParts)
    const filePathToCompiledFileFromDevBuildFolder = sanitizedFilePath.replace('.ts', '.js')

    setupProcess()
    await loadConfig()

    const targetFolder = path.join(developmentBuildFolder, rootDir)
    const swcWatcherProcess = await createSwcWatcher({ sourceFolder: rootDir, targetFolder })
    await createSymbolicLinks()
    const nodemonProcess = await startNodemon({
      filePath: filePathToCompiledFileFromDevBuildFolder,
      watchFolder: rootDir,
    })

    processes.push(swcWatcherProcess, nodemonProcess)
  } catch (error) {
    console.log(error)
    finishProcesses({ code: -1 })
  }
}

main()
