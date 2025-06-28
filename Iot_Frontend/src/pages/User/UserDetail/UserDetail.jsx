// UserDetail.jsx - Main component
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Paper, Tab, Tabs } from "@mui/material";
import { getRequest } from "../../../api/index.js";
import UserDetailsForm from "./components/UserDetailsForm";
import TransactionsTable from "../../../common/components/TransactionsTable.jsx";
import { UserLog } from "./components/UserLog.jsx";
import UserVehiclesList from "./components/UserVehiclesList.jsx";

const UserDetail = () => {
  const { user_id } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [tabIndex, setTabIndex] = useState(0);

  const fetchUserDetail = async () => {
    try {
      const response = await getRequest(`/user/user-detail/${user_id}`);
      if (response.code === 200) {
        setUserDetails(response.info);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [user_id]);

  return (
    <>
      <UserDetailsForm
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        userId={user_id}
        onUpdate={fetchUserDetail}
      />

      <Paper sx={{ mb: 4, boxShadow: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          centered
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Registered vehicles" />
          <Tab label="User Logs" />
          <Tab label="Transactions" />
        </Tabs>

        {tabIndex === 0 && <UserVehiclesList userId={user_id} />}

        {tabIndex === 1 && <UserLog userId={user_id} />}

        {tabIndex === 2 && <TransactionsTable embedId={""} userId={user_id}/>}
      </Paper>
    </>
  );
};

export default UserDetail;
