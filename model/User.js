const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const CommentSchema = new Schema({
    commentId: {
        type: String,
        required: true
    },
    commentor: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})


const PostSchema = new Schema({
    postid: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: '',
    },
    imageUrl: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    comments: [CommentSchema],
    likes: {
        type: [String],
        default: []
    }
})



const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dgxeg3sju/image/upload/v1737842141/user-icon_y3afda.avif',
    },
    about: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address']
    },
    isVerified: {
        type: Boolean,
        required: [true, 'Verification is required'],
    },
    posts: [PostSchema],
    // stories: [StorySchema]
})


const UserModel = mongoose.models.User || mongoose.model('User', UserSchema)
module.exports = UserModel