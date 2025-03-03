import RecipeForm from 'pages/RecipeForm/RecipeForm'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Col, Row } from 'reactstrap'
import img14 from '../../../src/assets/images/products/img1.jpeg'
import img15 from '../../../src/assets/images/products/img2.jpeg'
import img10 from '../../../src/assets/images/products/img3.jpeg'
import img11 from '../../../src/assets/images/products/img4.jpeg'
import img6 from '../../../src/assets/images/products/img7.jpeg'

const imagePool = [img15, img10, img14, img11, img6]

interface Project {
  base: { name: string }
  roadmap: boolean
  id: string
}

interface RecentCreationsProps {
  projects: Project[]
  onDelete: (id: string) => Promise<void>
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

const Content: React.FC<RecentCreationsProps> = ({
  projects}) => {
  const navigate = useNavigate()

  function handleProjectClick (card: Project) {
    navigate('/brainstormer', { state: card })
  }
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggle = () => setIsOpen(!isOpen)

  return (
    <React.Fragment>
      <div className='page-content'>
        <div className='container-fluid'>
          <div className='cards-container-wrapper'>
            <h3 className='head' style={{ textAlign: 'left' }}>
              My Ideas
            </h3>
            {projects.length !== 0 && (
              <Row className='recent'>
                {projects.map((card, index) => (
                  <Col sm={2} xl={2} key={index} style={{ minWidth: '200px' }}>
                    <Card className='explore-box card-animate'>
                      <div className='position-relative'>
                        <img
                          className='card-img img-fluid'
                          src={imagePool[index % imagePool.length]}
                          alt='Card cap'
                          onClick={() => handleProjectClick(card)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                      <div className='card-body'>
                        <h4 className='card-title1 mb-2'>{card.base.name}</h4>
                        <h6 className='card-title2'>Brainstormer</h6>
                        <p className='card-title3'>
                          {card.roadmap ? 'Done' : 'In Progress'}
                        </p>
                        {/* <Button color="danger" onClick={() => handleDelete(card.id)}>
                          Delete
                        </Button> */}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </div>
      </div>
      <RecipeForm isOpen={isOpen} toggle={toggle} />
    </React.Fragment>
  )
}

export default Content
