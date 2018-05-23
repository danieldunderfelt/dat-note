import React, { Component } from 'react'
import styled from 'styled-components'
import { remote } from 'electron'
import is from 'styled-is'
import { Button } from './components/Button'
import Icon from './components/Icon'
import smalltalk from 'smalltalk'

const FolderList = styled.div`
  background: #dbedef;
  padding-top: 2.25rem;
  display: grid;
  grid-template-rows: 1fr 3rem;
`

const ListContainer = styled.div`

`

const Folder = styled.div`
  background: transparent;
  border: 0;
  padding: 0;
  text-align: left;
  width: 100%;
  -webkit-appearance: none;
  font-family: 'Helvetica Neue', sans-serif;
  color: #444;
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  
  &:hover {
    background-color: #dedede;
  }
  
  ${({ withButton = true }) => withButton ? `
    display: grid;
    grid-template-columns: 2rem 1fr;
    align-items: flex-start;
  ` : ''}

  ${is('selected')`
    
    &, button {
      font-weight: bold;
    }
  `};
`

const Actions = styled.div`
  display: flex;
 
`

const ActionButton = styled(Button)`
   flex: 1 1 auto;
`

const ContextButton = styled(Button)`
  vertical-align: middle;
  padding: 0.5rem 0 0.5rem 0.5rem;
`

const FolderItemButton = styled(Button)`
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  text-align: left;
  width: 100%;
  display: block;
  transform-origin: left center;
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
  
  deleteItem = (which) => async () => {
    try {
      await smalltalk.confirm('Delete folder', 'Are you sure you want to delete this folder?')
      const files = await remote.getGlobal('files')
      await files.fs().remove(which)
      await this.loadFolders()
      
      this.props.onSelect('All')
    } catch(err) {
      console.log('Delete cancelled.')
    }
  }
  
  createFolder = async () => {
    const name = await smalltalk.prompt('Create folder', 'The name of your new folder')
    const files = await remote.getGlobal('files')
    
    await files.fs().createDir(name)
    await this.loadFolders()
    
    this.props.onSelect('All')
  }

  render() {
    const { selectedFolder, onSelect } = this.props
    const { folders } = this.state

    return (
      <FolderList>
        <ListContainer>
          <Folder
            withButton={false}
            selected={ selectedFolder === 'All' }>
            <FolderItemButton onClick={ () => onSelect('All') }>
              All
            </FolderItemButton>
          </Folder>
          { folders.map((folder, idx) => (
            <Folder
              selected={ selectedFolder === folder }
              key={ `folder_${idx}` }>
              <ContextButton onClick={this.deleteItem(folder)}>
                <Icon size={16} name="folder-minus" />
              </ContextButton>
              <FolderItemButton onClick={ () => onSelect(folder) }>
                { folder }
              </FolderItemButton>
            </Folder>
          )) }
        </ListContainer>
        <Actions>
          <ActionButton onClick={this.createFolder}>
            <Icon size={25} name="folder-plus" />
          </ActionButton>
        </Actions>
      </FolderList>
    )
  }
}

export default Folders
