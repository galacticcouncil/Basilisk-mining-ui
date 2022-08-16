import styled, { css } from "styled-components/macro"
import * as RadixSeparator from "@radix-ui/react-separator"
import { margins } from "common/styles"
import { theme } from "theme"
import { SeparatorProps } from "./Separator"

export const StyledSeparator = styled(RadixSeparator.Root)<SeparatorProps>`
  background: ${(p) => p.color ?? theme.colors.backgroundGray700};
  opacity: ${(p) => p.opacity ?? 1};
  height: ${(p) => p.size ?? 1}px;
  width: 100%;

  ${(p) =>
    p.orientation === "vertical" &&
    css`
      height: auto;
      width: ${p.size ?? 1}px;
    `}
  ${margins};
`