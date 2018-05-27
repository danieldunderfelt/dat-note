import * as paths from './paths'
import fs from 'fs-extra'
import pFilter from 'p-filter'
import pMap from 'p-map'
import flatten from 'lodash/flatten'
import getPath from '../helpers/getPath'

const promisify = (func, errFirst = true) => async (...args) =>
  new Promise((resolve, reject) => {
    func(...args, (err, result) => {
      if (errFirst && err) {
        return reject(err)
      }

      if (!errFirst) {
        return resolve(err)
      }

      resolve(result)
    })
  })

async function getDefaultSettings() {
  if (await fs.exists(paths.DEFAULT_SETTINGS_FILE)) {
    return fs.readJson(paths.DEFAULT_SETTINGS_FILE)
  }

  return {}
}

export default async archive => {
  const stat = promisify(archive.stat.bind(archive))
  const mkdir = promisify(archive.mkdir.bind(archive))
  const rmdir = promisify(archive.rmdir.bind(archive))
  const readdir = promisify(archive.readdir.bind(archive))
  const writeFile = promisify(archive.writeFile.bind(archive))
  const readFile = promisify(archive.readFile.bind(archive))
  const unlink = promisify(archive.unlink.bind(archive))

  async function filterByType(path, type) {
    let statResult
    try {
      statResult = await stat(path)
    } catch (err) {
      return false
    }

    return (
      (type === 'd' && statResult.isDirectory()) ||
      (type === 'f' && statResult.isFile())
    )
  }

  // Write settings and file storage paths in archive
  async function init() {
    try {
      await stat(paths.V_SETTINGS_FILE)
    } catch (err) {
      const defaultSettings = await getDefaultSettings()
      await writeFile(paths.V_SETTINGS_FILE, JSON.stringify(defaultSettings))
    }

    try {
      await readdir(paths.V_FILES_PATH)
    } catch (err) {
      await mkdir(paths.V_FILES_PATH)
    }
  }

  async function list(path = paths.V_FILES_PATH, type = 'all') {
    const entries = await readdir(path)

    if (type === 'all') {
      return entries
    }

    return pFilter(entries, entry => filterByType(getPath(path, entry), type))
  }

  async function listAllFiles() {
    const folders = await list(paths.V_FILES_PATH, 'd')

    const files = await pMap(folders, async folder =>
      list(getPath(paths.V_FILES_PATH, folder), 'f').then(filesInFolder =>
        filesInFolder.map(file => `${folder}/${file}`)
      )
    )

    return flatten(files)
  }

  async function write(filePath, content) {
    return writeFile(getPath(paths.V_FILES_PATH, filePath), content)
  }

  async function read(filePath, encoding = 'utf-8') {
    return readFile(getPath(paths.V_FILES_PATH, filePath), encoding)
  }

  async function remove(filePath) {
    return unlink(getPath(paths.V_FILES_PATH, filePath))
  }
  
  async function removeDir(dirPath, recursive = false) {
    const fullPath = getPath(paths.V_FILES_PATH, dirPath)
    
    try {
      // Try removing
      await rmdir(fullPath)
    } catch(err) {
      // Else, if recursive, delete content
      if(recursive) {
        const contents = await list(fullPath)
        await pMap(contents, file => unlink(getPath(fullPath, file)))
        
        // Then try removing again
        await rmdir(fullPath)
      }
    }
  }

  async function set(key, value) {}

  async function get(key) {}

  async function createDir(name) {
    return mkdir(getPath(paths.V_FILES_PATH, name))
  }

  await init()

  return {
    list,
    write,
    read,
    remove,
    removeDir,
    createDir,
    listAllFiles,
    get,
    set
  }
}
