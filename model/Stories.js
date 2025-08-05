const mongoose = require('mongoose')

const {Schema} = require('mongoose')


const StorySchema = new Schema({
    id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
})


const UserStoriesSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    stories: {
        type: [StorySchema],
        default: []
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dgxeg3sju/image/upload/v1737842141/user-icon_y3afda.avif",
    }
})

const UserStoriesModel = mongoose.models.UserStories || mongoose.model('UserStories', UserStoriesSchema)
module.exports = UserStoriesModel