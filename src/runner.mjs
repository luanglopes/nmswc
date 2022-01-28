import fs from 'fs'
import path from 'path'

import { finishProcesses } from './finishProcesses.mjs'
import { developmentBuildFolder, rawFilePath, processes } from './constants.mjs'
import { setupProcess } from './setupProcess.mjs'
import { startNodemon } from './startNodemon.mjs'
import { createSwcWatcher } from './createSwcWatcher.mjs'
import { createSymbolicLinks } from './createSymbolicLinks.mjs'
import { loadConfig } from './getConfig.mjs'

async function main() {
  try {
    if (!rawFilePath) {
      throw new Error('File path not provided')
    }

    const normalizedFilePath = path.normalize(rawFilePath)
    let pathParts = normalizedFilePath.split('/')

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
