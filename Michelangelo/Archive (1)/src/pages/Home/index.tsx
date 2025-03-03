import { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Content from "./Content";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
 useEffect(() => {
  document.documentElement.setAttribute('data-sidebar-size', 'sm')
 }, [])
 
  return (
    <>
      <Content
        heading="Whats on your mind today?"
        textFieldPlaceholder="Generate a website for company"
        generateButtonText="Generate"
      />
      <Modal isOpen={modalOpen} centered>
        <ModalHeader>
          <h5 className="modal-title" id="exampleModalToggleLabel">
            Redirect notice
          </h5>
        </ModalHeader>

          <ModalBody className="text-center p-5">
          <div>
            <p className="text-muted" style={{ textAlign: 'left', marginBottom: '20px' }}>
              You are currently viewing the dev environment. Features might break since it's under constant changes. For a stable version of MLO go to <a href="https://angelo-qa.avateam.io" target="_blank" rel="noopener noreferrer">angelo-qa.avateam.io</a>.
            </p>
            <div style={{ textAlign: 'center', paddingTop: '20px' }}>
            
            <button type="button" className="btn btn-primary waves-effect waves-light" style={{ marginRight: '10px' }}
                onClick={() => {
                  window.location.href = "https://angelo-qa.avateam.io";
                }}> Stable Version </button>
            <button type="button" className="btn btn-secondary waves-effect waves-light" onClick={toggleModal}>Cancel</button>
        
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Home;
