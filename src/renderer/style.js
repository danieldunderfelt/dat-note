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
    height: 100%;
  }
`
