import React, { useState, useEffect } from 'react'
const loadingMessages = [
  'Gathering tools for the masterpiece',
  'Drawing inspiration from the data...',
  'Sketching out some innovative ideas',
  'Pondering the perfect concept',
  'Mixing the colors of creativity...'
]
const I2CLoader: React.FC = () => {
  const [currentText, setCurrentText] = useState(0)

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % loadingMessages.length)
    }, 2000)

    return () => {
      clearInterval(textInterval)
    }
  }, [])

  return (
    <div className='loader-container' style={{ marginTop: '17%' }}>
      <h3 className='load'>Loading...</h3>
      <div className='loader'></div>
      <div className='loader-text'>{loadingMessages[currentText]}</div>
    </div>
  )
}

export default I2CLoader
