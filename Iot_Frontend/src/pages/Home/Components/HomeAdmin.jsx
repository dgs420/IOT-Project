import React, { useEffect, useState } from "react";
import VehiclesPieChart from "./VehiclesPieChart.jsx";
import {
  Car,
  Users,
  ClipboardList,
  DollarSign,
  LogOut,
  LogIn,
} from "lucide-react";
import { Card, CardContent } from "@mui/material";
import { Link } from 'react-router-dom';
import ActivityLog from "./ActivityLog.jsx";
import { io } from "socket.io-client";
import { fetchData } from "../../../api/fetchData.js";

const HomeAdmin = () => {
  const [homeData, setHomeData] = useState({
    pending_requests: 0,
    total_vehicles: 0,
    vehicles_in: 0,
    vehicles_exited: 0,
    traffic_today: 0,
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // Replace with your backend URL
    setSocket(newSocket);
    void fetchData("/home", setHomeData, null, null);
    // const socketInstance = io('http://localhost:5000'); // Adjust the URL as needed
    // setSocket(socketInstance);
    const handleMqttMessage = () => {
      void fetchData("/home", setHomeData, null, null); // Call your function here
    };

    // Listen for mqttMessage events
    newSocket.on("mqttMessage", handleMqttMessage);
    return () => {
      newSocket.off("mqttMessage", handleMqttMessage);
      newSocket.disconnect();
    };
  }, []);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          {
            title: "UNRESOLVED REQUESTS",
            value: homeData.pending_requests,
            icon: Car,
            link: "/users-requests",
          },
          {
            title: "TOTAL VEHICLES REGISTERED",
            value: homeData.total_vehicles,
            icon: Car,
            link: "/vehicles",
          },
          {
            title: "VEHICLES IN",
            value: homeData.vehicles_in,
            icon: LogIn,
            link: "/details",
          },
          {
            title: "VEHICLES OUT",
            value: homeData.vehicles_exited,
            icon: LogOut,
            link: "/details",
          },
          {
            title: "PARKING DONE TODAY",
            value: homeData.traffic_today,
            icon: ClipboardList,
            link: "/report",
          },
        ].map((item, index) => (
          <Link to={item.link} key={index} className="block hover:no-underline">
            <Card className="h-full transition-all duration-200 hover:shadow-lg cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="mb-2">
                  <item.icon className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-4xl font-bold mb-2">{item.value}</h2>
                <p className="text-sm text-gray-500 text-center">
                  {item.title}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <VehiclesPieChart />
        </div>
        <div className="col-span-2 ">
          {socket && <ActivityLog socket={socket} />}
          {/*<ActivityLog/>*/}
        </div>
      </div>
    </>
  );
};

export default HomeAdmin;
