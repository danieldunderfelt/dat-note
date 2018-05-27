import { injectGlobal } from 'styled-components'

injectGlobal`
  * {
    box-sizing: border-box;
  }

  html {
    height: 100%;
    -webkit-font-smoothing: antialiased;
  }

  body {
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 100%;
  }
  
  #app {
    width: 100%;
  }
`
