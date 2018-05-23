import React, { Component } from 'react'
import is from 'styled-is'
import styled from 'styled-components'
import { remote } from "electron"
import getPath from '../helpers/getPath'

const NotesList = styled.div`
  background: #efefef;
  padding-top: 2.25rem;
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

const loadNotes = async (path) => {
  const files = await remote.getGlobal('files')
  return files.fs().list(getPath(files.contentPath, path))
}

class Notes extends Component {
  state = {
    notes: []
  }
  
  async componentDidMount() {
    await this.loadNotes()
  }
  
  async componentDidUpdate() {
    await this.loadNotes()
  }
  
  loadNotes = async () => {
    const { currentPath } = this.props
    const notes = await loadNotes(currentPath)
    
    this.setState({
      notes
    })
  }
  
  render() {
    const { selectedNote, onSelect } = this.props
    const { notes } = this.state
    
    return (
      <NotesList>
        { notes.map((note, idx) => (
          <Note
            onClick={ () => onSelect(note) }
            selected={ selectedNote === note }
            key={ `note_${idx}` }>
            { note }
          </Note>
        )) }
      </NotesList>
    )
  }
}

export default Notes