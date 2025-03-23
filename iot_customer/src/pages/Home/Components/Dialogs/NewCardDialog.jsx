"use client"

import React, { useState } from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Divider,
    IconButton,
    Alert,
    CircularProgress,
    Grid, Grid2,
} from "@mui/material"
import {
    Close,
    DirectionsCar,
    CreditCard,
    LocalShipping,
    TwoWheeler,
    Business,
    Person,
    Home,
    CheckCircle,
    ArrowForward,
    ArrowBack,
    Info,
} from "@mui/icons-material"
import { toast } from "react-toastify"
import {postRequest} from "../../../../api/index.jsx";

// Card type definitions with additional info
const card_types = [
    {
        value: "standard",
        label: "Standard",
        description: "Basic access to all parking facilities",
        icon: <CreditCard />,
        color: "#1976d2",
    },
    {
        value: "premium",
        label: "Premium",
        description: "Priority parking and extended hours",
        icon: <CreditCard />,
        color: "#9c27b0",
    },
    {
        value: "business",
        label: "Business",
        description: "Multiple vehicle support and billing options",
        icon: <Business />,
        color: "#2e7d32",
    },
]

// Vehicle type definitions with icons
const vehicle_types = [
    { value: "car", label: "Car", icon: <DirectionsCar /> },
    { value: "bike", label: "Motorcycle", icon: <TwoWheeler /> },
    { value: "truck", label: "Truck", icon: <LocalShipping /> },
]

