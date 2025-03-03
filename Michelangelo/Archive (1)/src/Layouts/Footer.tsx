import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'reactstrap'

const Footer = (props: { style?: React.CSSProperties }) => {
  const [, setShowFooter] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      setShowFooter(scrolledToBottom)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const footerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0
  }

  return (
    <footer className='footer' style={{ ...footerStyle, ...props.style }}>
      <Container fluid>
        <Row>
          <Col sm={6}>{new Date().getFullYear()} © Ascendion.</Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
