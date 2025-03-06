import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProperty } from '../../services/Api/Property';
import Carousel from '../Carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapLocation, faCheckCircle, faSun, faWater, faLocationArrow, faEye, faTableTennis, faCheckDouble, faUser, faEnvelope, faPhone, faHome,faImages,faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import styles from '../../styles/PropertyDetails.module.css';
import {
  faDumbbell, faShieldAlt, faSwimmingPool, faTree, faHouse, faBolt, faBasketballBall, faChalkboardTeacher, faCouch, faSpa, faFire, faCar, faWifi, faVideo, faTheaterMasks, faChild, faCut, faBicycle,
} from '@fortawesome/free-solid-svg-icons';
import { AppBar, useMediaQuery, Typography} from "@mui/material";
const amenityIcons: { [key: string]: any } = {
  gymnasium: faDumbbell,
  security: faShieldAlt,
  "swimming pool": faSwimmingPool,
  "children's play area": faChild,
  "24x7 water supply": faBolt,
  "badminton court": faBasketballBall,
  "club house": faHouse,
  "jogging track": faBicycle,
  "indoor games": faCouch,
  "spa/sauna/steam": faSpa,
  "fire sprinklers": faFire,
  "car parking": faCar,
  "internet / wifi": faWifi,
  "24x7 cctv surveillance": faVideo,
  "open air theatre": faTheaterMasks,
  salon: faCut,
  "senior citizen siteout": faChalkboardTeacher,
  "basketball court": faBasketballBall,
  "conference room": faChalkboardTeacher,
  cafeteria: faTree,
};

const sectionIcons = {
  'Property Details': faHome,
  'Images': faImages,
  'Site Visiting Images': faImages,
  'Brochure': faFilePdf,
  'Project Amenities': faSwimmingPool,
  'Owner Details': faUser,
};

const PropertyDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Property Details');
  const isMobile = useMediaQuery("(max-width: 768px)");
  useEffect(() => {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      const user = JSON.parse(userItem);
      setIsLoggedIn(!!user);
    }

    if (id) {
      getProperty(id)
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          alert("Failed to fetch Data");
          console.error("Failed to fetch data:", error);
        });
    }
  }, [id]);

  const amenities = data?.features?.split(",").map((item:any) => item.trim()) || [];

  const sections = [
    'Property Details',
    'Images',
    'Site Visiting Images',
    'Brochure',
    'Project Amenities',
    'Owner Details',
  ];

  const renderSection = () => {
    switch (selectedSection) {
      case 'Property Details':
        return (
          <div>
            <h5 className={styles.sectionTitle}><b>Property Details</b></h5>
            <div className={styles.propertyContent}>
              <table className={styles.propertyTable}>
                {data?.property_name && (
                  <tr>
                    <th>Property Name</th>
                    <td>{data.property_name}</td>
                  </tr>
                )}
                {data?.price && (
                  <tr>
                    <th>Price</th>
                    <td>
                      <CurrencyRupeeIcon /> {data.price}
                    </td>
                  </tr>
                )}
                {data?.property_status && (
                  <tr>
                    <th>Status</th>
                    <td>{data.property_status}</td>
                  </tr>
                )}
                {data?.facing && (
                  <tr>
                    <th>Facing</th>
                    <td><FontAwesomeIcon icon={faSun} />{data.facing}</td>
                  </tr>
                )}
                {data?.floors && (
                  <tr>
                    <th>Floors</th>
                    <td>{data.floors}</td>
                  </tr>
                )}
                {data?.size && (
                  <tr>
                    <th>Size</th>
                    <td>{data.size}</td>
                  </tr>
                )}
                {data?.address && (
                  <tr>
                    <th>Address</th>
                    <td>
                      <LocationOnIcon /> {data.address}
                    </td>
                  </tr>
                )}
                {data?.near_by_places && (
                  <tr>
                    <th>Nearby Places:</th>
                    <td><FontAwesomeIcon icon={faLocationArrow} /> {data.near_by_places}</td>
                  </tr>
                )}
                {data?.district && (
                  <tr>
                    <th>District</th>
                    <td>{data.district}</td>
                  </tr>
                )}
                {data?.mandal && (
                  <tr>
                    <th>Mandal</th>
                    <td>{data.mandal}</td>
                  </tr>
                )}
                {data?.village && (
                  <tr>
                    <th>Village</th>
                    <td>{data.village}</td>
                  </tr>
                )}
                {data?.approved_by && (
                  <tr>
                    <th>Approved By</th>
                    <td>{data.approved_by}</td>
                  </tr>
                )}
                {data?.approved_no && (
                  <tr>
                    <th>Approved Number</th>
                    <td>{data.approved_no}</td>
                  </tr>
                )}
                {data?.negotiable && (
                  <tr>
                    <th>Is Negotiable</th>
                    <td><FontAwesomeIcon icon={faCheckCircle} />{data.negotiable}</td>
                  </tr>
                )}
                {data?.description && (
                  <tr>
                    <th>Description</th>
                    <td>{data.description}</td>
                  </tr>
                )}
              </table>
            </div>
          </div>
        );
      case 'Images':
        return data?.images && data.images.length > 0 && (
          <div style={{ width: '100%', overflowX: 'auto' }}>
              <h2 className={styles.sectionTitle}><b>Images</b></h2>
            <Carousel images={data.images} />
          </div>
        );
      case 'Site Visiting Images':
        return data?.lastest_site_visit_images && data.lastest_site_visit_images.length > 0 && (
          <div>
            <h5 className={styles.sectionTitle}>Site Visiting Images</h5>
            <Carousel images={data.lastest_site_visit_images} />
          </div>
        );
      case 'Brochure':
        return data?.brochure && data.brochure.length > 0 && (
          <>
          <div>
            <h5 className={styles.sectionTitle}>Brochure</h5>
            <Carousel images={data.brochure}/>
          </div>
          </>
        );
      case 'Project Amenities':
        return (
          <div>
             <h3 className={styles.projectTitle}><b>Project Amenities</b></h3>
          <div className={styles.amenitiesContainer}>
            <div className={styles.amenitiesGrid}>
              {amenities.length > 0 ? (
                amenities.map((amenity:any, index:any) => (
                  <div className={styles.amenityItem} key={index}>
                    <FontAwesomeIcon
                      icon={amenityIcons[amenity.toLowerCase()] || faHouse}
                      className={styles.icon}
                    />
                    <p className={styles.amenityName}>{amenity}</p>
                  </div>
                ))
              ) : (
                <p className={styles.noAmenities}>No amenities available</p>
              )}
            </div>
          </div>
          </div>
        );
      case 'Owner Details':
        return (
          <div style={{width:isMobile? "0":'', marginRight:'20px' }}>
             <h2 className={styles.ownertitle}><b>Owner Details</b></h2>
          <div className={styles.detailsSection}>
            <div className={styles.ownerInfo}>
              <p>
                <FontAwesomeIcon icon={faUser} className={styles.icon} />{" "}
                <strong>Name:</strong> {data?.property_owner_name || "N/A"}
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />{" "}
                <strong>Email:</strong> {data?.owner_email || "N/A"}
              </p>
              <p>
                <FontAwesomeIcon icon={faPhone} className={styles.icon} />{" "}
                <strong>Phone:</strong> {data?.owner_phone_no || "N/A"}
              </p>
              <p>
                <strong>About Owner:</strong> {data?.about_owner || "N/A"}
              </p>
            </div>
          </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: 'white', color: 'black', marginTop: '30px',height:isMobile? '100vh':''}}>
      <div className={styles.sidebar}>
        <ul>
          {sections.map(section => (
            <li
              key={section}
              onClick={() => setSelectedSection(section)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#373636';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e8ebed';
                e.currentTarget.style.color = '#373636';
              }}
            >
              <FontAwesomeIcon icon={sectionIcons[section as keyof typeof sectionIcons]} style={{ marginRight: '10px' }} />
              {section}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.content}>
        {renderSection()}
      </div>
    </div>
  );
};

export default PropertyDetails;
