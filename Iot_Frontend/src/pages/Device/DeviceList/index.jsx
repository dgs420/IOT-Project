// @ts-nocheck
import React, { useEffect, useState } from "react";
import { fetchData } from "../../../api/fetchData.js";
import NewDeviceModal from "./components/NewDeviceModal.jsx";
import PageContentHeader from "../../../common/components/PageContentHeader.jsx";
import { Box, IconButton } from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import DeviceTable from "./components/DeviceTable.jsx";
import useUserStore from "../../../store/useUserStore.js";
import { EventSourcePolyfill } from "event-source-polyfill";

function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const { uid, token } = useUserStore((state) => state);

  useEffect(() => {
    void fetchData("/device", setDevices, null, null);
    let eventSource;

    if (token) {
      eventSource = new EventSourcePolyfill(
        `${import.meta.env.VITE_BASE_URL}/api/sse/device-notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Connecting SSE");

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "DEVICE_STATUS") {
          setDevices((prevDevices) =>
            prevDevices.map((device) =>
              device.embed_id === message?.payload?.data.embed_id
                ? { ...device, status: message?.payload?.data.status }
                : device
            )
          );
        }
        console.log("Device SSE received:", message);
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
      };
    }
  }, [token]);
  return (
    <Box>
      <PageContentHeader
        label="Devices"
        description={"Manage all registered devices"}
        buttonLabel="Add Device"
        onClick={handleModalOpen}
        className={"mb-4"}
      />
      <DeviceTable devices={devices} setDevices={setDevices} />
      <NewDeviceModal
        open={openModal}
        onClose={handleModalClose}
        onSuccess={() => void fetchData("/device", setDevices, null, null)}
      />
    </Box>
  );
}

export default DeviceList;
