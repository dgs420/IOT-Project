import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import Layout from "./components/shared/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Statistics from "./pages/Statistics";
import PersonalProfile from "./pages/PersonalProfile.jsx";
import UserList from "./pages/UserList.jsx";
import UserDetail from "./pages/UserDetail.jsx";

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
        </Route>
        <Route path="/login" element={<Login/>}>
        </Route>
      </Routes>
    </Router>
  );
}

