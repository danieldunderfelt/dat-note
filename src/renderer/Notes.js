import React, { Component } from 'react'
import is from 'styled-is'
import styled from 'styled-components'
import { remote } from "electron"
import Icon from './components/Icon'
import getPath from '../helpers/getPath'
import { Button } from './components/Button'
import smalltalk from 'smalltalk/legacy/index'
import getFileName from '../helpers/getFileName'

const NotesList = styled.div`
  background: #efefef;
  padding-top: 2.25rem;
  display: grid;
  grid-template-rows: 1fr 3rem;
`

const ListContainer = styled.div`
`

const Note = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr;
  align-items: flex-start;
  background: transparent;
  border: 0;
  padding: 0;
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
  vertical-align: baseline;
  padding: 0.5rem 0 0.5rem 0.5rem;
`

const NoteItemButton = styled(Button)`
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  text-align: left;
  display: block;
  transform-origin: left center;
`

class Notes extends Component {
  
  deleteFile = (which) => async () => {
    const { currentPath } = this.props
    const removePath = getPath(currentPath, which)
    
    try {
      await smalltalk.confirm('Delete note', 'Are you sure you want to delete this note?')
    } catch( err ) {
      console.log('Delete cancelled.')
    }
    
    const files = await remote.getGlobal('files')
    await files.fs().remove(removePath, true)
    await this.props.loadNotes()
  }
  
  createFile = async () => {
    const { currentPath } = this.props
    const name = await smalltalk.prompt('New file', 'The name of your new file')
    const parentFolder = currentPath ? currentPath : 'Uncategorized'
    const files = await remote.getGlobal('files')
    
    await files.fs().write(getPath(parentFolder, name), name)
    await this.props.loadNotes()
    await this.props.loadFolders()
  }
  
  render() {
    const { selectedNote, onSelect, notes } = this.props
    
    return (
      <NotesList>
        <ListContainer>
          { notes.map((note, idx) => (
            <Note
              onClick={ () => onSelect(note) }
              selected={ selectedNote === getFileName(note) }
              key={ `note_${idx}` }>
              <ContextButton onClick={ this.deleteFile(note) }>
                <Icon size={ 16 } name="file-minus" />
              </ContextButton>
              <NoteItemButton onClick={ () => onSelect(note) }>
                { note }
              </NoteItemButton>
            </Note>
          )) }
        </ListContainer>
        <Actions>
          <ActionButton onClick={ this.createFile }>
            <Icon size={ 25 } name="file-plus" />
          </ActionButton>
        </Actions>
      </NotesList>
    )
  }
}

export default Notes