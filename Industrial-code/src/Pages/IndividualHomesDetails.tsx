import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProperty } from '../services/Api/Property';

import { Image } from 'react-bootstrap';
import { Box } from '@material-ui/core';
import Carousel from './Carousel';
import { faMapLocation, faCheckCircle, faEye, faTableTennis, faCheckDouble, faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Property {
  about_owner: string;
  address: string;
  approved_by: string;
  approved_no: string | null;
  brochure: string[];
  created_at: string;
  description: string;
  facing: string;
  features: string;
  floors: string;
  id: number;
  images: string[];
  is_active: boolean;
  logo: string[];
  modified_at: string | null;
  near_by_places: string;
  negotiable: string;
  owner_email: string;
  owner_phone_no: number;
  price: string;
  property_name: string;
  property_owner_name: string;
  property_status: string;
  property_type: string;
  site_visiting_images: string[];
  size: string;
  status: string;
  views: number;
}

const IndividualHomesDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState<Property | null>(null);
  const [zoomed, setZoomed] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getProperty(id)
        .then(response => {
          setData(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error("Failed to fetch data:", error);
        });
    }
  }, [id]);

  const toggleZoom = () => {
    setZoomed(prevZoomed => !prevZoomed);
  };

  return (
    <>
      {
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '1rem 0rem'
        }}>
          <>
            <div style={{
              width: '  70%',
              padding: '10px',
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
              borderRadius: '5px'
            }}>
              <div>
                <h5 style={{
                  borderBottom: '1px solid grey',
                  padding: '5px 0px'
                }}>Individual Home Details</h5>
                <h6>Property Name : {data?.property_name}</h6>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}>
                  <div>
                    <img src={data?.logo[0]}
                      style={{
                        width: '13rem',
                        height: '10rem',
                        borderRadius: '5px'
                      }}
                    />
                  </div>
                  <div>
                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }} >
                      <p><b>Price</b> : {data?.price}</p>
                      <p><b>Status</b> : {data?.property_status}</p>
                      <p><b>Size</b> : {data?.size}</p>
                    </div>
                    <div>
                      <div style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'baseline'
                      }}>
                        <FontAwesomeIcon icon={faMapLocation} />
                        <p><b>Adress</b> : {data?.address}</p>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'baseline'
                      }}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        <p><b>Approved By</b> : {data?.approved_by}</p>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'baseline'
                      }}>
                        <FontAwesomeIcon icon={faEye} />
                        <p><b>Views</b> : {data?.views}</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
            <div style={{
              width: '  70%',

              padding: '10px',
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
              borderRadius: '5px'
            }}>
              <div>
                <h5 style={{
                  borderBottom: '1px solid grey',
                  padding: '5px 0px'
                }}>Amenity Details</h5>
                <div style={{
                  display: 'flex',
                  gap: '10px'
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }} >
                      <p><b>Facing</b> : {data?.facing}</p>
                      <p><b>Floors</b> : {data?.floors}</p>
                      <p><b>Created On</b> : {data?.created_at}</p>
                    </div>
                    <div>
                      <div style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'baseline'
                      }}>
                        <FontAwesomeIcon icon={faMapLocation} />
                        <p><b>Nearby Places</b> : {data?.near_by_places}</p>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'baseline'
                      }}>
                        <FontAwesomeIcon icon={faTableTennis} />
                        <p><b>Features</b> : {data?.features}</p>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'baseline'
                      }}>
                        <FontAwesomeIcon icon={faCheckDouble} />
                        <p><b>Negotiable</b> : {data?.negotiable}</p>
                      </div>
                    </div>
                    <p><b>Description</b>:</p>
                    <p>{data?.description}</p>
                  </div>

                </div>

              </div>
            </div>
            <div style={{
              width: '  70%',
              padding: '10px',
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
              borderRadius: '5px'
            }}>
              <div>
                <h5 style={{
                  borderBottom: '1px solid grey',
                  padding: '5px 0px'
                }}>Owner Details</h5>
                <div style={{
                  display: 'flex',
                  gap: '10px'
                }}>
                  <div>
                    <div>
                      <div style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'baseline'
                      }}>
                        <FontAwesomeIcon icon={faUser} />
                        <p><b>Owner Name</b> : {data?.property_owner_name}</p>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'baseline'
                      }}>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <p><b>Owner Email</b> : {data?.owner_email}</p>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'baseline'
                      }}>
                        <FontAwesomeIcon icon={faPhone} />
                        <p><b>Phone Number</b> : {data?.owner_phone_no}</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
            <div style={{
              width: '  70%',
              margin: '20px 18rem',
              padding: '10px',
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
              borderRadius: '5px',
            }}>
              {data?.site_visiting_images && <Carousel images={data?.site_visiting_images} />}
            </div>


          </>
        </div>
      }
    </>
  );
}

export default IndividualHomesDetails;
