import fs from 'fs'

import { developmentBuildFolder, processes } from './constants'

type FinishProcessInputDTO = {
  code?: number
  callExit?: boolean
}

export function finishProcesses({ code = 0, callExit = true }: FinishProcessInputDTO) {
  processes.forEach((_process) => {
    if (_process) {
      _process.kill(code)
    }
  })

  try {
    if (developmentBuildFolder && fs.existsSync(developmentBuildFolder)) {
      fs.rmSync(developmentBuildFolder, { recursive: true, force: true })
    }
  } catch (error) {
    console.log('Error finishing', error)
  }

  if (callExit) {
    process.exit(code)
  }
}
