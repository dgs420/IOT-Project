import React from "react";
import { Box, Button, Container, Grid2, Typography } from "@mui/material";

import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
            <Typography variant="h1">404</Typography>
            <Typography variant="h6">
              The page you’re looking for doesn’t exist.
            </Typography>
            <Link to="/">
              <Button variant="contained">Back Home</Button>
            </Link>
          </Grid2>
          <Grid2 item xs={6}>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
              alt=""
              width={500}
              height={250}
            />
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};
