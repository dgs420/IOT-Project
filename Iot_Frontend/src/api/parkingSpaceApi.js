// Mock API functions for parking spaces

import { toast } from "react-toastify"
import { deleteRequest, postRequest, putRequest } from "."
import { fetchData } from "./fetchData"

// Get all parking spaces
export const getParkingSpaces = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
        code: 200,
        message: "Parking space information fetched successfully.",
        info: [...mockParkingSpaces],
    }
}

// Create a new parking space
export const createParkingSpace = async (spaceData) => {
    const res = await postRequest('/parking-spaces/create',spaceData)
    if (res.code !== 200) {
        toast.error(res.message)
    } else {
        // void fetchData("/parking-spaces",setSpaces);
        toast.success("Created successfully");
    }
}

export const updateParkingSpace = async (spaceData) => {
    const res = await putRequest('/parking-spaces/update',spaceData)
    if (res.code !== 200) {
        toast.error(res.message)
    } else {
        toast.success("Updated successfully");
    }
}

// Delete a parking space
export const deleteParkingSpace = async (space_id) => {
    const res = await deleteRequest('/parking-spaces/delete',space_id)
    if (res.code !== 200) {
        toast.error(res.message)
    } else {
        // void fetchData("/parking-spaces",setSpaces);
        toast.success("Updated successfully");
    }
}
