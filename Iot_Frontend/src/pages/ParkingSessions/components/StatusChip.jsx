import { Chip } from "@mui/material"
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"

// Component for displaying status with appropriate styling
const StatusChip = ({ status, type = "status" }) => {
    // Get icon component based on icon name
    const getIconComponent = (iconName, size = 16) => {
        switch (iconName) {
            case "check-circle":
                return <CheckCircle2 size={size} />
            case "x-circle":
                return <XCircle size={size} />
            case "clock":
                return <Clock size={size} />
            case "alert-circle":
            default:
                return <AlertCircle size={size} />
        }
    }

    // Get chip properties based on status type
    const getChipProps = () => {
        if (type === "payment") {
            switch (status) {
                case "paid":
                    return { color: "success", icon: "check-circle" }
                case "unpaid":
                    return { color: "error", icon: "x-circle" }
                case "pending":
                    return { color: "warning", icon: "clock" }
                default:
                    return { color: "default", icon: "alert-circle" }
            }
        } else {
            // Default status type
            switch (status) {
                case "active":
                    return { color: "primary", icon: "clock" }
                case "completed":
                    return { color: "success", icon: "check-circle" }
                default:
                    return { color: "default", icon: "alert-circle" }
            }
        }
    }

    const { color, icon } = getChipProps()
    const iconComponent = getIconComponent(icon)

    return <Chip icon={iconComponent} label={status} size="small" color={color} sx={{ textTransform: "capitalize" }} />
}

export default StatusChip
