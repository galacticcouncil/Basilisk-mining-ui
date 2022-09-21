import { MarginProps, SizeProps } from "utils/styles"
import { Link } from "components/Link/Link"
import { FC, ReactNode, SyntheticEvent } from "react"
import { SButton, SContent, SSpinner } from "./Button.styled"

export type ButtonProps = {
  variant?: "primary" | "secondary" | "gradient"
  disabled?: boolean
  text?: string
  to?: string
  type?: "button" | "submit" | "reset"
  icon?: SVGElement
  onClick?: (e: SyntheticEvent) => void
  size?: "small" | "medium" | "micro"
  fullWidth?: boolean
  isLoading?: boolean
  capitalize?: boolean
  children?: ReactNode
  className?: string
} & SizeProps &
  MarginProps

export const Button: FC<ButtonProps> = ({
  type = "button",
  variant = "secondary",
  size = "medium",
  ...props
}) => {
  const disabled = props.isLoading || props.disabled
  const element = (
    <SButton
      {...props}
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
    >
      <SContent>
        {props.isLoading && <SSpinner width={16} height={16} />}
        {props.text || props.children}
      </SContent>
    </SButton>
  )
  if (props.to) return <Link to={props.to}>{element}</Link>
  return element
}
