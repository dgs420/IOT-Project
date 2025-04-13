import {Box, Button, Container, Grid2, Typography} from '@mui/material';

import { Link } from 'react-router-dom';

export const ForbiddenPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Container maxWidth='md'>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={6}>
                        <Typography variant='h1'>403</Typography>
                        <Typography variant='h6'>
                            You are not suppose to be here
                        </Typography>
                        <Link to='/login'>
                            <Button variant='contained'>Go back</Button>
                        </Link>
                    </Grid2>
                    <Grid2 item xs={6}>
                        <img
                            src='https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg'
                            alt=''
                            width={500}
                            height={250}
                        />
                    </Grid2>
                </Grid2>
            </Container>
        </Box>
    );
};
