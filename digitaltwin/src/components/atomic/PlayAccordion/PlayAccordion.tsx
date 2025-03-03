import React from "react"

interface PlayAccordionProps {
  children: React.ReactNode
}

const PlayAccordion: React.FC<PlayAccordionProps> = ({ children }) => {
  return <div className='play-accordion'>{children}</div>
}

export default PlayAccordion
