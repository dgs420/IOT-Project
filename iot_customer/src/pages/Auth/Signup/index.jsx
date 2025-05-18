import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';
import {toast} from "react-toastify";
import {postRequest} from "../../../api/index.js";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setSnackbarOpen(true);
            return;
        }

        try {
            const response = await postRequest('/auth/signup', {
                email,
                password,
                first_name: firstName,
                last_name: lastName
            });
            console.log(response);
            if (response.code !== 200) {
                toast.error(response.message);
                throw new Error(response.message);
            } else {
                window.location.href = '/login';
            }
            // if(response.code === 200) {
            //     window.location.href = '/login';
            //     // resetForm();
            // }
            // Redirect user to a dashboard or protected route
        } catch (error) {
            setError(error.message);
            toast.error(error);


        }
        // Proceed with signup, using username, email, and password
        // Reset fields after successful signup (for demo purposes)
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setConfirmPassword('');
        setError('');
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        setError('');
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, bgcolor: '#f5f5f5', borderRadius: 2, marginTop: 10 }}>
            <Typography variant="h5" component="h1" gutterBottom>
                Create Account
            </Typography>
            <form onSubmit={handleSignup} className='flex flex-col'>
                <TextField
                    type='email'
                    label='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                <TextField
                    type='password'
                    label='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                <TextField
                    type='text'
                    label='First Name'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                <TextField
                    type='text'
                    label='Last Name'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                <TextField
                    type='password'
                    label='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    sx={{ mt: 2 }}
                    fullWidth
                >
                    Sign Up
                </Button>
            </form>
            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Signup;