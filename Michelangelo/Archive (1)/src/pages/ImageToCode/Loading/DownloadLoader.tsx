import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
const LoadingComponent = ({ cancelRequest, title, desc }: any) => {
  return (
    <div className='page-content'>
      <Modal isOpen={true} centered>
        <ModalHeader className='modal-title'>{title}</ModalHeader>
        <ModalBody className='modal-body text-center p-5'>
          <div className='mt-4'>
            <p className='text-muted mb-4'>
              <div className='spinner-border text-primary' role='status'></div>
              <p className=''>{desc}</p>
            </p>
            <div className='hstack gap-2 justify-content-center'>
              <Button color='light' onClick={cancelRequest}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default LoadingComponent
