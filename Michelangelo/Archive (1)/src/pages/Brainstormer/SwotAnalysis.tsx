import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Input,
  Label,
  ListGroup,  
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Progress,
  Row,
  UncontrolledCollapse,
  Spinner,
} from "reactstrap";
import { useMsal } from "@azure/msal-react";
import { Link } from "react-router-dom";
import { Details, SwotAnalysisFragment } from "Mike/models/response";
import axios from "axios";
// import {ApiService} from "Mike/utils/apiService"
import { DescriptionSharp } from '@mui/icons-material';
// import { axiosInstance } from 'Mike/utils/axiosConfig';
import { regenarateBrainStormer } from 'services/brainStormerServices';
// import { axiosInstance } from 'Mike/utils/axiosConfig';
type SwotAnalysisProps = {
  swotAnalysis: SwotAnalysisFragment | null | undefined
  setSwotAnalysis: React.Dispatch<
    React.SetStateAction<SwotAnalysisFragment | null | undefined>
  >
}

type progressDataProp = {
  strength: number[][]
  weakness: number[][]
  opportunity: number[][]
  threat: number[][]
}
type Category = 'strength' | 'weakness' | 'opportunity' | 'threat'

const SwotAnalysis = ({ swotAnalysis, setSwotAnalysis }: SwotAnalysisProps) => {
  // const [swotAnalysis, setSwotAnalysis] = useState<
  //   SwotAnalysisFragment | null | undefined
  // >(data);
  const [editCardId, setEditCardId] = useState<number>(0)
  const [modalGrid, setModalGrid] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('Title')
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<Category>('strength')
  const [progressData, setProgressData] = useState<progressDataProp>({
    strength: [],
    weakness: [],
    threat: [],
    opportunity: []
  })
  const {accounts} = useMsal();

  const [regenerateModal, setRegenerateModal] = useState<boolean>(false);
  const [regenerateRequest, setRegenerateRequest] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false);
  useEffect(() => {
    if (swotAnalysis && !isInitialized) {
      const newStrength =
        swotAnalysis.strength?.map((item, index) => [
          getRandomImpactData(1, index),
          getRandomLevelData(1, index)
        ]) || []
      const newWeakness =
        swotAnalysis.weakness?.map((item, index) => [
          getRandomImpactData(2, index),
          getRandomLevelData(2, index)
        ]) || []
      const newOpportunity =
        swotAnalysis.opportunity?.map((item, index) => [
          getRandomImpactData(3, index),
          getRandomLevelData(3, index)
        ]) || []
      const newThreat =
        swotAnalysis.threat?.map((item, index) => [
          getRandomImpactData(4, index),
          getRandomLevelData(4, index)
        ]) || []

      setProgressData({
        strength: newStrength,
        weakness: newWeakness,
        opportunity: newOpportunity,
        threat: newThreat
      })

      setIsInitialized(true) // Set the flag to true after initial assignment
    }
  }, [swotAnalysis, isInitialized, editCardId])
  function getRandomImpactData (id: number, index: number) {
    if (id % 2 === 0) return id * 10 + index * 2
    return id * 10 + index * 3
  }
  function getRandomLevelData (id: number, index: number) {
    if (id % 2 === 1) return id * 10 + index * 3
    return id * 10 + index * 2
  }
  function handleDelete (category: string, id: number) {
    let newData: Details[] | undefined
    switch (category) {
      case 'strength':
        newData = swotAnalysis?.strength
        newData?.splice(id, 1)
        setSwotAnalysis(prevData => ({ ...prevData, strength: newData }))
        break
      case 'weakness':
        newData = swotAnalysis?.weakness
        newData?.splice(id, 1)
        setSwotAnalysis(prevData => ({ ...prevData, weakness: newData }))
        break
      case 'opportunity':
        newData = swotAnalysis?.opportunity
        newData?.splice(id, 1)
        setSwotAnalysis(prevData => ({ ...prevData, opportunity: newData }))
        break
      case 'threat':
        newData = swotAnalysis?.threat
        newData?.splice(id, 1)
        setSwotAnalysis(prevData => ({ ...prevData, threat: newData }))
        break
    }
  }
  const handleSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    sliderIndex: number
  ) => {
    const newValue = parseFloat(event.target.value)
    // setSliderValue(newValue);

    // Update progressData accordingly
    setProgressData(prevData => {
      const updatedData = { ...prevData }
      updatedData[category][editCardId][sliderIndex] = newValue
      return updatedData
    })
  }
  const handleEdit = (category: Category, index: number) => {
    console.log(progressData[category][0], progressData[category][1])
    setModalGrid(true)
    setCategory(category)
    setEditCardId(index)
    switch (category) {
      case 'strength':
        if (swotAnalysis?.strength && swotAnalysis.strength[index]) {
          setTitle(swotAnalysis.strength[index].title)
          setDescription(swotAnalysis.strength[index].description)
        }
        break
      case 'weakness':
        if (swotAnalysis?.weakness && swotAnalysis.weakness[index]) {
          setTitle(swotAnalysis.weakness[index].title)
          setDescription(swotAnalysis.weakness[index].description)
        }
        break
      case 'opportunity':
        if (swotAnalysis?.opportunity && swotAnalysis.opportunity[index]) {
          setTitle(swotAnalysis.opportunity[index].title)
          setDescription(swotAnalysis.opportunity[index].description)
        }
        break
      case 'threat':
        if (swotAnalysis?.threat && swotAnalysis.threat[index]) {
          setTitle(swotAnalysis.threat[index].title)
          setDescription(swotAnalysis.threat[index].description)
        }
        break
    }
  };
  //to handle the regenration of the card based on the category.
  const handleRegenerate = (category: Category, index: number) => {
    setRegenerateModal(true);
    setCategory(category);
    setRegenerateRequest("");
    setEditCardId(index);

    switch (category) {
      case "strength":
        if (swotAnalysis?.strength && swotAnalysis.strength[index]) {
          setTitle(swotAnalysis.strength[index].title);
          setDescription(swotAnalysis.strength[index].description);
        }
        break;
      case "weakness":
        if (swotAnalysis?.weakness && swotAnalysis.weakness[index]) {
          setTitle(swotAnalysis.weakness[index].title);
          setDescription(swotAnalysis.weakness[index].description);
        }
        break;
      case "opportunity":
        if (swotAnalysis?.opportunity && swotAnalysis.opportunity[index]) {
          setTitle(swotAnalysis.opportunity[index].title);
          setDescription(swotAnalysis.opportunity[index].description);
        }
        break;
      case "threat":
        if (swotAnalysis?.threat && swotAnalysis.threat[index]) {
          setTitle(swotAnalysis.threat[index].title);
          setDescription(swotAnalysis.threat[index].description);
        }
        break;
    }
  };
  //api call using the custom axios instance switch to switch between the prod and dev server based on availablity
  const regenerateDescription = async (category: string, FocusHeader: string,userRequest : string) => {
    try {
      const previousDescription = description;
      console.log(previousDescription)
      const userPrompt = `Category : ${category}\n\nFocus Header: ${FocusHeader}\n\nPrevious Description: ${previousDescription}\n\nUser Request for Focus Header: ${userRequest}`;
      console.log(userPrompt)
      const payload = { userSignature: accounts[0].username,"step": "swotanalysis","prompt": userPrompt };
      // const response = await axiosInstance.post('/brainstormer/product_research/regenerate',payload);
      const response = await regenarateBrainStormer(payload);
      if (response.data) {
        const getdata = response.data.response;
        if (getdata.title === FocusHeader){
          const newDescription = getdata.new_value;
          console.log(newDescription);
          setNewDescription(newDescription);
          setIsRequestSuccessful(true);
          } else {
            console.error("Error: FocusHeader not found in response data");
          }

      } else {
        console.error("Error: Response data is undefined");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Error in API call:", error.message);
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };
  


  //handle the selection of the regenrated description
  const handleDescriptionSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedDescription(newDescription);
    } else {
      setSelectedDescription("");
    }
  };

  const handleRegenerateModalCancel = () => {
    setRegenerateModal(false);
    setIsRequestSuccessful(false);
    setRegenerateRequest("");
    setNewDescription("");
    setRegenerateRequest("")
    setSelectedDescription("");
  };



  const handleRegenerateModalAccept = () => {
    if (selectedDescription) {
      switch (category) {
        case "strength":
          const newStrength = swotAnalysis?.strength || [];
          newStrength[editCardId] = { title: title, description: selectedDescription };
          setSwotAnalysis((prevState) => ({
            ...prevState,
            strength: newStrength,
          }));
          break;
        case "weakness":
          const newWeakness = swotAnalysis?.weakness || [];
          newWeakness[editCardId] = { title: title, description: selectedDescription };
          setSwotAnalysis((prevState) => ({
            ...prevState,
            weakness: newWeakness,
          }));
          break;
        case "opportunity":
          const newOpportunity = swotAnalysis?.opportunity || [];
          newOpportunity[editCardId] = { title: title, description: selectedDescription };
          setSwotAnalysis((prevState) => ({
            ...prevState,
            opportunity: newOpportunity,
          }));
          break;
        case "threat":
          const newThreat = swotAnalysis?.threat || [];
          newThreat[editCardId] = { title: title, description: selectedDescription };
          setSwotAnalysis((prevState) => ({
            ...prevState,
            threat: newThreat,
          }));
          break;
      }
    }
    setRegenerateModal(false);
    setIsRequestSuccessful(false);
    setRegenerateRequest("");
    setNewDescription("");
    setRegenerateRequest("")
    setSelectedDescription("");
  };

  function updateCardData () {
    switch (category) {
      case 'strength':
        const newStrength = swotAnalysis?.strength || []
        newStrength[editCardId] = { title: title, description: description }
        setSwotAnalysis(prevState => ({
          ...prevState,
          strength: newStrength
        }))
        break
      case 'weakness':
        const newWeakness = swotAnalysis?.weakness || []
        newWeakness[editCardId] = { title: title, description: description }
        setSwotAnalysis(prevState => ({
          ...prevState,
          weakness: newWeakness
        }))
        break
      case 'opportunity':
        const newOpportunity = swotAnalysis?.opportunity || []
        newOpportunity[editCardId] = { title: title, description: description }
        setSwotAnalysis(prevState => ({
          ...prevState,
          opportunity: newOpportunity
        }))
        break
      case 'threat':
        const newThreat = swotAnalysis?.threat || []
        newThreat[editCardId] = { title: title, description: description }
        setSwotAnalysis(prevState => ({
          ...prevState,
          threat: newThreat
        }))
        break
    }
    setModalGrid(false)
  }
  return (
    <>
      <Row className='row-cols-xxl-2 row-cols-lg-2 row-cols-md-2 cols-sm-2'>
        <div className='col'>
          <Card className='mb-1 ribbon-box ribbon-fill ribbon-sm'>
            <div className='ribbon ribbon-info'>
              <i className=' ri-award-line'></i>
            </div>
            <Link
              to='#'
              className={'card-header bg-primary-subtle border-0 ml-2'}
              id={'leadDiscovered' + 1}
            >
              <h5 className='card-title text-uppercase fw-bold mb-1 fs-15'>
                Strengths
              </h5>
            </Link>
          </Card>
          <UncontrolledCollapse
            toggler={'#leadDiscovered' + 1}
            defaultOpen={true}
          >
            {swotAnalysis?.strength &&
              swotAnalysis?.strength.map((strength: Details, index: number) => (
                <React.Fragment>
                  <Card>
                    <CardBody>
                      <Row>
                        <Col xl={12}>
                          <Link
                            to='#'
                            className='d-flex align-items-center'
                            id={'leadInnerDiscovered' + 1 + index}
                          >
                            <div className='flex-shrink-0'>
                              <i className='ri-hotel-line'></i>
                              <i className='ri-medal-fill'></i>
                            </div>
                            <div className='flex-grow-1 ms-2 w-100'>
                              <h6 className='fs-13 mb-0'>{strength.title}</h6>
                            </div>
                          </Link>
                        </Col>
                      </Row>
                      <UncontrolledCollapse
                        className='border-top border-top-dashed'
                        toggler={'#leadInnerDiscovered' + 1 + index}
                        defaultOpen={false}
                      >
                        <CardBody
                          className='p-10 d-flex'
                          style={{ minHeight: '240px' }}
                        >
                          <p className='text-muted fs-13 h-100 text-wrap'>
                            {strength.description}
                          </p>

                          <ul className='list-unstyled vstack gap-2 mb-0'>
                            <li>
                              <div className='d-flex'>
                                <div className='flex-shrink-0 avatar-xxs text-muted'>
                                  <i className='  ri-bar-chart-fill'></i>
                                </div>
                                <div className='flex-grow-1'>
                                  <h6 className='mb-2'>Impact</h6>
                                  <div className='mb-4'>
                                    {progressData?.strength?.length > 0 &&
                                      progressData.strength[index] && (
                                        <Progress
                                          color='primary'
                                          value={
                                            progressData.strength[index][0]
                                          }
                                          className='progress-sm'
                                        />
                                      )}
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className='d-flex'>
                                <div className='flex-shrink-0 avatar-xxs text-muted'>
                                  <i className='ri-mac-line'></i>
                                </div>
                                <div className='flex-grow-1'>
                                  <h6 className='mb-2'>Priority Level</h6>
                                  <div className='mb-4'>
                                    {progressData?.strength?.length > 0 &&
                                      progressData.strength[index] && (
                                        <Progress
                                          color='primary'
                                          value={
                                            progressData.strength[index][1]
                                          }
                                          className='progress-sm'
                                        />
                                      )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </CardBody>
                        <CardFooter className='hstack gap-1'>
                          <Button
                            color='primary'
                            className='btn-sm w-100 fs-15'
                            onClick={() => handleEdit('strength', index)}
                          >
                            <>
                              <i className='ri-pencil-fill align-bottom'></i>{' '}
                            </>
                          </Button>

                          <Button
                            color="warning"
                            className="btn-sm w-100 fs-15"
                            onClick={() => handleRegenerate("strength", index)
                              
                            }
                          >
                            <i className="ri-refresh-line"></i>
                          </Button>
                          <Button
                            color='info'
                            className='btn-sm w-100 fs-15'
                            onClick={() => handleDelete('strength', index)}
                          >
                            <i className='ri-delete-bin-line'></i>
                          </Button>
                        </CardFooter>
                      </UncontrolledCollapse>
                    </CardBody>
                  </Card>
                </React.Fragment>
              ))}
          </UncontrolledCollapse>
        </div>
        <div className='col'>
          <Card className='mb-1 ribbon-box ribbon-fill ribbon-sm'>
            <div className='ribbon ribbon-info'>
              <i className='ri-error-warning-line'></i>
            </div>
            <Link
              to='#'
              className={'card-header bg-primary-subtle border-0'}
              id={'leadDiscovered' + 2}
            >
              <h5 className='card-title text-uppercase fw-bold mb-1 fs-15'>
                Weaknesses
              </h5>
            </Link>
          </Card>
          <UncontrolledCollapse
            toggler={'#leadDiscovered' + 2}
            defaultOpen={true}
          >
            {swotAnalysis?.weakness &&
              swotAnalysis?.weakness.map((weakness: Details, index: number) => (
                <React.Fragment>
                  <Card style={{ maxHeight: '500px' }}>
                    <CardBody>
                      <Row>
                        <Col xl={12}>
                          <Link
                            to='#'
                            className='d-flex align-items-center'
                            id={'leadInnerDiscovered' + 2 + index}
                          >
                            <div className=''>
                              <i className='ri-creative-commons-nd-line'></i>
                              <i className='ri-meteor-line'></i>
                            </div>
                            <div className='ms-3 w-100'>
                              <h6 className='fs-13 mb-1'>{weakness.title}</h6>
                            </div>
                          </Link>
                        </Col>
                      </Row>
                      <UncontrolledCollapse
                        className='border-top border-top-dashed'
                        toggler={'#leadInnerDiscovered' + 2 + index}
                        defaultOpen={false}
                      >
                        <CardBody style={{ minHeight: '240px' }}>
                          <p className='text-muted fs-13'>
                            {weakness.description}
                          </p>
                          <ul className='list-unstyled vstack gap-2 mb-0'>
                            <li>
                              <div className='d-flex'>
                                <div className='flex-shrink-0 avatar-xxs text-muted'>
                                  <i className='  ri-bar-chart-fill'></i>
                                </div>
                                <div className='flex-grow-1'>
                                  <h6 className='mb-2'>Impact</h6>
                                  <div className='mb-4'>
                                    {progressData?.weakness?.length > 0 &&
                                      progressData.weakness[index] && (
                                        <Progress
                                          color='primary'
                                          value={
                                            progressData.weakness[index][0]
                                          }
                                          className='progress-sm'
                                        />
                                      )}
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className='d-flex'>
                                <div className='flex-shrink-0 avatar-xxs text-muted'>
                                  <i className='ri-mac-line'></i>
                                </div>
                                <div className='flex-grow-1'>
                                  <h6 className='mb-2'>Priority Level</h6>
                                  <div className='mb-4'>
                                    {progressData?.weakness?.length > 0 &&
                                      progressData.weakness[index] && (
                                        <Progress
                                          color='primary'
                                          value={
                                            progressData.weakness[index][1]
                                          }
                                          className='progress-sm'
                                        />
                                      )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </CardBody>
                        <CardFooter className='hstack gap-2'>
                          <Button
                            color='primary'
                            className='btn-sm w-100 fs-15'
                            onClick={() => handleEdit('weakness', index)}
                          >
                            <>
                              <i className='ri-pencil-fill align-bottom me-1'></i>{' '}
                            </>
                          </Button>
                          <Button
                            color="warning"
                            className="btn-sm w-100 fs-15"
                            onClick={() => handleRegenerate("weakness", index)}
                          >
                            <i className="ri-refresh-line"></i>
                          </Button>
                          <Button
                            color='info'
                            className='btn-sm w-100 fs-15'
                            onClick={() => handleDelete('weakness', index)}
                          >
                            <i className='ri-delete-bin-line'></i>
                          </Button>
                        </CardFooter>
                      </UncontrolledCollapse>
                    </CardBody>
                  </Card>
                </React.Fragment>
              ))}
          </UncontrolledCollapse>
        </div>
        <div className='col'>
          <Card className='mb-1 ribbon-box ribbon-fill ribbon-sm'>
            <div className='ribbon ribbon-info'>
              <i className='ri-exchange-dollar-line'></i>
            </div>
            <Link
              to='#'
              className={'card-header bg-primary-subtle border-0'}
              id={'leadDiscovered' + 3}
            >
              <h5 className='card-title text-uppercase fw-bold mb-1 fs-15'>
                Opportunities
              </h5>
            </Link>
          </Card>
          <UncontrolledCollapse
            toggler={'#leadDiscovered' + 3}
            defaultOpen={true}
          >
            {swotAnalysis?.opportunity &&
              swotAnalysis?.opportunity.map(
                (opportunity: Details, index: number) => (
                  <React.Fragment>
                    <Card>
                      <CardBody>
                        <Row>
                          <Col xl={12}>
                            <Link
                              to='#'
                              className='d-flex align-items-center'
                              id={'leadInnerDiscovered' + 3 + index}
                            >
                              <div className='flex-shrink-0'>
                                <i className='ri-exchange-dollar-line'></i>
                                <i className='ri-copper-diamond-line'></i>
                              </div>
                              <div className='ms-3 w-100'>
                                <h6 className='fs-13 mb-1'>
                                  {opportunity.title}
                                </h6>
                              </div>
                            </Link>
                          </Col>
                        </Row>
                        <UncontrolledCollapse
                          className='border-top border-top-dashed'
                          toggler={'#leadInnerDiscovered' + 3 + index}
                          defaultOpen={false}
                        >
                          <CardBody style={{ minHeight: '240px' }}>
                            <h6 className='fs-15 mb-1'> </h6>
                            <p className='text-muted fs-13'>
                              {opportunity.description}
                            </p>
                            <ul className='list-unstyled vstack gap-2 mb-0'>
                              <li>
                                <div className='d-flex'>
                                  <div className='flex-shrink-0 avatar-xxs text-muted'>
                                    <i className='  ri-bar-chart-fill'></i>
                                  </div>
                                  <div className='flex-grow-1'>
                                    <h6 className='mb-2'>Impact</h6>
                                    <div className='mb-4'>
                                      {progressData?.opportunity?.length > 0 &&
                                        progressData.opportunity[index] && (
                                          <Progress
                                            color='primary'
                                            value={
                                              progressData.opportunity[index][0]
                                            }
                                            className='progress-sm'
                                          />
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className='d-flex'>
                                  <div className='flex-shrink-0 avatar-xxs text-muted'>
                                    <i className='ri-mac-line'></i>
                                  </div>
                                  <div className='flex-grow-1'>
                                    <h6 className='mb-2'>Priority Level</h6>
                                    <div className='mb-4'>
                                      {progressData?.opportunity?.length > 0 &&
                                        progressData.opportunity[index] && (
                                          <Progress
                                            color='primary'
                                            value={
                                              progressData.opportunity[index][1]
                                            }
                                            className='progress-sm'
                                          />
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </CardBody>
                          <CardFooter className='hstack gap-2'>
                            <Button
                              color='primary'
                              className='btn-sm w-100 fs-15'
                              onClick={() => handleEdit('opportunity', index)}
                            >
                              <>
                                <i className='ri-pencil-fill align-bottom me-1'></i>{' '}
                              </>
                            </Button>
                            <Button
                              color="warning"
                              className="btn-sm w-100 fs-15"
                              onClick={() => handleRegenerate("opportunity", index)}
                            >
                              <i className="ri-refresh-line"></i>
                            </Button>
                            <Button
                              color='info'
                              className='btn-sm w-100 fs-15'
                              onClick={() => handleDelete('opportunity', index)}
                            >
                              <i className='ri-delete-bin-line'></i>
                            </Button>
                          </CardFooter>
                        </UncontrolledCollapse>
                      </CardBody>
                    </Card>
                  </React.Fragment>
                )
              )}
          </UncontrolledCollapse>
        </div>
        <div className='col'>
          <Card className='mb-1 ribbon-box ribbon-fill ribbon-sm'>
            <div className='ribbon ribbon-info'>
              <i className=' ri-flashlight-fill'></i>
            </div>
            <Link
              to='#'
              className={'card-header bg-primary-subtle border-0'}
              id={'leadDiscovered' + 4}
            >
              <h5 className='card-title text-uppercase fw-bold mb-1 fs-15 ml-2'>
                Threats
              </h5>
            </Link>
          </Card>
          <UncontrolledCollapse
            toggler={'#leadDiscovered' + 4}
            defaultOpen={true}
          >
            {swotAnalysis?.threat &&
              swotAnalysis?.threat.map((threat: Details, index: number) => (
                <React.Fragment>
                  <Card>
                    <CardBody>
                      <Row>
                        <Col xl={12}>
                          <Link
                            to='#'
                            className='d-flex align-items-center'
                            id={'leadInnerDiscovered' + 4 + index}
                          >
                            <div className='flex-shrink-0'>
                              <i className='ri-auction-line'></i>
                              <i className='ri-chrome-line'></i>
                            </div>
                            <div className='flex-grow-1 ms-3 w-100'>
                              <h6 className='fs-13 mb-1'>{threat.title}</h6>
                            </div>
                          </Link>
                        </Col>
                      </Row>
                      <UncontrolledCollapse
                        className='border-top border-top-dashed'
                        toggler={'#leadInnerDiscovered' + 4 + index}
                        defaultOpen={false}
                      >
                        <CardBody style={{ minHeight: '240px' }}>
                          <h6 className='fs-15 mb-1'> </h6>
                          <p className='text-muted fs-13'>
                            {threat.description}
                          </p>
                          <ul className='list-unstyled vstack gap-2 mb-0'>
                            <li>
                              <div className='d-flex'>
                                <div className='flex-shrink-0 avatar-xxs text-muted'>
                                  <i className='  ri-bar-chart-fill'></i>
                                </div>
                                <div className='flex-grow-1'>
                                  <h6 className='mb-2'>Impact</h6>
                                  <div className='mb-4'>
                                    {progressData?.threat?.length > 0 &&
                                      progressData.threat[index] && (
                                        <Progress
                                          color='primary'
                                          value={progressData.threat[index][0]}
                                          className='progress-sm'
                                        />
                                      )}
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className='d-flex'>
                                <div className='flex-shrink-0 avatar-xxs text-muted'>
                                  <i className='ri-mac-line'></i>
                                </div>
                                <div className='flex-grow-1'>
                                  <h6 className='mb-2'>Priority Level</h6>
                                  <div className='mb-4'>
                                    {progressData?.threat?.length > 0 &&
                                      progressData.threat[index] && (
                                        <Progress
                                          color='primary'
                                          value={progressData.threat[index][1]}
                                          className='progress-sm'
                                          min={0}
                                          max={100}
                                        />
                                      )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </CardBody>
                        <CardFooter className='hstack gap-2'>
                          <Button
                            color='primary'
                            className='btn-sm w-100 fs-15'
                            onClick={() => handleEdit('threat', index)}
                          >
                            <>
                              <i className='ri-pencil-fill align-bottom me-1'></i>{' '}
                            </>
                          </Button>
                          <Button
                            color="warning"
                            className="btn-sm w-100 fs-15"
                            onClick={() => handleRegenerate("threat", index)}
                          >
                            <i className="ri-refresh-line"></i>
                          </Button>

                          <Button
                            color='info'
                            className='btn-sm w-100 fs-15'
                            onClick={() => handleDelete('threat', index)}
                          >
                            <i className='ri-delete-bin-line'></i>
                          </Button>
                        </CardFooter>
                      </UncontrolledCollapse>
                    </CardBody>
                  </Card>
                </React.Fragment>
              ))}
          </UncontrolledCollapse>
        </div>
      </Row>
      <Modal
        isOpen={modalGrid}
        toggle={() => setModalGrid(!modalGrid)}
        centered={true}
      >
        <ModalHeader toggle={() => setModalGrid(!modalGrid)}>
          <h5 className='modal-title d-flex justify-content-end'>Edit</h5>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={e => {
              e.preventDefault()
              updateCardData()
            }}
          >
            <div className='row g-3'>
              <div>
                <label htmlFor='title' className='form-label'>
                  Title
                </label>
                <Input
                  type='text'
                  className='form-control'
                  id='title'
                  value={title}
                  placeholder='Enter Title..'
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor='description' className='form-label'>
                  Enter Test Description
                </label>
                <Input
                  type='textarea'
                  rows='3'
                  className='form-control'
                  name='description'
                  id='description'
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder='Enter Description'
                />
              </div>
              <div>
                <label htmlFor='description' className='form-label'>
                  Impact
                </label>
                {progressData[category] &&
                  progressData[category].length > 0 && (
                    <input
                      type='range'
                      className='form-range'
                      min='0'
                      max='100'
                      step='0.5'
                      id='customRange3'
                      defaultValue={progressData[category][editCardId][0] + ''}
                      onChange={e => handleSliderChange(e, 0)}
                    />
                  )}
              </div>
              <div>
                <label htmlFor='description' className='form-label'>
                  Priority Level
                </label>
                {progressData[category] &&
                  progressData[category].length > 0 && (
                    <input
                      type='range'
                      className='form-range'
                      min='0'
                      max='100'
                      step='0.5'
                      id='customRange3'
                      defaultValue={progressData[category][editCardId][1] + ''}
                      onChange={e => handleSliderChange(e, 1)}
                    />
                  )}
              </div>

              <Button color='primary' type='submit'>
                Update
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>


      <Modal
        isOpen={regenerateModal}
        toggle={() => setRegenerateModal(!regenerateModal)}
        centered={true}
      >
        <ModalHeader toggle={() => setRegenerateModal(!regenerateModal)}>
          <h5 className="modal-title">Regenerate Swot Analysis</h5>
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <h5>{title}</h5>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              await regenerateDescription(category, title,regenerateRequest);
              setIsLoading(false);
            }}
          >
            <div className="row g-3">
              <div>
                <label htmlFor="previousDescription" className="form-label">
                  Previous Description
                </label>
                <textarea
                  className="form-control"
                  id="previousDescription"
                  value={description}
                  disabled
                />
              </div>
              {!isRequestSuccessful && (
                <div>
                  <label htmlFor="userRequest" className="form-label">
                    User Request
                  </label>
                  <Input
                    type="textarea"
                    rows={3}
                    className="form-control"
                    name="userRequest"
                    id="userRequest"
                    value={regenerateRequest}
                    onChange={(e) => setRegenerateRequest(e.target.value)}
                    placeholder="Enter your request for change"
                  />
                </div>
              )}
              {!isRequestSuccessful && (
                <Button color="primary" type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : "Submit"}
                </Button>
              )}
            </div>
          </form>
          {isLoading && <div>Loading...</div>}
          {isRequestSuccessful && newDescription && (
            <div>
              <label htmlFor="newDescription" className="form-label">
                New Description
              </label>
              <div className="input-group">
                <div className="input-group-text">
                  <input
                    type="checkbox"
                    checked={selectedDescription === newDescription}
                    onChange={handleDescriptionSelection}
                  />
                </div>
                <textarea
                  className="form-control"
                  id="newDescription"
                  value={newDescription}
                  disabled
                />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {isRequestSuccessful && (
            <>
              <Button color="secondary" onClick={handleRegenerateModalCancel}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleRegenerateModalAccept}>
                Accept
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>

    </>
  )
}

export default SwotAnalysis
