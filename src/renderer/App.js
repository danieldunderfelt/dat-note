import React from 'react'
import { hot } from 'react-hot-loader'
import styled, { injectGlobal } from 'styled-components'
import styledNormalize from 'styled-normalize'
import EditNote from './EditNote'
import FileManager from './FileManager'
import getFileName from '../helpers/getFileName'

injectGlobal`
  ${styledNormalize};
  
  html {
    font-family: sans-serif;
  }
`

const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
`

const Header = styled.div`
  -webkit-app-region: drag;
  user-select: none;
  width: 100%;
  height: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`

const AppBody = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: ${({ column1 }) => Math.max(column1, 80)}px ${({
      column2
    }) => Math.max(column2, 80)}px 1fr;
`

class App extends React.Component {
  state = {
    folderWidth: 300,
    notesWidth: 300,
    selectedNote: '',
    selectedFolder: 'All'
  }

  onSelectNote = selection => {
    this.setState({
      selectedNote: getFileName(selection)
    })
  }

  onSelectFolder = which => {
    this.setState({
      selectedFolder: which
    })
  }

  render() {
    const { selectedNote, selectedFolder, folderWidth, notesWidth } = this.state

    return (
      <AppWrapper>
        <Header />
        <AppBody column1={folderWidth} column2={notesWidth}>
          <FileManager
            selectedNote={selectedNote}
            selectedFolder={selectedFolder}
            onSelectNote={this.onSelectNote}
            onSelectFolder={this.onSelectFolder}
          />
          <EditNote />
        </AppBody>
      </AppWrapper>
    )
  }
}

export default hot(module)(App)
