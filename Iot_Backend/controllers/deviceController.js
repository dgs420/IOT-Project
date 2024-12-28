const TrafficLog = require('../models/trafficLogModel');
const User = require('../models/userModel');
const RfidCard = require('../models/rfidCardModel');
const Device = require('../models/deviceModel');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const connectMqtt = require('../services/mqttService');
const client  = connectMqtt();

exports.createDevice = async (req, res) => {
    const { embed_id, location, type, status } = req.body;

    try {
        // Check if a device with the same embed_id already exists
        const existingDevice = await Device.findOne({ where: { embed_id } });
        if (existingDevice) {
            return res.status(400).json({
                code: 400,
                message: 'Device with this id already exists.',
            });
        }

        // Create the device
        const newDevice = await Device.create({
            embed_id,
            location,
            type,
            status: status || 'offline', // Default to 'offline' if not provided
        });

        res.status(200).json({
            code: 200,
            message: 'Device created successfully.',
            info: newDevice,
        });
    } catch (error) {
        console.error('Error creating device:', error);
        res.status(500).json({
            code: 500,
            error: 'Failed to create device.',
        });
    }
};



exports.getAllDevice = async (req, res) => {
    try {
        const devices = await Device.findAll();
        res.status(200).json({
            code: 200,
            message: 'Devices found',
            info: devices
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            error: 'Failed to retrieve logs' });
    }
};

// Get a single device by ID
exports.getDeviceById = async (req, res) => {
    const { deviceId } = req.params;

    try {
        const device = await Device.findByPk(deviceId);
        if (!device) {
            return res.status(404).json({
                code: 404,
                message: 'Device not found.',
            });
        }

        res.status(200).json({
            code: 200,
            message: 'Device retrieved successfully.',
            info: device,
        });
    } catch (error) {
        console.error('Error retrieving device:', error);
        res.status(500).json({
            code: 500,
            error: 'Failed to retrieve device.',
        });
    }
};

// Update a device
exports.updateDevice = async (req, res) => {
    const { deviceId } = req.params;
    const { location, type, status, last_seen } = req.body;

    try {
        const device = await Device.findByPk(deviceId);
        if (!device) {
            return res.status(404).json({
                code: 404,
                message: 'Device not found.',
            });
        }

        // Update device details
        await device.update({
            location: location || device.location,
            type: type || device.type,
            status: status || device.status,
            last_seen: last_seen || device.last_seen,
        });

        res.status(200).json({
            code: 200,
            message: 'Device updated successfully.',
            info: device,
        });
    } catch (error) {
        console.error('Error updating device:', error);
        res.status(500).json({
            code: 500,
            error: 'Failed to update device.',
        });
    }
};

// Delete a device
exports.deleteDevice = async (req, res) => {
    const { deviceId } = req.params;

    try {
        const device = await Device.findByPk(deviceId);
        if (!device) {
            return res.status(404).json({
                code: 404,
                message: 'Device not found.',
            });
        }

        // Delete the device
        await device.destroy();

        res.status(200).json({
            code: 200,
            message: 'Device deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting device:', error);
        res.status(500).json({
            code: 500,
            error: 'Failed to delete device.',
        });
    }
};

exports.commandDevice =async (req,res) =>{
    const { embed_id, command } = req.body;

    try {
        const device = await Device.findOne({ where: { embed_id } });
        if (!device) {
            return res.status(404).json({
                code: 404,
                message: 'Device not found.',
            });
        }
        if (!embed_id || !command) {
            return res.status(400).json({
                code: 400,
                message:'embed_id and command are required' });
        }

        // Publish command using the existing MQTT connection
        const topic = `barrier/${command}/response/${embed_id}`;
        const payload = JSON.stringify({ status: 'valid', message: command });

        client.publish(topic, payload, (err) => {
            if (err) {
                console.error(`[COMMAND] Failed to send command to device ${embed_id}:`, err.message);
                return res.status(500).json({ code: 500, message: 'Failed to send command' });
            }

            console.info(`[COMMAND] Command sent to device ${embed_id}:`, payload);
            res.status(200).json({ code: 200, message: 'Command sent successfully' });
        });
    } catch (error) {
        console.error('Error deleting device:', error);
        res.status(500).json({
            code: 500,
            error: 'Failed to delete device.',
        });
    }
}