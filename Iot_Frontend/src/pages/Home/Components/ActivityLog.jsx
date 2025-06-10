import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@mui/material";
import { fetchData } from "../../../api/fetchData.js";

const ActivityLog = ({ latestActivityEvent }) => {
  const [events, setEvents] = useState([]); // State to store MQTT events

  useEffect(() => {
    if (latestActivityEvent) {
      setEvents((prev) => [latestActivityEvent, ...prev.slice(0, 10)]);
    }
  }, [latestActivityEvent]);

  useEffect(() => {
    void fetchData("/logs/all-logs", setEvents);
  }, []);
  return (
    <Card className="shadow-lg rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Recent Activity</h2>
        <div className="border rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Embed ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Vehicle Number
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Action
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700 font-medium">
                      <Link to={`/device/${event?.embed_id ?? "unknown"}`}>
                        {event?.embed_id ?? "N/A"}
                      </Link>
                    </td>
                    {/*<td className="px-4 py-2 text-sm text-gray-700">{event?.card_number ?? 'N/A'}</td>*/}
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {event?.vehicle_number ?? "N/A"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          event?.action?.includes("enter")
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {event?.action ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {/*{console.log('Event details:', event.details)}*/}
                      <span
                        className={`text-sm ${
                          event?.is_valid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {event?.details ?? "No details"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-2 text-gray-500 text-center"
                  >
                    No events received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
