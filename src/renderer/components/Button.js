import React from 'react'
import styled, { css } from 'styled-components'

const ButtonStyle = css`
  -webkit-appearance: none;
  background: transparent;
  display: block;
  border: 0;
  padding: 0.25rem 1rem;
  cursor: pointer;
  outline: none;

  svg {
    transition: color 0.1s ease-out;
  }

  &:hover {
    
    svg {
      color: dodgerblue;
    }
  }
`

export const Button = styled.button`
  ${ButtonStyle};
`
