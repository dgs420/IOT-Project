import React, {useState} from 'react';
import {Alert, Box, Button, Paper, Snackbar, TextField, Typography} from '@mui/material';
import {toast} from "react-toastify";
import {postRequest} from "../../../api/index.js";
import {Person} from '@mui/icons-material';
import {CustomButton} from "../../../Common/Components/CustomButton.jsx";

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
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}
        >

            <Paper
                elevation={24}
                sx={{
                    maxWidth: 500,
                    width: '100%',
                    p: 4,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Box sx={{textAlign: 'center', mb: 4}}>
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                        }}
                    >
                        <Person sx={{color: 'white', fontSize: 32}}/>
                    </Box>
                    <Typography variant="h5" component="h1" sx={{fontWeight: 10, color: '#2d3748', mb: 1}}>
                        Create Account
                    </Typography>
                </Box>
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
                    {error && <Typography color="error" variant="body2" sx={{mt: 1}}>{error}</Typography>}
                    <CustomButton
                        type='submit'
                        className='w-full mt-4 items-center justify-center'
                    >
                        Sign Up
                    </CustomButton>
                </form>
                <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    );
};

export default Signup;