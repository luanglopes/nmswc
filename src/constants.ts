import { ChildProcess } from 'child_process'
import crypto from 'crypto'
import os from 'os'
import path from 'path'

export const projectRoot = path.join(__dirname, '..', '..', '..', '..')
export const developmentBuildFolder = path.join(os.tmpdir(), `nmswc-${crypto.randomUUID()}`)
export const rawFilePath = process.argv[2]

export const configFilePath = path.join(projectRoot, '.nmswcrc.json')
export const nodemonConfigFilePath = path.join(projectRoot, 'nodemon.json')

export const processes: ChildProcess[] = []
