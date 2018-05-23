import React from 'react'
import styled, { css } from 'styled-components'

const ButtonStyle = css`
  -webkit-appearance: none;
  background: transparent;
  display: block;
  border: 0;
  padding: 0.25rem 1rem;
  cursor: pointer;
  transition: transform 0.1s ease-out;
  outline: none;

  svg {
    transition: color 0.2s ease-out;
  }

  &:hover {
    transform: scale(1.1);
    
    svg {
      color: dodgerblue;
    }
  }
`

export const Button = styled.button`
  ${ButtonStyle};
`
