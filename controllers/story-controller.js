
const UserStoriesModel = require('../model/Stories')


const getStories = async (req, res) => {
    try {
        const users = await UserStoriesModel.find({})

        // // console.log('calling for get stories from user stories model: ', users)

        let allStories = users.map(user => {
            // // console.log('Mapping user: ', user); // Log each user during mapping

            return {
                username: user.username,
                name: user.name,
                avatar: user.avatar, // Check if the avatar field is here
                stories: user.stories.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort stories
            };
        });

        // Sort users by the latest story timestamp (descending order)
        allStories = allStories
            .filter(user => user.stories.length > 0) // Exclude users with no stories
            .sort((a, b) => new Date(b.stories[0].timestamp) - new Date(a.stories[0].timestamp)) // Sort by latest story


        if (allStories.every(user => user.stories.length === 0)) {
            return res.status(200).json({
                success: true,
                message: 'No stories available',
                stories: []
            })
        }

        // // console.log('this is allstories: ', allStories)

        return res.status(200).json({
            success: true,
            message: 'Got the stories',
            stories: allStories
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

const postStory = async (req, res) => {
    try {
        const { username, storyid, imageUrl, timestamp } = req.body
        const user = await UserStoriesModel.findOne({ username })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        user.stories.push({ id: storyid, url: imageUrl, timestamp })
        await user.save()

        return res.status(201).json({
            success: true,
            message: 'Story added'
        })

    } catch (error) {
        // console.log(error)

        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const deleteStory = async (req, res) => {
    try {
        const { username, storyid } = req.body
        const user = await UserStoriesModel.findOne({ username })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        user.stories = user.stories.filter(story => story.id !== storyid)
        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Story deleted successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}


module.exports = { getStories, postStory, deleteStory }
