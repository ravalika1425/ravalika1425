import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import { getProperty, updateProperty } from '../../services/Api/Property';
import { useParams } from 'react-router-dom';


const EditPropertyForm = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        property_name: '',
        property_type: '',
        description: '',
        features: '',
        address: '',
        price: '',
        floors: '',
        plots_per_floor: '',
        approved_by: '',
        size: '',
        facing: '',
        near_by_places: '',
        negotiable: '',
        images: [],
    });

    useEffect(() => {
        if (!id)
            return;
        getProperty(id)
            .then(property => {
                const updatedProperty = {
                    ...property,
                    property_type: property.property_type || '',
                    negotiable: property.negotiable || '',
                    description: property.description || '',
                    features: property.features || '',
                    address: property.address || '',
                    price: property.price || '',
                    floors: property.floors || '',
                    plots_per_floor: property.plots_per_floor || '',
                    approved_by: property.approved_by || '',
                    size: property.size || '',
                    facing: property.facing || '',
                    near_by_places: property.near_by_places || '',
                    images: property.images || [],
                };
                setFormData(updatedProperty);
            }).catch(error => {
                console.error('Error fetching property:', error);
            });
    }, [id]);

    const packFiles = (fileList: FileList): string[] => {
        return Array.from(fileList).map(file => file.name);
    };

    const handleChange = (event: any) => {
        const { name, type, value, files } = event.target;

        if (type === 'file' && files) {
            const fileNames = packFiles(files);
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: fileNames,
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        // updateProperty(id || '', formData).then(response => {
        //     console.log(response);
        //     alert('Property Updated Successfully');
        // }).catch(error => {
        //     console.error('Error updating property:', error);
        // });
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
            <form onSubmit={handleSubmit}>
                {/* Property Owner */}
                <TextField
                    label="Property Owner"
                    name="property_name"
                    value={formData.property_name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* Property Type */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Property Type</InputLabel>
                    <Select
                        name="property_type"
                        value={formData.property_type}
                        onChange={handleChange}
                        label="Property Type"
                    >
                        <MenuItem value="INDIVIDUAL">INDIVIDUAL</MenuItem>
                        <MenuItem value="OPENPLOTS">OPENPLOTS</MenuItem>
                        <MenuItem value="APARTMENTS">APARTMENTS</MenuItem>
                        <MenuItem value="VILLAS">VILLAS</MenuItem>
                        <MenuItem value="FORMLANDS">FORMLANDS</MenuItem>
                        <MenuItem value="COMMERCIAL">COMMERCIAL</MenuItem>
                    </Select>
                </FormControl>

                {/* Description */}
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                />

                {/* Features */}
                <TextField
                    label="Features"
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                />

                {/* Address */}
                <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                />

                {/* Price */}
                <TextField
                    label="Price"
                    name="price"
                    // type="number"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* Floors */}
                <TextField
                    label="Floors"
                    name="floors"
                    type="number"
                    value={formData.floors}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* Plots per Floor */}
                <TextField
                    label="Plots per Floor"
                    name="plots_per_floor"
                    type="number"
                    value={formData.plots_per_floor}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* Approved By */}
                <TextField
                    label="Approved By"
                    name="approved_by"
                    value={formData.approved_by}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* Size */}
                <TextField
                    label="Size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* Facing */}
                <TextField
                    label="Facing"
                    name="facing"
                    value={formData.facing}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* Near By Places */}
                <TextField
                    label="Near By Places"
                    name="near_by_places"
                    value={formData.near_by_places}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                {/* Negotiable */}
                {/* <FormControlLabel 
                control={<Checkbox checked={formData.negotiable} onChange={handleChange} name="negotiable" />}
                label="Negotiable"
            /> */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Negotiable</InputLabel>
                    <Select
                        name="negotiable"
                        value={formData.negotiable}
                        onChange={handleChange}
                        label="Negotiable"
                    >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                    </Select>
                </FormControl>

                {/* Images */}
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    name="images"
                    onChange={handleChange}
                />
                <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span" style={{ margin: '10px 0' }}>
                        Upload Images
                    </Button>
                </label>
                <Button type="submit" variant="contained" color="primary">
                    Update Property
                </Button>
            </form>
        </Box>
    );
};

export default EditPropertyForm;
