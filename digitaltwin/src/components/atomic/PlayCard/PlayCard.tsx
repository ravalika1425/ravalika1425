import React from "react"

interface PlayCardProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
}

const PlayCard: React.FC<PlayCardProps> = ({ title, subtitle, children, footer }) => {
  return (
    <div className='play-card'>
      {title && <div className='play-card-title'>{title}</div>}
      {subtitle && <div className='play-card-subtitle'>{subtitle}</div>}
      <div className='play-card-body'>{children}</div>
      {footer && <div className='play-card-footer'>{footer}</div>}
    </div>
  )
}

export default PlayCard
