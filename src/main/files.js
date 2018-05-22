import nodeFs from 'fs-extra'
import fsInterface from './fs'
import hyperdrive from 'hyperdrive'
import swarm from 'hyperdiscovery'
import rimraf from 'rimraf'
import * as paths from './paths'

export default async () => {
  
  let archive = await createFileSystem()
  let sw = await createSwarm(archive)
  let fs = await fsInterface(archive)
  
  async function createFileSystem(key) {
    await nodeFs.ensureDir(paths.STORAGE_PATH)
    
    const archive = hyperdrive(paths.STORAGE_PATH, key)
    
    await new Promise(resolve => {
      archive.on('ready', resolve)
    })
    
    return archive
  }
  
  async function reCreateFileSystem(key) {
    if( await nodeFs.stat(paths.STORAGE_PATH) ) {
      rimraf.sync(path)
    }
    
    return createFileSystem(key)
  }
  
  async function createSwarm(archive) {
    const sw = swarm(archive, { live: true, download: true, upload: true })
  
    sw.on('connection', (peer) => {
      console.log('connected to', sw.connections.length, 'peers')
      peer.on('close', function() {
        console.log('peer disconnected')
      })
    })
  
    return sw
  }
  
  async function sync(key) {
    if( key === archive.key.toString('hex') ) {
      throw 'DB already synced.'
    }
  
    archive = await reCreateFileSystem(key)
    sw = await createSwarm(archive)
    fs = fsInterface(archive)
  }
  
  return {
    fs: () => fs,
    sync
  }
}