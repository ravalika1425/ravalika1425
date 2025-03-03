import { Blocker } from "react-router-dom";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";

function ConfirmNavigation({ blocker }: { blocker: Blocker }) {
  if (blocker.state === "blocked") {
    return (
      <Modal isOpen={blocker.state === "blocked"} centered>
        <ModalHeader>
          <h5 className="modal-title" id="exampleModalToggleLabel">
            Brainstormer
          </h5>
        </ModalHeader>
        <ModalBody className="text-center p-5">
          <div>
            <h4>Uh oh, you are trying to leave the Brainstormer!</h4>
            <p className="text-muted"> Don't worry! All your data is safe.</p>
            <Button
              className="btn btn-warning mx-2"
              onClick={() => {
                blocker.proceed();
              }}
            >
              Okay
            </Button>
            <Button
              className="btn btn-info"
              onClick={() => {
                blocker.reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>
    );
  }

  //   if (blocker.state === "proceeding") {
  //     return (
  //       <p style={{ color: "orange" }}>Proceeding through blocked navigation</p>
  //     );
  //   }

  //   return <p style={{ color: "green" }}>Blocker is currently unblocked</p>;
}

export default ConfirmNavigation;
