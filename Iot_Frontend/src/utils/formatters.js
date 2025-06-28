export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

export const calculateDuration = (session) => {
    if (!session.entry_time) return 0

    const start = new Date(session.entry_time)
    const end = session.exit_time ? new Date(session.exit_time) : new Date()

    return Math.ceil((end - start) / (1000 * 60))
}

// Format duration for display
export const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    return `${hours}h ${remainingMinutes}m`
}


// Get status chip properties
export const getStatusChipProps = (status) => {
    switch (status) {
        case "active":
            return { color: "primary", icon: "clock" }
        case "completed":
            return { color: "success", icon: "check-circle" }
        default:
            return { color: "default", icon: "alert-circle" }
    }
}

// Get payment status chip properties
export const getPaymentChipProps = (status) => {
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
}