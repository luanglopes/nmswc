import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'

import { developmentBuildFolder, projectRoot } from './constants'
import { getConfig } from './getConfig'

const defaultIncludedFiles = ['package.json', 'node_modules']

function isFileLinkable(filePath: string) {
  if (defaultIncludedFiles.includes(filePath)) {
    return false
  }

  if (filePath.includes('*')) {
    return false
  }

  if (!fs.existsSync(path.join(projectRoot, ...filePath.split('/')))) {
    return false
  }

  return true
}

export async function createSymbolicLinks() {
  const config = getConfig()

  const filesToInclude = config.includeFiles
    .map((filePath) => path.normalize(filePath))
    .filter((filePath) => isFileLinkable(filePath))

  filesToInclude.push(...defaultIncludedFiles)

  await Promise.all(
    filesToInclude.map(async (filePath) => {
      const destination = path.join(developmentBuildFolder, ...filePath.split('/'))
      const absoluteSource = path.join(projectRoot, filePath)

      await fsPromises.symlink(absoluteSource, destination)
    }),
  )
}
