const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    userId: {
        type: String, 
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: false, 
    },
    type: {
        type: String, 
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const NotificationModel =
    mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

module.exports = NotificationModel;