import path from 'path'
import { fileURLToPath } from 'url'

export const currentDirName = path.dirname(fileURLToPath(import.meta.url))
export const developmentBuildFolder = path.join(currentDirName, '..', 'dev_build')
export const rawFilePath = process.argv[2]
export const processes = []
