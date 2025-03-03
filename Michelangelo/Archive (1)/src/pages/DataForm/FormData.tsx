import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input, Table, Spinner } from "reactstrap";
import { AxiosError } from "axios";
import { axiosInstance } from "Mike/utils/axiosConfig";
import { useMsal } from "@azure/msal-react";
import { createDesignSystem, DeleteDesignSystem, fetchDesignSystem, updateDesignSystem } from "services/brainStormerServices";

interface DesignSystemPayload {
  Type: string;
  Component: string;
  Description: string;
  Code: string;
  Domain: string;
  "Design System"?: string;
  _id?: string;
  userSignature?:string;
}

const FormDb = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    component: '',
    description: '',
    code: '',
    domain: '',
    designSystem: ''
  });
  const [submittedData, setSubmittedData] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  const { accounts } = useMsal();

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.type || !formData.component || !formData.description || !formData.code || !formData.domain || !formData.designSystem) {
      console.error("All fields are required.");
      return;
    }

    const payload: DesignSystemPayload = {
      userSignature : accounts[0].username,
      Type: formData.type,
      Component: formData.component,
      Description: formData.description,
      Code: formData.code,
      Domain: formData.domain,
      "Design System": formData.designSystem,
    };

    if (editIndex !== null) {
      payload._id = submittedData[editIndex]._id;
    }

    setLoading(true);
    setLoadingMessage(editIndex !== null ? "Updating data, please wait..." : "Submitting data, please wait...");
    setModalOpen(false);

    try {
      console.log("Payload being sent to the API:", payload);

      if (editIndex !== null) {
        // const response = await axiosInstance.put(
        //   `https://michelangelomiddleware-fqc9a3c0f4d4afgs.eastus-01.azurewebsites.net/api/v1/design_system/${payload._id}`,
        //   payload
        // );
        const response =await  updateDesignSystem(payload._id);
        console.log("API Response (Update):", response.data);
        const updatedData = [...submittedData];
        updatedData[editIndex] = response.data;
        setSubmittedData(updatedData);
      } else {
        // const response = await axiosInstance.post(
        //   "https://michelangelomiddleware-fqc9a3c0f4d4afgs.eastus-01.azurewebsites.net/api/v1/design_system/",
        //   payload
        // );
        const response = await createDesignSystem(payload);
        console.log("API Response (Create):", response.data);
        setSubmittedData([...submittedData, response.data]);
      }

      setFormData({
        type: '',
        component: '',
        description: '',
        code: '',
        domain: '',
        designSystem: ''
      });
      setEditIndex(null);
      setCurrentPage(1); // Reset to the first page
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error submitting form:", error.response?.data || error.message);

        if (error.response?.data?.detail) {
          console.error("Validation Error Details:", error.response.data.detail);
          error.response.data.detail.forEach((issue: any) => {
            console.error(`Field: ${issue.loc} - Error: ${issue.msg}`);
          });
        }
      } else {
        console.error("Error submitting form:", error);
      }
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (index: number) => {
    const item = submittedData[index];
    setFormData({
      type: item.Type,
      component: item.Component,
      description: item.Description,
      code: item.Code,
      domain: item.Domain,
      designSystem: item["Design System"]
    });
    setEditIndex(index);
    setModalOpen(true);
  };

  const confirmDelete = (index: number) => {
    setDeleteIndex(index);
    toggleDeleteModal();
  };

  const handleDelete = async () => {
    if (deleteIndex !== null) {
      setLoading(true);
      setLoadingMessage("Deleting data, please wait...");
      toggleDeleteModal();

      try {
        const itemId = submittedData[deleteIndex]._id;
        // await axiosInstance.delete(
        //   `https://michelangelomiddleware-fqc9a3c0f4d4afgs.eastus-01.azurewebsites.net/api/v1/design_system/${itemId}`,
        // );
        await DeleteDesignSystem(itemId);
        setSubmittedData(submittedData.filter((_, i) => i !== deleteIndex));
        setDeleteIndex(null);
      } catch (error) {
        console.error("Error deleting data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingMessage("Fetching data, please wait...");
      try {
        // const response = await axiosInstance.get(
        //   "https://michelangelomiddleware-fqc9a3c0f4d4afgs.eastus-01.azurewebsites.net/api/v1/design_system/"
        // );
        const response = await fetchDesignSystem();
        console.log("API Response:", response.data);
        setSubmittedData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = submittedData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(submittedData.length / rowsPerPage);
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div style={{ position: 'relative', top: '80px', margin: '0 20px', width: 'calc(100% - 10px)' }}>
        <Button color="primary" onClick={toggleModal}>
          + Add
        </Button>
        <div style={{ overflowX: 'hidden', marginTop: '15px' }}>
          {loading ? (
            <div className="text-center my-4">
              <Spinner color="primary" />
              <p>{loadingMessage}</p>
            </div>
          ) : (
            <>
              <Table striped bordered hover className="mt-4" style={{ width: '100%', marginBottom: '100px', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ minWidth: '100px' }}>Type</th>
                    <th style={{ minWidth: '150px' }}>Component</th>
                    <th style={{ minWidth: '200px' }}>Description</th>
                    <th style={{ minWidth: '100px' }}>Code</th>
                    <th style={{ minWidth: '150px' }}>Domain</th>
                    <th style={{ minWidth: '150px' }}>Design System</th>
                    <th style={{ minWidth: '150px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((data, index) => (
                    <tr key={data._id || index}>
                      <td>{data.Type}</td>
                      <td>{data.Component}</td>
                      <td>{data.Description}</td>
                      <td>{data.Code}</td>
                      <td>{data.Domain}</td>
                      <td>{data["Design System"]}</td>
                      <td>
                        <Button color="warning" size="sm" onClick={() => handleEdit(indexOfFirstRow + index)}>
                          Edit
                        </Button>
                        <Button color="danger" size="sm" onClick={() => confirmDelete(indexOfFirstRow + index)} style={{ marginLeft: '8px' }}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <div
                  className="pagination-controls"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    marginLeft: '700px',
                    marginTop: '20px',
                    // position:'absolute',./


                  }}
                >
                  <Button disabled={currentPage === 1} onClick={handlePrevPage} style={{ background: 'primary' }}>
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      color={i + 1 === currentPage ? "primary" : "secondary"}
                      onClick={() => goToPage(i + 1)}
                      style={{ marginLeft: '8px' }}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                    style={{ marginLeft: '8px', background: 'secondary' }}
                  >
                    Next
                  </Button>
                </div>



              </Table>

            </>
          )}
        </div>
      </div>
      <Modal isOpen={modalOpen} centered toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          <h5 className="modal-title" id="exampleModalToggleLabel">
            {editIndex !== null ? "Update Form" : "Form Submission"}
          </h5>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="type">Type</Label>
              <Input
                type="text"
                name="type"
                id="type"
                placeholder="Enter type"
                value={formData.type}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="component">Component</Label>
              <Input
                type="text"
                name="component"
                id="component"
                placeholder="Enter component"
                value={formData.component}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                id="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="code">Code</Label>
              <Input
                type="textarea"
                name="code"
                id="code"
                placeholder="Enter code"
                value={formData.code}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="domain">Domain</Label>
              <Input
                type="text"
                name="domain"
                id="domain"
                placeholder="Enter domain"
                value={formData.domain}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="designSystem">Design System</Label>
              <Input
                type="text"
                name="designSystem"
                id="designSystem"
                placeholder="Enter design system"
                value={formData.designSystem}
                onChange={handleChange}
              />
            </FormGroup>
            <div className="text-center">
              <Button color="primary" type="submit" disabled={loading}>
                {editIndex !== null ? "Update" : "Submit"}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      <Modal isOpen={deleteModalOpen} toggle={toggleDeleteModal} centered>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete this item?</p>
          <Button color="danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </ModalBody>
      </Modal>
    </>
  );
};

export default FormDb;