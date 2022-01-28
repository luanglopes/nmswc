import path from 'path'
import os from 'os'

export const developmentBuildFolder = path.join(os.tmpdir(), 'nmswc')
export const rawFilePath = process.argv[2]
export const processes = []
