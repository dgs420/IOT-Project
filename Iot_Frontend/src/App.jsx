import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import Layout from "./layout/index.jsx";
import Home from "./pages/Home/index.jsx";
import Login from "./pages/Login/index.jsx";
import Statistics from "./pages/Statistics/index.jsx";
import PersonalProfile from "./pages/PersonalProfile/index.jsx";
import UserList from "./pages/UserList/UserList.jsx";
import UserDetail from "./pages/UserDetail/UserDetail.jsx";
import DeviceList from "./pages/Device/DeviceList/index.jsx";
import DeviceDetail from "./pages/Device/DeviceDetail/index.jsx";
import Report from "./pages/Report/index.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<p> users</p>} />
          <Route path="details" element={<Statistics/>} />
          <Route path="settings" element={<p> settings</p>} />
          <Route path="about" element={<p> about</p>} />
          <Route path="profile" element={<PersonalProfile />} />
          <Route path="users-list" element={<UserList />} />
          <Route path="user/:user_id" element={<UserDetail />} />
          <Route path="device" element={<DeviceList />} />
          <Route path="device/:deviceId" element={<DeviceDetail />} />
          <Route path="report" element={<Report />} />

        </Route>
        <Route path="/login" element={<Login/>}>
        </Route>
      </Routes>
    </Router>
  );
}

