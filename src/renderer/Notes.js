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

const Note = styled.button`
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

const Actions = styled.div`
  display: flex;
`

const ActionButton = styled(Button)`
   flex: 1 1 auto;
`

class Notes extends Component {
  
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
              { note }
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