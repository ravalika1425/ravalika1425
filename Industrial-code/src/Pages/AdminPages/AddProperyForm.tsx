import React, { SelectHTMLAttributes, useEffect, useState } from 'react';
import { FormControlLabel, Checkbox, makeStyles } from '@material-ui/core';
import { createProperty } from '../../services/Api/Property';
import Box from '@mui/material/Box';
import axios from 'axios';
import styles from '../../styles/AddProperty.module.css';
import { useNavigate } from 'react-router-dom';
import { Close } from '@mui/icons-material';
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Paper,
  CircularProgress,
  Backdrop
} from '@mui/material';


interface FormData {
  about_owner: string;
  address: string;
  approved_by: string;
  approved_no: string;
  brochure: File[];
  description: string;
  facing: string;
  features: string;
  floors: string;
  id: string;
  images: File[];
  is_active: boolean;
  logo: File[];
  near_by_places: string;
  negotiable: string;
  owner_email: string;
  owner_phone_no: string;
  price: string;
  property_name: string;
  property_owner_name: string;
  property_status: string;
  property_type: string;
  site_visiting_images: File[];
  size: string;
  status: string;
  views: number;
  village?: string;
  mandal?: string;
  district?: string;
  ec_document?: File[];
  documents?: File[];
  other_documents?: File[];
}

// const routeTo = (e: any) => {
//   navigate(e)
// }

const AddPropertyForm: React.FC = () => {
  let user
  const userItem = localStorage.getItem('user')
  if (userItem) {
    user = JSON.parse(userItem);
  }
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    about_owner: '',
    address: '',
    approved_by: '',
    approved_no: '',
    description: '',
    facing: '',
    features: '',
    floors: '',
    id: '66',
    is_active: true,
    near_by_places: '',
    negotiable: '',
    owner_email: user.email,
    owner_phone_no: user.mobile_number,
    price: '',
    property_name: '',
    property_owner_name: user.name,
    property_status: '',
    property_type: '',
    site_visiting_images: [],
    logo: [],
    images: [],
    brochure: [],
    ec_document: [],
    documents: [],
    other_documents: [],
    size: '',
    status: '',
    views: 0,
    village: '',
    mandal: '',
    district: ''
  });
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = (event: any) => {
    const { name, type, files, value } = event.target;
    console.log(type)
    if (type === "file" && files) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: Array.from(files),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    console.log(formData)
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const userItem = localStorage.getItem('user')
    let user
    if (userItem) {
      user = JSON.parse(userItem)
    }
    try {
      const propertyData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((file) => propertyData.append(key, file));
        } else {
          propertyData.append(key, value as string | Blob);
        }
      });

      const response = await createProperty(user.id, propertyData);
      if (response.success) {
        alert("Property Added Successfully");
        const userItem = localStorage.getItem('user')

        if (userItem) {
          const user = JSON.parse(userItem);
          if (user.role === "ADMIN") {
            navigate('/adminhome')
          }
          else {
            navigate('/user-profile')
          }
        }
      }
      // console.log("response", response);
    } catch (error) {
      setLoading(false);
      console.error("There was a problem with the axios operation:", error);
    }
  };

  const property_type = {
    INDIVIDUAL: "INDIVIDUAL",
    OPENPLOTS: "OPENPLOTS",
    APARTMENTS: "APARTMENTS",
    VILLAS: "VILLAS",
    // COMMERCIAL: "COMMERCIAL",
    FORMLANDS: "FORMLANDS"
  };
  // console.log("FormData after file upload:", formData);

  const handeleCancel = () => {
    const userItem = localStorage.getItem('user')

    if (userItem) {
      const user = JSON.parse(userItem);
      if (user.role === "ADMIN") {
        navigate('/adminhome')
      }
      else {
        navigate('/user-profile')
      }

    }

  }
 
  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto', marginTop: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" component="h1" gutterBottom>
          Add Property
        </Typography>
        <button type="button" color="error" style={{ border: "none", background: "transparent", cursor: "pointer" }} onClick={handeleCancel}>
          <Close />
        </button>

      </Box>

      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 1301 }}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>Submitting...</Typography>
      </Backdrop>

      <form onSubmit={handleSubmit} method="POST">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Property Name"
                name="property_name"
                value={formData.property_name}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Property Owner Name"
                name="property_owner_name"
                value={formData.property_owner_name}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Owner Email"
                name="owner_email"
                type="email"
                value={formData.owner_email}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Owner Phone No"
                name="owner_phone_no"
                type="tel"
                value={formData.owner_phone_no}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="About Owner"
                name="about_owner"
                value={formData.about_owner}
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Approved By"
                name="approved_by"
                value={formData.approved_by}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Approved No"
                name="approved_no"
                value={formData.approved_no}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Village"
                name="village"
                value={formData.village}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Mandal"
                name="mandal"
                value={formData.mandal}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Facing"
                name="facing"
                value={formData.facing}
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Amenities"
                name="features"
                value={formData.features}
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Floors"
                name="floors"
                value={formData.floors}
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Near By Places"
                name="near_by_places"
                value={formData.near_by_places}
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Negotiable"
                name="negotiable"
                value={formData.negotiable}
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="property-status-label">Property Status</InputLabel>
              <Select
                labelId="property-status-label"
                id="property-status"
                name="property_status"
                value={formData.property_status}
                onChange={handleChange}
                required
              >
                <MenuItem value="READYTOOCCUPY">READYTOOCCUPY</MenuItem>
                <MenuItem value="UNDERCONSTRUCTION">UNDERCONSTRUCTION</MenuItem>
                <MenuItem value="PRELUNCHEVENT">PRELUNCHEVENT</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="property-type-label">Property Type</InputLabel>
              <Select
                labelId="property-type-label"
                id="property-type"
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                required
              >
                {Object.entries(property_type).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
                <MenuItem value="SOLD">SOLD</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography>Logo of the Property(Display Image)</Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                name="logo"
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleChange}
                fullWidth
              />

            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography>Map Images</Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                name="images"
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography>Brochure</Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                name="brochure"
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleChange}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography>Site Visiting Images</Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                name="site_visiting_images"
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography>Property Ec_Document</Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                name="ec_document"
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleChange}
                fullWidth
              // required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography>Property permission Documents</Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                name="documents"
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleChange}
                fullWidth
              // required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography>Property Registration Documents</Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                name="other_documents"
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleChange}
                fullWidth
                required
              />
            </FormControl>
          </Grid>
          <Typography variant="body1" style={{ color: 'red', marginTop: '20px' }}>
            Note: Please ensure that all the uploaded documents are accurate and complete. Incomplete or incorrect submissions may delay the approval process.
          </Typography>
          <Typography variant="body1" style={{ color: 'red', marginTop: '20px' }}>
            Note: If you upload all the required details, we will verify them with our sources to determine if the property has any disputes or court cases.Once verified, the property will be approved, and the post will be published.

          </Typography>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button type="submit" variant="contained" color="primary">
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
              </Button>
              {/* <Button type="button" variant="contained" color="secondary" style={{ marginLeft: "40px" }} onclick={handleClear}>
                Clear
              </Button> */}
              <Button type="button" variant="contained" color="error" style={{ marginLeft: "40px" }} onClick={handeleCancel}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddPropertyForm;



