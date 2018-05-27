import React, { Component } from 'react'
import Folders from './Folders'
import Notes from './Notes'
import getPath from '../helpers/getPath'
import { remote } from 'electron'

async function loadNotes(path) {
  const files = await remote.getGlobal('files')
  const fs = files.fs()

  if (!path) {
    return fs.listAllFiles()
  }

  return fs.list(getPath(files.contentPath, path), 'f')
}

async function loadFolders() {
  const files = await remote.getGlobal('files')
  return files.fs().list(files.contentPath, 'd')
}

class FileManager extends Component {
  state = {
    folders: [],
    notes: []
  }

  loadingFolders = false
  loadingNotes = false
  updating = false
  
  async componentDidMount() {
    await this.loadFolders()
    await this.loadNotes()
  }

  async componentDidUpdate() {
    if(this.updating) {
      return
    }
    
    this.updating = true
    
    await this.loadFolders()
    await this.loadNotes()
    
    this.updating = false
  }

  loadNotes = async () => {
    if (this.loadingNotes) {
      return
    }

    this.loadingNotes = true
    const notes = await loadNotes(this.currentPath())

    this.setState({
      notes
    })

    this.loadingNotes = false
  }

  loadFolders = async () => {
    if (this.loadingFolders) {
      return
    }

    this.loadingFolders = true

    this.setState({
      folders: await loadFolders()
    })

    this.loadingFolders = false
  }

  currentPath = () => {
    const { selectedFolder } = this.props

    if (selectedFolder === 'All') {
      return ''
    }

    return selectedFolder
  }

  render() {
    const {
      selectedFolder,
      selectedNote,
      onSelectNote,
      onSelectFolder
    } = this.props
    
    const { notes, folders } = this.state

    return (
      <>
        <Folders
          folders={folders}
          loadNotes={this.loadNotes}
          loadFolders={this.loadFolders}
          selectedFolder={selectedFolder}
          onSelect={onSelectFolder}
        />
        <Notes
          notes={notes}
          loadNotes={this.loadNotes}
          loadFolders={this.loadFolders}
          currentPath={this.currentPath()}
          selectedNote={selectedNote}
          onSelect={onSelectNote}
        />
      </>
    )
  }
}

export default FileManager
