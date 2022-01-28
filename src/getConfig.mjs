import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'

import { configFilePath, developmentBuildFolder, nodemonConfigFilePath } from './constants.mjs'

let loadedConfig = false
let _config = null

async function createConfigFile(fileName, data) {
  const pathToConfigFile = path.join(developmentBuildFolder, fileName)

  await fsPromises.writeFile(pathToConfigFile, JSON.stringify(data), { encoding: 'utf8' })

  return pathToConfigFile
}

export async function loadConfig() {
  let config = {
    nodemon: null,
    nodemonConfigFilePath,
    includeFiles: [],
  }

  if (fs.existsSync(configFilePath)) {
    const configFile = await fsPromises.readFile(configFilePath)

    const configFromFile = JSON.parse(configFile.toString('utf8'))

    config = { ...config, ...configFromFile }
  }

  if (!fs.existsSync(developmentBuildFolder)) {
    await fsPromises.mkdir(developmentBuildFolder, { recursive: true })
  }

  if (config.nodemon) {
    config.nodemonConfigFilePath = await createConfigFile('nodemon.json', config.nodemon)
    delete config.nodemon
  }

  loadedConfig = true

  _config = config
}

export function getConfig() {
  if (!loadedConfig) {
    throw new Error('Config not loaded, make sure to call loadConfig before getting it')
  }

  return _config
}
