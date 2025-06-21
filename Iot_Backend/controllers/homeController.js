const homeService = require('../services/homeService');

exports.getHomeCount = async (req, res) => {
    try {
        const counts = await homeService.getHomeCounts();
        res.status(200).json({
            code: 200,
            message: 'Home counts retrieved successfully.',
            info: counts
        });
    } catch (error) {
        console.error('Error fetching home counts:', error);
        res.status(500).json({ code: 500, message: 'Internal server error' });
    }
};

exports.getVehicleCountsByType = async (req, res) => {
    try {
        const vehicleCounts = await homeService.getVehicleCountsByType();
        res.status(200).json({
            code: 200,
            message: 'Vehicle counts by type retrieved successfully.',
            info: vehicleCounts
        });
    } catch (error) {
        console.error('Error fetching vehicle counts by type:', error);
        res.status(500).json({ code: 500, message: 'Internal server error' });
    }
};
