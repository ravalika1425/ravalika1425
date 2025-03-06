import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    CircularProgress,
    useMediaQuery,
} from '@mui/material';
import { createDispute } from '../services/Api/Dispute';
import styles from '../styles/DisputeFormdialogue.module.css';
import successImage from '../assetts/success-19.png';
import errorImage from '../assetts/coming-soon-img.png'; 
interface FormProps {
    open: boolean;
    onClose: () => void;
}

const FormDialog: React.FC<FormProps> = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile_number: '',
        problem_title: '',
        problem_description: '',
    });

    const [message, setMessage] = useState('');
    const [messageImage, setMessageImage] = useState('');
    const [messageOpen, setMessageOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true); // Show loading indicator
        const payload = {
            name: formData.name,
            email: formData.email,
            problem_title: formData.problem_title,
            problem_discription: formData.problem_description,
            mobile_number: parseInt(formData.mobile_number),
        };
        try {
            const response = await createDispute(payload);
            if (response.success) {
                setMessage("Dispute submitted successfully.");
                setMessageImage(successImage);
                setIsSuccess(true);
            } else {
                setMessage("Something went wrong. Please try again.");
                setMessageImage(errorImage);
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
            setMessageImage(errorImage);
            setIsSuccess(false);
        }
        setLoading(false); // Hide loading indicator
        setMessageOpen(true);
    };

    const handleMessageClose = () => {
        setMessageOpen(false);
        setMessage('');
        setMessageImage('');
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle className={styles.dialogTitle}>
                    Enter your Details
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', paddingTop: '15px' }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="name"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ marginBottom: '10px' }}
                            required
                        />
                        <TextField
                            margin="dense"
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ marginBottom: '10px' }}
                            required
                        />
                        <TextField
                            margin="dense"
                            name="mobile_number"
                            label="Phone Number"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.mobile_number}
                            onChange={handleChange}
                            style={{ marginBottom: '10px' }}
                            required
                        />
                        <TextField
                            margin="dense"
                            name="problem_title"
                            label="Problem Title"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.problem_title}
                            onChange={handleChange}
                            style={{ marginBottom: '10px' }}
                            required
                        />
                        <textarea
                            name="problem_description"
                            placeholder="Problem Description"
                            rows={4}
                            value={formData.problem_description}
                            onChange={handleChange}
                            style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <DialogActions style={{ padding: '16px' }}>
                            <Button onClick={onClose} style={{ color: 'black' }}>
                                Cancel
                            </Button>
                            <Button type="submit" style={{ color: 'white', backgroundColor: '#373636' }}>
                                Submit
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Loading Dialog */}
            <Dialog open={loading} onClose={() => {}}>
                <DialogContent style={{ textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography variant="body1" style={{ marginTop: '16px', width: '100%' }}>
                        Please wait, we are processing your data...
                    </Typography>
                </DialogContent>
            </Dialog>

            {/* Success/Error Message Dialog */}
            <Dialog open={messageOpen} onClose={handleMessageClose} PaperProps={{ style: { width: '30%' } }}>
                <DialogContent style={{ textAlign: 'center' }}>
                    <img src={messageImage} alt="status" style={{ width: '50%', height: '50%' }} />
                    <Typography style={{ marginTop: '10px' }}>{message}</Typography>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    {isSuccess ? (
                        <Button onClick={handleMessageClose} style={{ color: 'white', background: '#373636' }}>
                            OK
                        </Button>
                    ) : (
                        <>
                            <Button onClick={handleMessageClose} style={{ color: 'black', fontSize: isMobile? "5px":"",width:isMobile?"5px":""  }}>
                                OK
                            </Button>
                            <Button onClick={handleSubmit} style={{ color: 'white', background: '#373636', marginRight:isMobile?'20px':"", fontSize:isMobile? "5px":"", width:isMobile?"2px":"", height:isMobile?"5px":""
                             }}>
                                Try Again
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FormDialog;
