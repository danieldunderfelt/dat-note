import React, { Component } from 'react'
import Folders from './Folders'
import Notes from './Notes'

class FileManager extends Component {
  state = {
    selectedFolder: 'All'
  }

  onSelectFolder = which => {
    this.setState({
      selectedFolder: which
    })
  }

  currentPath = () => {
    const { selectedFolder } = this.state

    if (selectedFolder === 'All') {
      return ''
    }

    return selectedFolder
  }

  render() {
    const { selectedFolder } = this.state
    const { selectedNote, onSelectNote } = this.props

    return (
      <>
        <Folders
          selectedFolder={selectedFolder}
          onSelect={this.onSelectFolder}
        />
        <Notes
          currentPath={this.currentPath()}
          selectedNote={selectedNote}
          onSelect={onSelectNote}
        />
      </>
    )
  }
}

export default FileManager
