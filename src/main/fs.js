import * as paths from './paths'
import fs from 'fs-extra'

const promisify = (func, errFirst = true) => async (...args) => new Promise((resolve, reject) => {
  func(...args, (err, result) => {
    if(errFirst && err) {
      return reject(err)
    }
    
    if(!errFirst) {
      return resolve(err)
    }
    
    resolve(result)
  })
})

const getDefaultSettings = async () => {
  if(await fs.exists(paths.DEFAULT_SETTINGS_FILE)) {
    return fs.readJson(paths.DEFAULT_SETTINGS_FILE)
  }
  
  return {}
}

export default async archive => {
  const stat = promisify(archive.stat.bind(archive))
  const mkdir = promisify(archive.mkdir.bind(archive))
  const readdir = promisify(archive.readdir.bind(archive))
  const writeFile = promisify(archive.writeFile.bind(archive))
  const readFile = promisify(archive.readFile.bind(archive))
  const unlink = promisify(archive.unlink.bind(archive))
  
  // Write settings and file storage paths in archive
  async function init() {
    try {
      await stat(paths.V_SETTINGS_FILE)
    } catch(err) {
      const defaultSettings = await getDefaultSettings()
      await writeFile(paths.V_SETTINGS_FILE, JSON.stringify(defaultSettings))
    }
    
    try {
      await readdir(paths.V_FILES_PATH)
    } catch(err) {
      await mkdir(paths.V_FILES_PATH)
    }
  }
  
  async function list(path = paths.V_FILES_PATH) {
    return readdir(path)
  }
  
  async function write(filePath, content) {
    return writeFile(paths.V_FILES_PATH + '/' + filePath, content)
  }
  
  async function read(filePath, encoding = 'utf-8') {
    return readFile(paths.V_FILES_PATH + '/' + filePath, encoding)
  }
  
  async function remove(filePath) {
    return unlink(filePath)
  }
  
  async function set(key, value) {
  
  }
  
  async function get(key) {
  
  }
  
  await init()
  
  return {
    list,
    write,
    read,
    unlink,
    get,
    set
  }
}