export default function NewCardDialog({ open, onClose }) {
    // Form state
    const [activeStep, setActiveStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        card_type: "standard",
        vehicle_number: "",
        vehicle_type: "car",
        delivery_address: "",
        name: "",
        contact_number: "",
    })
    const [errors, setErrors] = useState({})

    // Steps for the stepper
    const steps = ["Card Details", "Vehicle Information", "Delivery Information"]

    // Handle form field changes
    const handleChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        })

        // Clear error for this field if it exists
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: null,
            })
        }
    }

    // Validate current step
    const validateStep = () => {
        const newErrors = {}

        if (activeStep === 0) {
            // No validation needed for card type
        } else if (activeStep === 1) {
            if (!formData.vehicle_number.trim()) {
                newErrors.vehicle_number = "Vehicle number is required"
            } else if (!/^[A-Z0-9-]{3,10}$/i.test(formData.vehicle_number.trim())) {
                newErrors.vehicle_number = "Please enter a valid vehicle number"
            }
        } else if (activeStep === 2) {
            if (!formData.name.trim()) {
                newErrors.name = "Full name is required"
            }

            if (!formData.contact_number.trim()) {
                newErrors.contact_number = "Contact number is required"
            } else if (!/^\d{10,15}$/.test(formData.contact_number.replace(/\D/g, ""))) {
                newErrors.contact_number = "Please enter a valid contact number"
            }

            if (!formData.delivery_address.trim()) {
                newErrors.delivery_address = "Delivery address is required"
            } else if (formData.delivery_address.trim().length < 10) {
                newErrors.delivery_address = "Please enter a complete address"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle next step
    const handleNext = () => {
        if (validateStep()) {
            setActiveStep((prevStep) => prevStep + 1)
        }
    }

    // Handle back step
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1)
    }

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateStep()) {
            return
        }

        setLoading(true)

        try {
            // Simulate API call
            // await new Promise((resolve) => setTimeout(resolve, 1500))
            const response = await postRequest('/request/create-request',formData);
            // Show success message
            console.log(response);
            if (response.code === 200) {
                toast.success("Card request submitted successfully!");
                setFormData({
                    card_type: "standard",
                    vehicle_number: "",
                    vehicle_type: "car",
                    delivery_address: "",
                    name: "",
                    number: "",
                });
                setActiveStep(0);
                onClose();
            }
            else{
                toast.error(response.message);
            }

            // Reset form and close dialog
            // setFormData({
            //     cardType: "standard",
            //     vehicleNumber: "",
            //     vehicleType: "car",
            //     deliveryAddress: "",
            //     fullName: "",
            //     contactNumber: "",
            // })
            // setActiveStep(0)
            // onClose()
        } catch (error) {
            toast.error("Failed to submit card request. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Reset form when dialog closes
    const handleDialogClose = () => {
        if (!loading) {
            setActiveStep(0)
            setErrors({})
            onClose()
        }
    }

    // Render step content
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                            Select Card Type
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            {card_types.map((type) => (
                                <Grid item xs={12} key={type.value}>
                                    <Paper
                                        elevation={formData._type === type.value ? 3 : 1}
                                        sx={{
                                            p: 2,
                                            cursor: "pointer",
                                            borderLeft: 4,
                                            borderColor: formData.card_type === type.value ? type.color : "transparent",
                                            bgcolor: formData.card_type === type.value ? `${type.color}10` : "background.paper",
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                bgcolor: `${type.color}10`,
                                            },
                                        }}
                                        onClick={() => setFormData({ ...formData, card_type: type.value })}
                                    >
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Box display="flex" alignItems="center">
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: "50%",
                                                        bgcolor: `${type.color}20`,
                                                        color: type.color,
                                                        mr: 2,
                                                    }}
                                                >
                                                    {type.icon}
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                        {type.label}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {type.description}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {formData.card_type === type.value && <CheckCircle sx={{ color: type.color }} />}
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 3, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                            <Box display="flex" alignItems="flex-start">
                                <Info sx={{ color: "info.main", mr: 1, mt: 0.5 }} />
                                <Typography variant="body2" color="info.main">
                                    Card processing fee may apply depending on the card type. Standard cards have a $5 processing fee,
                                    Premium cards have a $10 fee, and Business cards have a $15 fee.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )
            case 1:
                return (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                            Vehicle Information
                        </Typography>

                        <TextField
                            label="Vehicle Number"
                            fullWidth
                            value={formData.vehicle_number}
                            onChange={handleChange("vehicle_number")}
                            error={Boolean(errors.vehicle_number)}
                            helperText={errors.vehicle_number || "Enter your vehicle license plate number"}
                            sx={{ mt: 2, mb: 3 }}
                            placeholder="e.g., ABC-123"
                        />

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Vehicle Type</InputLabel>
                            <Select label="Vehicle Type" value={formData.vehicle_type} onChange={handleChange("vehicle_type")}>
                                {vehicle_types.map((type) => (
                                    <MenuItem value={type.value} key={type.value}>
                                        <Box display="flex" alignItems="center">
                                            {React.cloneElement(type.icon, { sx: { mr: 1, fontSize: 20 } })}
                                            {type.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ mt: 2, p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
                            <Box display="flex" alignItems="flex-start">
                                <Info sx={{ color: "warning.main", mr: 1, mt: 0.5 }} />
                                <Typography variant="body2" color="warning.main">
                                    Make sure the vehicle information matches your registration documents. Incorrect information may delay
                                    your card processing.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )
            case 2:
                return (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                            Delivery Information
                        </Typography>

                        <TextField
                            label="Full Name"
                            fullWidth
                            value={formData.name}
                            onChange={handleChange("name")}
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                            sx={{ mt: 2, mb: 3 }}
                            InputProps={{
                                startAdornment: <Person sx={{ mr: 1, color: "action.active" }} />,
                            }}
                        />

                        <TextField
                            label="Contact Number"
                            fullWidth
                            value={formData.contact_number}
                            onChange={handleChange("contact_number")}
                            error={Boolean(errors.contact_number)}
                            helperText={errors.contact_number}
                            sx={{ mb: 3 }}
                            placeholder="e.g., 123-456-7890"
                        />

                        <TextField
                            label="Delivery Address"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.delivery_address}
                            onChange={handleChange("delivery_address")}
                            error={Boolean(errors.delivery_address)}
                            helperText={errors.delivery_address || "Enter your complete address including city and zip code"}
                            InputProps={{
                                startAdornment: <Home sx={{ mr: 1, mt: 1, color: "action.active" }} />,
                            }}
                        />
                    </Box>
                )
            default:
                return (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                        <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Review Your Request
                        </Typography>

                        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
                            <Grid2 container spacing={2}>
                                <Grid2 item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Card Type
                                    </Typography>
                                    <Typography variant="body1">{card_types.find((t) => t.value === formData.card_type)?.label}</Typography>
                                </Grid2>
                                <Grid2 item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Vehicle Type
                                    </Typography>
                                    <Typography variant="body1">
                                        {vehicle_types.find((t) => t.value === formData.vehicle_type)?.label}
                                    </Typography>
                                </Grid2>
                                <Grid2 item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid2>
                                <Grid2 item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Vehicle Number
                                    </Typography>
                                    <Typography variant="body1">{formData.vehicle_number}</Typography>
                                </Grid2>
                                <Grid2 item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Full Name
                                    </Typography>
                                    <Typography variant="body1">{formData.name}</Typography>
                                </Grid2>
                                <Grid2 item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        Delivery Address
                                    </Typography>
                                    <Typography variant="body1">{formData.delivery_address}</Typography>
                                </Grid2>
                                <Grid2 item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        Contact Number
                                    </Typography>
                                    <Typography variant="body1">{formData.contact_number}</Typography>
                                </Grid2>
                            </Grid2>
                        </Paper>

                        <Alert severity="info" sx={{ mt: 3 }}>
                            Your card will be processed within 1-2 business days and delivered to the address provided.
                        </Alert>
                    </Box>
                )
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: "hidden",
                },
            }}
        >
            <DialogTitle
                sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box display="flex" alignItems="center">
                    <CreditCard sx={{ mr: 1 }} />
                    <Typography variant="h6">Request a New Parking Card</Typography>
                </Box>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleDialogClose}
                    disabled={loading}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.1)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3, pb: 1 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {activeStep === steps.length ? (
                    getStepContent(activeStep)
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Fill in the details to request a new parking card. Processing may take 1-2 business days.
                        </Typography>

                        {getStepContent(activeStep)}
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, bgcolor: "background.default" }}>
                {activeStep === steps.length ? (
                    <>
                        <Button onClick={handleBack} disabled={loading} startIcon={<ArrowBack />}>
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            endIcon={loading ? <CircularProgress size={16} /> : <CheckCircle />}
                        >
                            {loading ? "Submitting..." : "Confirm & Submit"}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={handleDialogClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />
                        {activeStep > 0 && (
                            <Button onClick={handleBack} disabled={loading} startIcon={<ArrowBack />}>
                                Back
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            onClick={activeStep === steps.length - 1 ? () => setActiveStep(steps.length) : handleNext}
                            disabled={loading}
                            endIcon={<ArrowForward />}
                        >
                            {activeStep === steps.length - 1 ? "Review" : "Next"}
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    )
}

