import { spawn } from 'child_process'
import fs from 'fs'
import fsPromise from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url';

const processes = []

const currentDirName = path.dirname(fileURLToPath(import.meta.url))
const developmentBuildFolder = path.join(currentDirName, 'dev_build')

import.meta.url

function finishProcesses({ code = 0, callExit = true, processes = [] }) {
  console.log('finishing')

  processes.forEach((_process) => {
    if(_process) {
      _process.kill(code)
    }
  })

  try {
    if (developmentBuildFolder && fs.existsSync(developmentBuildFolder)) {
      console.log('remove folder')
      fs.rmSync(developmentBuildFolder, { recursive: true, force: true })
    }
  } catch (error) {
    console.log('Error finishing', error)
  }

  if(callExit) {
    process.exit(code)
  }
}

function createSwcWatcher({ targetFolder }) {
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
      finishProcesses({ code, processes })
    })
  })
}

function startNodemon({ filePath }) {
  return new Promise((resolve) => {
    const nodemonProcess = spawn('npx', ['nodemon', filePath])

    nodemonProcess.stdout.on('data', (data) => {
      console.log(data.toString('utf8'))
    })

    nodemonProcess.stderr.on('data', (data) => {
      console.log(data.toString('utf8'))
    })

    nodemonProcess.on('error', (error) => {
      console.log(error.message)
      finishProcesses({ code: -1, processes })
    })

    nodemonProcess.on('close', (code) => {
      console.log(`[nodemon-close] ${code}`)
      finishProcesses({ code, processes })
    })

    resolve(nodemonProcess)
  })
}

function setupProcess() {
  process.on('exit', (code) => {
    finishProcesses({ processes, callExit: false, code })
  })

  process.on('SIGTERM', (code) => {
    process.exit(code)
  })

  process.on('SIGINT', (code) => {
    process.exit(code)
  })
}

async function main() {
  try {
    setupProcess()

    const swcWatcherProcess = await createSwcWatcher({ targetFolder: './src' })
    const nodemonProcess = await startNodemon({ filePath: path.join(developmentBuildFolder, 'main.js') })

    processes.push(swcWatcherProcess, nodemonProcess)
  } catch (error) {
    console.log(error)
    finishProcesses({
      code: -1,
      processes
    })
  }
}

main()
