import React, { Component } from 'react'
import styled from 'styled-components'
import { remote } from 'electron'
import debounce from 'lodash/debounce'

const NoteContainer = styled.div`
  padding: 1.25rem 0 0;
  display: flex;
  width: 100%;
  align-items: stretch;
  justify-content: flex-start;
`

const TextArea = styled.textarea`
  font-size: 18px;
  display: block;
  width: 100%;
  border: 0;
  outline: 0;
  padding: 1rem;
`

class EditNote extends Component {
  
  state = {
    content: '',
    isSaved: true
  }
  
  saving = false
  updating = false
  
  async componentDidMount() {
    await this.refreshContent()
  }
  
  async componentDidUpdate() {
    if( this.updating ) {
      return
    }
  
    this.updating = true
    
    await this.refreshContent()
    
    this.updating = false
  }
  
  refreshContent = async () => {
    const { currentFile } = this.props
    const { isSaved } = this.state
    
    if(!isSaved) {
      return
    }
    
    let files
    let content
    
    try {
      files = await remote.getGlobal('files')
      content = await files.fs().read(currentFile)
    } catch(err) {
      console.log(err)
      return
    }
    
    this.setState({
      content,
      isSaved: true
    })
  }
  
  saveContent = debounce(async () => {
    if( this.saving ) {
      return
    }
    
    this.saving = true
    
    const { currentFile } = this.props
    const { content } = this.state
    
    let files
    
    try {
      files = await remote.getGlobal('files')
      await files.fs().write(currentFile, content)
    } catch(err) {
      this.setState({
        isSaved: false
      })
      this.saving = false
      
      return
    }
    
    this.setState({
      isSaved: true
    })
  
    this.saving = false
  }, 300)
  
  onChange = async (e) => {
    this.setState({
      content: e.target.value,
      isSaved: false
    })
  
    await this.saveContent()
  }
  
  render() {
    const { content } = this.state
    
    return (
      <NoteContainer>
        <TextArea value={content} onChange={this.onChange} />
      </NoteContainer>
    )
  }
}

export default EditNote
