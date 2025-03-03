import React from "react"

interface PlayAccordionItemProps {
  title: string
  children: React.ReactNode
  expanded: boolean
  onChange: () => void
  expandIcon?: React.ReactNode // Prop for expand/collapse icon
}

const PlayAccordionItem: React.FC<PlayAccordionItemProps> = ({
  title,
  children,
  expanded,
  onChange,
  expandIcon,
}) => {
  return (
    <div className={`play-accordion-tab ${expanded ? "play-highlight" : ""}`}>
      <div className='play-accordion-header' onClick={onChange}>
        <div className='play-accordion-header-link'>
          {expandIcon}
          {title}
        </div>
      </div>
      {expanded && <div className='play-accordion-content'>{children}</div>}
    </div>
  )
}

export default PlayAccordionItem
