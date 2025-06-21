import {IconButton} from "@mui/material";
import {Edit, Trash2} from "lucide-react";
import React from "react";
import {Modal as AntModal} from "antd";
import {deleteRequest} from "../../../../api/index.js";
import {toast} from "react-toastify";
import {fetchData} from "../../../../api/fetchData.js";
import { Link } from "react-router-dom";

function DeviceTable({devices, setDevices}) {
    const handleDelete = async (deviceId) => {
        AntModal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this device?',
            onOk: async () => {
                try {
                    const response = await deleteRequest(`/device/${deviceId}`);
                    if (response.code === 200) {
                        toast.success('Device deleted successfully');
                        await  fetchData('/device', setDevices, null, null);
                    } else {
                        toast.error(response.message || 'Failed to delete device');
                    }
                } catch (error) {
                    console.error('Error deleting device:', error);
                    toast.error('An error occurred while deleting the device');
                }
            },
            onCancel() {
                console.log('Device deletion cancelled');
            },
        });
    };
    return (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
            <table className="min-w-full bg-white border-gray-300">
                <thead className='top-0 sticky'>
                <tr className="bg-gray-100 text-gray-600">
                    <th className="py-3 px-4 border-b">ID</th>
                    <th className="py-3 px-4 border-b">Embed ID</th>
                    <th className="py-3 px-4 border-b">Location</th>
                    <th className="py-3 px-4 border-b">Type</th>
                    <th className="py-3 px-4 border-b">Status</th>
                    <th className="py-3 px-4 border-b">Last seen</th>
                    <th className="py-3 px-4 border-b">Action</th>
                </tr>
                </thead>
                <tbody>
                {devices.map((device, index) => (
                    <tr key={device.device_id} className="hover:bg-gray-100 ">
                        <td className="py-2 px-4 border-b text-center">
                            {index + 1}
                        </td>
                        <td className="py-2 px-4 border-b text-center">{device.embed_id}</td>
                        <td className="py-2 px-4 border-b text-center">{device.location}</td>
                        <td className="py-2 px-4 border-b text-center">{device.type}</td>
                        <td
                            className="py-2 px-4 border-b text-center font-medium"
                            style={{color: device.status === 'online' ? 'green' : 'red'}}
                        >
                            {device.status}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                            {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-2 px-4 border-b text-center flex justify-between">
                            <Link to={`/device/${device.embed_id}`}>
                                <IconButton color="primary">
                                    <Edit size={18}/>
                                </IconButton>
                            </Link>
                            <IconButton color="error" onClick={() => handleDelete(device.device_id)}>
                                <Trash2 size={18}/>
                            </IconButton>
                        </td>

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default DeviceTable;