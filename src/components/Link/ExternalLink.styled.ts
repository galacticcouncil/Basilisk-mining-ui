import styled from "styled-components"
import { colors } from "common/styles"

export const SExternalLink = styled.a`
  text-decoration: underline;
  text-underline-offset: 3px;
  ${colors}
`

export const SExternalLinkAdornment = styled.span`
  position: relative;

  svg {
    position: absolute;
    bottom: 2px;
    right: 0;
  }
`
