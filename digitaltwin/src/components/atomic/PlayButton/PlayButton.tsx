import React from "react"

type ButtonVariant =
  | "secondary"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "help"
  | "danger"
  | "contrast"
  | "link"
type ButtonSize = "sm" | "lg"
type ButtonType = "outlined" | "plain" | "text"
type IconPosition = "left" | "right" | "top" | "bottom"
type SpeedDialDirection = "up" | "down" | "left" | "right"
type Shape = "circle" | "semi-circle" | "quarter-circle"

interface PlayButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: ButtonType
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: IconPosition
  children?: React.ReactNode
  onClick?: () => void
  speedDial?: boolean
  speedDialDirection?: SpeedDialDirection
  shape?: Shape
  splitButton?: boolean
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  variant,
  size,
  type,
  disabled = false,
  loading = false,
  icon,
  iconPosition,
  children,
  onClick,
  speedDial,
  speedDialDirection,
  shape,
  splitButton,
  ...rest
}) => {
  const baseClass = "play-button"
  let classes = baseClass

  if (variant) classes += ` ${baseClass}-${variant}`
  if (size) classes += ` ${baseClass}-${size}`
  if (type) classes += ` ${baseClass}-${type}`
  if (loading) classes += ` ${baseClass}-loading`
  if (icon && iconPosition) classes += ` ${baseClass}-icon-${iconPosition}`

  if (speedDial) {
    classes += ` play-speeddial-button`
    if (speedDialDirection) classes += ` play-speeddial-direction-${speedDialDirection}`
    if (shape) classes += ` play-speeddial-${shape}`
  }

  if (splitButton) {
    classes = `play-splitbutton ${classes}`
  }

  return (
    <button className={classes} disabled={disabled || loading} onClick={onClick} {...rest}>
      {icon && iconPosition === "left" && <span className='play-button-icon-left'>{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className='play-button-icon-right'>{icon}</span>}
      {loading && <span className='play-button-loading-icon'>Loading...</span>}
    </button>
  )
}
