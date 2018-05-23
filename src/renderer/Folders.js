import React, { Component } from 'react'
import styled from 'styled-components'
import { remote } from 'electron'
import is from 'styled-is'

const FolderList = styled.div`
  background: #dbedef;
  padding-top: 2.25rem;
`

const Folder = styled.button`
  background: transparent;
  border: 0;
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  display: block;
  text-align: left;
  width: 100%;
  -webkit-appearance: none;
  font-family: 'Helvetica Neue', sans-serif;
  color: #444;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #dedede;
  }

  ${is('selected')`
    font-weight: bold;
  `};
`

class Folders extends Component {
  state = {
    folders: []
  }

  async componentDidMount() {
    await this.loadFolders()
  }

  loadFolders = async () => {
    const files = await remote.getGlobal('files')
    
    this.setState({
      folders: await files.fs().list(files.contentPath)
    })
  }

  render() {
    const { selectedFolder, onSelect } = this.props
    const { folders } = this.state

    return (
      <FolderList>
        <Folder
          selected={selectedFolder === 'All'}
          onClick={() => onSelect('All')}>
          All
        </Folder>
        {folders.map((folder, idx) => (
          <Folder
            onClick={() => onSelect(folder)}
            selected={selectedFolder === folder}
            key={`folder_${idx}`}>
            {folder}
          </Folder>
        ))}
      </FolderList>
    )
  }
}

export default Folders
