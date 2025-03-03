import {
  Box,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'


const steps = ['Initializing', 'Processing', 'Analyzing', 'Finalizing']

interface GenerationLoaderProps {
  cancelRequest: () => void
  isLoading: boolean
}

const GenerationLoader: React.FC<GenerationLoaderProps> = ({
  cancelRequest,
  isLoading
}) => {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined
    if (isLoading) {
      timer = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= 100) {
            clearInterval(timer)
            return 100
          }
          const newProgress = prevProgress + 100 / 180
          setActiveStep(Math.floor(newProgress / 25))
          return newProgress
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isLoading])

  return (
    <div className='page-content'>
      <Modal isOpen={isLoading} centered>
        <ModalHeader className='modal-title'>
          Generating Your Design
        </ModalHeader>
        <ModalBody className='modal-body text-center p-5'>
          <div className='mt-4'>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                sx={{
                  width: '100px',
                  height: '100px'
                }}
                variant='determinate'
                value={progress}
              />
              <Box
                sx={{
                  top: 54,
                  left: 0,
                  bottom: 0,
                  right: 10,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant='body2' color='text.secondary'>
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
            <p className='text-muted mb-4 mt-3'>Please Wait...</p>
            <div className='hstack gap-2 justify-content-center'>
              <Button
                color='light'
                onClick={() => {
                  cancelRequest()
                  console.log('cancel clicked')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default GenerationLoader
