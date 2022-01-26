import fs from 'fs'
import path from 'path'

import { finishProcesses } from './finishProcesses.mjs';
import { developmentBuildFolder, rawFilePath, processes } from './constants.mjs';
import { setupProcess } from './setupProcess.mjs';
import { startNodemon } from './startNodemon.mjs';
import { createSwcWatcher } from './createSwcWatcher.mjs';

async function main() {
  try {
    if(!rawFilePath) {
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
    const pathPartsFromRoot = pathParts.slice(1)
    const filePathFromRoot = pathPartsFromRoot.length === 0 ? rootDir : path.join(...pathPartsFromRoot)
    const filePathToCompiledFileFromRoot = filePathFromRoot.replace('.ts', '.js')
    const fullPathToCompiledFile = path.join(developmentBuildFolder, ...filePathToCompiledFileFromRoot.split('/'))

    setupProcess()

    const swcWatcherProcess = await createSwcWatcher({ targetFolder: rootDir })
    const nodemonProcess = await startNodemon({ filePath: fullPathToCompiledFile })

    processes.push(swcWatcherProcess, nodemonProcess)
  } catch (error) {
    console.log(error)
    finishProcesses({ code: -1 })
  }
}

main()
