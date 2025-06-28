// @ts-nocheck
import React, { useEffect, useState } from "react";
import VehiclesPieChart from "./VehiclesPieChart.jsx";
import { Car, ClipboardList, LogOut, LogIn, Space, Microchip,ParkingSquare } from "lucide-react";
import { Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import ActivityLog from "./ActivityLog.jsx";
import { fetchData } from "../../../api/fetchData.js";
import useUserStore from "../../../store/useUserStore.js";
import { EventSourcePolyfill } from "event-source-polyfill";
import { OnlinePrediction } from "@mui/icons-material";

const HomeAdmin = () => {
  const [homeData, setHomeData] = useState({
    user_count: 0,
    pending_requests: 0,
    total_vehicles: 0,
    vehicles_in: 0,
    vehicles_exited: 0,
    traffic_today: 0,
    total_spaces: 0,
    devices_count: 0,
    online_devices_count: 0,
  });
  const [latestActivityEvent, setLatestActivityEvent] = useState(null);

  const { token } = useUserStore((state) => state);

  useEffect(() => {
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

        void fetchData("/home", setHomeData, null, null);

        const data = JSON.parse(event.data);

        if (data.type === "ACTIVITY_LOG") {
          setLatestActivityEvent(data.payload.data);
        }
        console.log("Device SSE received:", data);
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        // eventSource.close();
      };
    }

    void fetchData("/home", setHomeData, null, null);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [token]);

  useEffect(() => {
    void fetchData("/home", setHomeData, null, null);
  }, []);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          // {
          //   title: "USERS",
          //   value: homeData.user_count,
          //   icon: User,
          //   link: "/users-list",
          // },
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
          {
            title: "PARKING SPACES",
            value: homeData.total_spaces,
            icon: ParkingSquare,
            link: "/parking-spaces",
          },
          {
            title: "TOTAL DEVICES",
            value: homeData.devices_count,
            icon: Microchip,
            link: "/device",
          },
          {
            title: "DEVICES ONLINE",
            value: homeData.online_devices_count,
            icon: OnlinePrediction,
            link: "/device",
          }
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
          {<ActivityLog latestActivityEvent={latestActivityEvent}/>}
          {/*<ActivityLog/>*/}
        </div>
      </div>
    </>
  );
};

export default HomeAdmin;
