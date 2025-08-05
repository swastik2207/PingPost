const express = require('express')
const router = express.Router()

const { checkUsernameUnique, getUserAvatar, editUser, getUserByUsername, saveUserinMongo, getUserbyEmail } = require('../controllers/user-controller')

router.get('/', (req, res) => {
    res.json({ message: 'User API is working!' });
});
  

router
    .route('/check-username-unique')
    .get(checkUsernameUnique)

router
    .route('/edit-user')
    .post(editUser)

router
    .route('/get-user-by-username')
    .get(getUserByUsername)

router
    .route('/save-user-in-mongo')
    .post(saveUserinMongo)

router
    .route('/get-user-by-email')
    .get(getUserbyEmail)

router
    .route('/get-avatar')
    .get(getUserAvatar)
router
    .route('/profile')
    .get(getUserByUsername)
    
module.exports = router
