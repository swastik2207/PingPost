const UserModel = require('../model/User')


const checkUserbyUsername = async (req, res) => {
    try {
        const {username} = req.body
        const userExist = await UserModel.findOne({username})
        if(userExist){
            return res.status(200).json({
                success: true,
                message: 'User already exists',
            })
        }
        return res.status(404).json({
            success: false,
            message: 'User does not exist',
        })

    } catch (error) {
        return res.status(500).json({
            success: true,
            message: 'Something went wrong'
        })
    }
}

const checkUserbyEmail = async (req, res) => {
    try {
        const { email} = req.body
        const userExist = await UserModel.findOne({email})
        if(userExist){
            return res.status(200).json({
                success: true,
                message: 'User already exists',
            })
        }
        return res.status(404).json({
            success: false,
            message: 'User does not exist',
        })

    } catch (error) {
        return res.status(500).json({
            success: true,
            message: 'Something went wrong'
        })
    }
}



module.exports = {checkUserbyUsername, checkUserbyEmail}