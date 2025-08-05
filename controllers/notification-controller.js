const NotificationModel = require('../model/NotificationModel');

// Get notifications for a user
const getNotifications = async (req, res) => {
    try {
        const uid = req.headers['uid'];
        const notifications = await NotificationModel.find({ userId: uid }).sort({ timestamp: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// Mark all as seen
const markAllSeen = async (req, res) => {
    try {
        const uid = req.headers['uid'];
        await NotificationModel.updateMany({ userId: uid, seen: false }, { $set: { seen: true } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark notifications as seen' });
    }
};

// Delete notification
const deleteNotification = async (req, res) => {
    try {
        await NotificationModel.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};

// ✅ Create and emit real-time notification
const createNotification = async (req, res) => {
    try {
        const { userId, senderId, message } = req.body;

        const newNotification = new NotificationModel({
            userId,
            senderId,
            message,
            timestamp: new Date(),
            seen: false
        });

        const savedNotification = await newNotification.save();

        // Emit using Socket.IO
        const io = req.app.get('io');
        const connectedUsers = req.app.get('connectedUsers');

        const socketId = connectedUsers.get(userId);
        if (socketId) {
            io.to(socketId).emit('notification', savedNotification);
        }

        res.status(201).json(savedNotification);
    } catch (err) {
        console.error('Notification error:', err);
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

module.exports = {
    getNotifications,
    markAllSeen,
    deleteNotification,
    createNotification, // ✅ Export this
};