import React, { Component } from 'react'
import styled from 'styled-components'
import { remote } from 'electron'

const FolderList = styled.div`
  background: #efefef;
  padding-top: 2.5rem;
`

class Folders extends Component {
  
  async componentDidMount() {
    const files = await remote.getGlobal('files')
    console.log(await files.fs().list())
  }
  
  render() {
    
    return (
      <FolderList>
        Folders
      </FolderList>
    )
  }
}

export default Folders