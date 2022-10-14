import styled from "@emotion/styled"
import { css } from "@emotion/react"
import * as RadixSeparator from "@radix-ui/react-separator"
import { theme } from "theme"
import { SeparatorProps } from "./Separator"

export const SSeparator = styled(RadixSeparator.Root)<SeparatorProps>`
  background: ${(p) =>
    p.color ? theme.colors[p.color] : theme.colors.backgroundGray700};
  opacity: ${(p) => p.opacity ?? 1};
  height: ${(p) => p.size ?? 0.5}px;
  width: 100%;

  ${(p) =>
    p.orientation === "vertical" &&
    css`
      height: auto;
      width: ${p.size ?? 0.5}px;
    `}
`
