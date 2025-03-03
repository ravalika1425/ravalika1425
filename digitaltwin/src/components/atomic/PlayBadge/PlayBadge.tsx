import React from "react"

type BadgeVariant = "secondary" | "success" | "info" | "warning" | "danger" | "lg" | "xl"
interface PlayBadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
}

const PlayBadge: React.FC<PlayBadgeProps> = ({ variant, children }) => {
  const className = `play-badge ${variant ? `play-badge-${variant}` : ""}`
  return <div className={className}>{children}</div>
}

export default PlayBadge
