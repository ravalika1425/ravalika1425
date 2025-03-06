import { Image } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPropertyByType } from '../services/Api/Property';
import { postcount } from '../services/Api/Count';
import { Property } from '../interfaces/Property-interface';
import styles from '../styles/Apartments.module.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import { faEye, faMapMarkerAlt, faUser, faCheck, faRupeeSign } from '@fortawesome/free-solid-svg-icons';

const OpenPlots = () => {
  const [data, setData] = useState<Property[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  let navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getPropertyByType('OPENPLOTS').then((response) => {
      setData(response.data);
      setIsDataFetched(true); // Set this flag once the data is loaded
    });
  }, [isDataFetched]);


  const handleOnClick = async (id: number) => {
    try {
      const newData = {
        property_details_id: id,
      };
      await postcount(newData);
      // console.log(response); // Since postcount already returns response.data
    } catch (error) {
      console.error('Error posting count:', error);
      // Handle the error appropriately
    }
  };

  const handleImageClick = (id: number) => {
    navigate('/OpenPlotsDetails/' + id, { replace: true });
  };


  return (
    <>
      {
        data && (
          <div className={styles.container}>
            <div className={styles.divider}>
              <h2 className={styles.header}>OpenPlots</h2>
              <input type="text" placeholder="Search.." className={styles.styles_search} value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {/* {Array.isArray(data) && data.filter(item => item.address.toLowerCase().includes(search.toLowerCase())).map((item: Property) => (
        <Container key={item.id} onClick={() => handleImageClick(item.id)}>
          <Row>
            <Col xs={12} md={6} lg={4} className={styles.card}>
              <Image src={item.logo[0]?.toString()} thumbnail className={styles.image} onClick={() => handleOnClick(item.id)} />
              <div className={styles.description}>
                <p style={{ color: 'red' }}>Property Owner: {item.property_name}</p>
                <p style={{ color: 'red' }}>Address: {item.address}</p>
                <p style={{ color: 'red' }}>Approved By: {item.approved_by}</p>
                <FontAwesomeIcon icon={faEye} className={styles.icon} style={{ color: 'blue' }} /><p style={{ color: 'red' }}>{item.views}</p>
              </div>
            </Col>
          </Row>
        </Container>
      ))} */}
            <Grid container spacing={2} className={styles.cardContainer}>
              {Array.isArray(data) &&
                data
                  .filter((item) => item.address.toLowerCase().includes(search.toLowerCase()))
                  .map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Card sx={{
                        maxWidth: 345,
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        '&:hover': {
                          transform: "scale(1.05)",
                          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)"
                        }
                      }}>
                        <Link to={`/OpenPlotsDetails/${item.id}`} style={{ textDecoration: 'none' }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={item.logo[0]?.toString()}
                            alt={item.address}
                            onClick={() => handleOnClick(item.id)}
                            style={{ padding: "15px" }}
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="div" color="primary">
                              <FontAwesomeIcon icon={faRupeeSign} /> {item.price}
                            </Typography>
                            {/* <Typography variant="body2" color="text.secondary">
                        <FontAwesomeIcon icon={faUser} /> Property Owner: {item.property_name}
                      </Typography> */}
                            <Typography variant="body2" color="text.secondary">
                              <FontAwesomeIcon icon={faMapMarkerAlt} />  {item.address}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <FontAwesomeIcon icon={faCheck} /> Approved By: {item.approved_by}
                            </Typography>
                            {/* <Typography variant="body2" color="text.secondary">
                        <FontAwesomeIcon icon={faEye} /> {item.views}
                      </Typography> */}
                          </CardContent>
                        </Link>
                      </Card>
                    </Grid>
                  ))}
            </Grid>
          </div>
        )
      }
    </>
  );
}

export default OpenPlots;
