import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Grid, Input, Typography } from "@mui/material";
import { getRequest, postRequest } from "../../../../api/index.js";
import { toast } from "react-toastify";
import { CustomButton } from "@/common/components/CustomButton.jsx";
// import { CustomButton } from "../../../../common/components/CustomButton.jsx";

const DeviceDetails = ({ embedId }) => {
  const [deviceDetails, setDeviceDetails] = useState({
    embed_id: "",
    name: "",
    type: "",
    status: "",
    last_seen: "",
  });
  const fetchDeviceDetails = async () => {
    try {
      const response = await getRequest(`/device/embed/${embedId}`);
      // const data = await response.json();
      if (response.code === 200) {
        setDeviceDetails(response.info);
      } else console.error(response.message);
    } catch (error) {
      console.error("Error:", error.response.data.message);
    }
  };
  const handleDeviceCommand = async (command) => {
    try {
      const response = await postRequest(`/device/command`, {
        embed_id: deviceDetails.embed_id,
        command,
      });
      if (response.code === 200) {
        toast.success(response.message);
        console.log(`Command "${command}" sent successfully.`);
      } else {
        toast.error(response.message);
        console.error(`Failed to send command: ${response.message}`);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchDeviceDetails();
  }, [embedId]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Device Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/*<Box sx={{ display: "flex", justifyContent: "space-between" }}>*/}
          {/*    <Typography variant="body2" color="text.secondary">*/}
          {/*        Device ID:*/}
          {/*    </Typography>*/}
          {/*    <Typography variant="body2">{deviceDetails?.id || deviceId}</Typography>*/}
          {/*</Box>*/}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Status:
            </Typography>
            <Typography
              style={{
                color: deviceDetails.status === "online" ? "green" : "red",
              }}
              variant="body2"
            >
              {deviceDetails?.status || "Unknown"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Type:
            </Typography>
            <Typography variant="body2">
              {deviceDetails?.type || "Standard"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Last Active:
            </Typography>
            <Typography variant="body2">
              {deviceDetails.last_seen
                ? new Date(deviceDetails.last_seen).toLocaleString()
                : "N/A"}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Action
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Name:
            </Typography>
            <Input placeholder="email" value={deviceDetails.location} />
          </Box>
          <Button type="submit" className="bg-green-500 hover:bg-green-600">
            Submit
          </Button> */}
          <CustomButton
            // type="submit"
            className="w-full justify-center"
            color = "success"
            onClick={() => handleDeviceCommand("enter")}
            title={"Open Enter"}

          />
           <CustomButton
            // type="submit"\
            className="w-full justify-center"

            color = "warning"
            onClick={() => handleDeviceCommand("exit")}
            title={"Open Exit"}

          />
        </Box>
      </Grid>

    </Grid>
  );
};

export default DeviceDetails;
