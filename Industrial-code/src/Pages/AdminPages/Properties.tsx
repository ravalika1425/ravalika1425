import { Image } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getProperties, deleteProperty } from '../../services/Api/Property';
import { Property } from '../../interfaces/Property-interface';
import styles from '../../styles/Property.module.css';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEye, faLocation, faMap, faMapLocation, faPerson, faPersonCircleCheck, faUser, faUserAlt } from '@fortawesome/free-solid-svg-icons';

const Properties = () => {
  const [data, setData] = useState<Property[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  let navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProperties().then((response) => {
      setData(response.data);
      setIsDataFetched(true);
      // Set this flag once the data is loaded
    });
  }, [data]);

  // if (!isDataFetched) {
  //   return <div>Loading...</div>;
  // }
  const handleAddProperty = () => {
    navigate('/adminhome/addproperty', { replace: true });
  }
  const handleEditProperty = (id: any) => {
    navigate('/adminhome/editproperty/' + id, { replace: true });
  }

  const handleViewProperty = (id: any) => {
    navigate('/adminhome/viewproperty/' + id, { replace: true });
  }

  // const handleDeleteProperty = (id: number) => {
  //   navigate('/adminhome/deleteproperty/' + id, { replace: true });
  // }

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('0')

  const handleOpen = (id: any) => {
    setSelectedItem(id)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id: any) => {
    console.log("delete ", selectedItem);
    if (selectedItem != null) {
      // deleteProperty(selectedItem)
    }
    setOpen(false);
  };


  return (
    <div className={styles.container}>
      <div className={styles.styles_divider}>
        <h1 className={styles.styles_heading}>Seller Properties Home Pages</h1>
        <input type="text" placeholder="Search.." className={styles.styles_search} value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant="contained" color="secondary" onClick={handleAddProperty}>AddProperty</Button>
      </div>
      {Array.isArray(data) && (
        <Container>
          {data.filter(item => item.address.toLowerCase().includes(search.toLowerCase())).map((item: Property, index) => (
            index % 3 === 0 && <Row key={index}> {/* Start a new row for every 3 items */}
              {[0, 1, 2].map(offset => {
                const currentIndex = index + offset;
                if (currentIndex < data.length) {
                  const currentItem = data[currentIndex];
                  return (
                    <Col key={currentItem.id}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'white',
                        margin: '1rem',
                        borderRadius: '20px',
                        position: 'relative',
                        overflow: 'hidden',
                        height: 'auto',
                        padding: 0,
                        width: '18rem'
                      }}>
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '50%',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={currentItem.logo && currentItem.logo[0] ? currentItem.logo[0].toString() : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT_t8OQNwCmTarqmpYE1LYv6v_xSgRHdq9nISM71gV4w&s'}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                        <div className={styles.description} style={{ padding: '1rem' }}>
                          <p style={{
                            color: '#932FB6',
                            gap: '5px',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <FontAwesomeIcon icon={faUserAlt} style={{ color: 'secondary' }} />
                            <b> Owner</b> : {currentItem.property_name}</p>
                          <p style={{
                            color: '#932FB6',
                            gap: '5px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          >
                            <FontAwesomeIcon icon={faMapLocation} style={{ color: 'secondary' }} />
                            <b> Address:</b> {currentItem.address}</p>
                          <p style={{
                            color: '#932FB6',
                            gap: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                          }}
                          ><FontAwesomeIcon icon={faCheckCircle} style={{ color: 'secondary' }} />
                            <b>Approved By:</b> {currentItem.approved_by}</p>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <Button
                              style={{
                                backgroundColor: 'white',
                                border: '2px solid #932FB6',
                                color: '#932FB6'
                              }} onClick={() => handleViewProperty(currentItem.id)}>
                              View
                            </Button>&nbsp;&nbsp;
                            <Button style={{
                              backgroundColor: 'white',
                              border: '2px solid #932FB6',
                              color: '#932FB6'
                            }} onClick={() => handleEditProperty(currentItem.id)}>Edit</Button>&nbsp;&nbsp;
                            <Button style={{
                              backgroundColor: 'white',
                              border: '2px solid #932FB6',
                              color: '#932FB6',
                            }} onClick={() => handleOpen(currentItem.id)}>Delete</Button>
                          </div>
                        </div>
                      </div>

                    </Col>

                  );
                }
                return null;
              })}
            </Row>
          ))}
        </Container>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this property?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>

  );
}


export default Properties;
