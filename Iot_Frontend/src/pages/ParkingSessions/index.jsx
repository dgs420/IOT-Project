import React, {useEffect, useState} from "react"
import {Alert, Box} from "@mui/material"
// import { getParkingSessions, exportSessionsToCSV } from "../../api/parkingSessionApi"
import {calculateDuration} from "../../utils/formatters.js"
import ParkingSessionFilters from "./components/ParkingSessionFilter.jsx"
import ParkingSessionTable from "./components/ParkingSessionTable.jsx"
import {getRequest} from "../../api/index.js";
import PageContentHeader from "../../common/components/PageContentHeader.jsx";

const ParkingSessions = () => {
    const [sessions, setSessions] = useState([])
    const [filteredSessions, setFilteredSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [paymentFilter, setPaymentFilter] = useState("all")

    const [sortConfig, setSortConfig] = useState({
        field: "entry_time",
        direction: "desc",
    })


    useEffect(() => {
        loadParkingSessions()
    }, [])

    useEffect(() => {
        applyFiltersAndSort()
    }, [sessions, searchQuery, statusFilter, paymentFilter, sortConfig])

    const loadParkingSessions = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await getRequest("/session");
            if (response.code === 200) {
                setSessions(response.info)
            } else {
                throw new Error(response.message || "Failed to fetch parking sessions")
            }
        } catch (err) {
            console.error("Error loading parking sessions:", err)
            setError("Failed to load parking sessions. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const applyFiltersAndSort = () => {
        let result = [...sessions]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (session) =>
                    (session.Vehicle?.vehicle_number?.toLowerCase()?.includes(query)) || session.session_id.toString().includes(query),
            )
        }

        if (statusFilter !== "all") {
            result = result.filter((session) => session.status === statusFilter)
        }

        if (paymentFilter !== "all") {
            result = result.filter((session) => session.payment_status === paymentFilter)
        }

        result.sort((a, b) => {
            let valueA, valueB

            switch (sortConfig.field) {
                case "fee":
                    valueA = a.fee ? Number.parseFloat(a.fee) : 0
                    valueB = b.fee ? Number.parseFloat(b.fee) : 0
                    break
                case "duration":
                    valueA = calculateDuration(a)
                    valueB = calculateDuration(b)
                    break
                default:
                    valueA = a[sortConfig.field]
                    valueB = b[sortConfig.field]
            }

            if (valueA === null) return sortConfig.direction === "asc" ? -1 : 1
            if (valueB === null) return sortConfig.direction === "asc" ? 1 : -1

            if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1
            if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1
            return 0
        })

        setFilteredSessions(result)
    }


    const handleSort = (field) => {
        setSortConfig((prevConfig) => ({
            field,
            direction: prevConfig.field === field && prevConfig.direction === "desc" ? "asc" : "desc",
        }))
    }


    return (
        <Box>
            <PageContentHeader
                label="Parking Sessions"
                description="View and manage parking sessions"
                className="mb-4"
                

            />

            <ParkingSessionFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                paymentFilter={paymentFilter}
                setPaymentFilter={setPaymentFilter}
                onRefresh={loadParkingSessions}
                loading={loading}
                hasData={filteredSessions.length > 0}
            />

            {error && (
                <Alert severity="error" sx={{mb: 3}}>
                    {error}
                </Alert>
            )}

            <ParkingSessionTable
                sessions={filteredSessions}
                loading={loading}
                sortConfig={sortConfig}
                onSort={handleSort}/>
        </Box>
    )
}

export default ParkingSessions
