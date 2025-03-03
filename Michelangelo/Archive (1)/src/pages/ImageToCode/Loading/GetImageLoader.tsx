import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
const LoadingComponent = ({ cancelRequest }: any) => {
  return (
    <div className="page-content">
      <Modal isOpen={true} centered>
        <ModalHeader className="modal-title">Loading Image</ModalHeader>
        <ModalBody className="modal-body text-center p-5">
          <div className="mt-4">
            <p className="text-muted mb-4">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="">Please Wait...</p>
            </p>
            <div className="hstack gap-2 justify-content-center">
              <Button
                color="light"
                onClick={() => {
                  cancelRequest();
                  console.log("cancel clicked");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default LoadingComponent;
