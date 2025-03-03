import React, { useState } from "react"

import PlayBadge from "../../atomic/PlayBadge/PlayBadge"
import PlayTag from "../../atomic/PlayTag/PlayTag"
import PlayCard from "../../atomic/PlayCard/PlayCard"
import PlayAccordion from "../../atomic/PlayAccordion/PlayAccordion"
import PlayAccordionItem from "../../atomic/PlayAccordion/PlayAccordionItem"

const Demo = () => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
    panel1: true,
  })
  const handleChange = (panel: string) => {
    setExpanded((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }))
  }
  return (
    <div>
      <PlayBadge variant='success'>Success</PlayBadge>
      <PlayBadge variant='warning'>Warning</PlayBadge>
      <PlayBadge variant='lg'>Large Badge</PlayBadge>
      <PlayTag variant='success'>Success Tag</PlayTag>
      <PlayTag variant='warning'>Warning Tag</PlayTag>
      <PlayTag variant='danger'>Danger Tag</PlayTag>
      <PlayCard
        title={<h1>Card Title</h1>}
        subtitle={<h2>Card Subtitle</h2>}
        footer={<div>Card Footer</div>}
      >
        <p>This is the content of the card.</p>
      </PlayCard>
      <PlayAccordion>
        <PlayAccordionItem
          title='Section 1'
          expanded={expanded.panel1}
          onChange={() => handleChange("panel1")}
          // expandIcon={<ExpandMoreIcon />}
        >
          Content for Section 1
        </PlayAccordionItem>
        <PlayAccordionItem
          title='Section 2'
          expanded={expanded.panel2}
          onChange={() => handleChange("panel2")}
          // expandIcon={<ExpandMoreIcon />}
        >
          Content for Section 2
        </PlayAccordionItem>
        {/* Add more PlayAccordionItem as needed */}
      </PlayAccordion>
    </div>
  )
}

export default Demo
