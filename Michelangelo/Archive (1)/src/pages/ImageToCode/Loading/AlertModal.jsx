import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
const AlertComponent = ({
  isAlertModalOpen,
  title,
  desc,
  toggleModal,
  setPreviewAllProjectModalOpen
}) => {
  return (
    <div className='page-content'>
      <Modal isOpen={isAlertModalOpen} toggle={toggleModal} centered>
        <ModalHeader className='modal-title'>{title}</ModalHeader>
        <ModalBody className='modal-body text-center p-4'>
          <div className='mt-1'>
            <p className='text-muted mb-2'>{desc}</p>
            <div className='hstack gap-2 justify-content-center m-3'>
              <Button
                color='light'
                onClick={() => {
                  toggleModal() // Close this modal
                  setPreviewAllProjectModalOpen(true) // Open the preview modal
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default AlertComponent
