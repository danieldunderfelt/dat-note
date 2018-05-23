import React from 'react'
import styled from 'styled-components'
import feather from 'feather-icons'
import get from 'lodash/get'

const Icon = styled.i``

export default ({ name, size = 20, className, color = '#444' }) => {
  const icon = get(feather, `icons.${name}`, false)
  
  return icon ? (
    <Icon
      className={className}
      dangerouslySetInnerHTML={{
        __html: icon.toSvg({ color, width: size, height: size })
      }}
    />
  ) : null
}
