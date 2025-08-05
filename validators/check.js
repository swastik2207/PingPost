const { z } = require('zod')

const nameValidation = z
    .string()
    .min(3, 'Name must be atleast 3 characters')

const usernameValidation = z
    .string()
    .min(6, 'Username must be atleast 6 character')
    .max(14, 'Username must be not more than 14 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must not contain special character')
    .regex(/^\S*$/, 'Username must not contain white spaces')

const emailValidation = z
    .string()
    .email()

module.exports = { usernameValidation, emailValidation, nameValidation}