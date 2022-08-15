import { ColorProps, FontProps, MarginProps } from "common/styles"
import { FC } from "react"
import { StyledText } from "./Text.styled"

export type TextProps = {
  children?: string | number
  text?: string | number
} & ColorProps &
  MarginProps &
  FontProps

export const Text: FC<TextProps> = ({
  children,
  text,
  fw = 500,
  fs = 16,
  color = "neutralGray100",
  ...rest
}) => (
  <StyledText {...rest} fw={fw} fs={fs} color={color}>
    {text || children}
  </StyledText>
)
