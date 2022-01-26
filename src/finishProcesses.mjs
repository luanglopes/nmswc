import fs from 'fs'

import { developmentBuildFolder, processes } from './constants.mjs'

export function finishProcesses({ code = 0, callExit = true }) {
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
