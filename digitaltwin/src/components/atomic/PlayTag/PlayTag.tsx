import React from "react"

type TagVariant = "success" | "info" | "warning" | "danger"
interface PlayTagProps {
  variant?: TagVariant
  children: React.ReactNode
  icon?: JSX.Element
}

const PlayTag: React.FC<PlayTagProps> = ({ variant, children, icon }) => {
  const className = `play-tag ${variant ? `play-tag-${variant}` : ""}`
  return (
    <div className={className}>
      {icon && <span className='play-tag-icon'>{icon}</span>}
      {children}
    </div>
  )
}

export default PlayTag
