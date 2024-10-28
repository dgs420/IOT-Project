// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

// const exampleLogs = [
//     {
//       log_id: 27,
//       card_id: 5,
//       time: '2024-10-25T15:33:38.000Z',
//       action: 'exit',
//       rfid_card: {
//         card_number: 'RFID0001',
//         vehicle_number: 'ABC123',
//         vehicle_type: 'car',
//         user: {
//           user_id: 1,
//           username: 'jdoe',
//         },
//       },
//     },
//     // Additional log entries here...
//   ];
// const fetchTrafficLogs = async () => {
//   return [
//     {
//       log_id: 27,
//       card_id: 5,
//       time: '2024-10-25T15:33:38.000Z',
//       action: 'exit',
//       rfid_card: {
//         card_number: 'RFID0001',
//         vehicle_number: 'ABC123',
//         vehicle_type: 'car',
//         user: {
//           user_id: 1,
//           username: 'jdoe',
//         },
//       },
//     },
//
//   ];
// };

export const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // const getTrafficLog = async () => {
    //   const data = await fetchTrafficLogs();// Replace with API call to fetch logs
    //   setLogs(data);
    // };
    const getTrafficLogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/logs/all-logs-details'); // Adjust URL as needed
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        const data = await response.json();
        setLogs(data); // Set the fetched data to the logs state
      } catch (error) {
        console.error('Error fetching traffic logs:', error);
      }
    };

    getTrafficLogs();
    setInterval(getTrafficLogs, 8000)

  }, []);
  return (
    <div className="overflow-x-auto h-96">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg">
          <thead className='top-0 sticky'>
            <tr className="bg-gray-100 text-gray-600">
              <th className="py-3 px-4 border-b">Log ID</th>
              <th className="py-3 px-4 border-b">Card ID</th>
              <th className="py-3 px-4 border-b">Time</th>
              <th className="py-3 px-4 border-b">Action</th>
              <th className="py-3 px-4 border-b">Card Number</th>
              <th className="py-3 px-4 border-b">Vehicle Number</th>
              <th className="py-3 px-4 border-b">Vehicle Type</th>
              <th className="py-3 px-4 border-b">User ID</th>
              <th className="py-3 px-4 border-b">Username</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.log_id} className="hover:bg-gray-100 ">
                <td className="py-2 px-4 border-b text-center">{log.log_id}</td>
                <td className="py-2 px-4 border-b text-center">{log.card_id}</td>
                <td className="py-2 px-4 border-b text-center">{new Date(log.time).toUTCString()}</td>
                <td className="py-2 px-4 border-b text-center">{log.action}</td>
                <td className="py-2 px-4 border-b text-center">{log.rfid_card.card_number}</td>
                <td className="py-2 px-4 border-b text-center">{log.rfid_card.vehicle_number}</td>
                <td className="py-2 px-4 border-b text-center">{log.rfid_card.vehicle_type}</td>
                <td className="py-2 px-4 border-b text-center">{log.rfid_card.user.user_id}</td>
                <td className="py-2 px-4 border-b text-center">{log.rfid_card.user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};
