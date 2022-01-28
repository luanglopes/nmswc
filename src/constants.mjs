import path from 'path'
import os from 'os'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

export const projectRoot = path.join(fileURLToPath(import.meta.url), '..', '..', '..', '..')
export const developmentBuildFolder = path.join(os.tmpdir(), `nmswc-${crypto.randomUUID()}`)
export const rawFilePath = process.argv[2]

export const configFilePath = path.join(projectRoot, '.nmswcrc.json')
export const nodemonConfigFilePath = path.join(projectRoot, 'nodemon.json')

export const processes = []
