const Joi = require('joi');
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const signupValidation = (req, res, next) => {

    //what does it do 
    // it is used to validate the data coming from the frontend is correct or not like 
    // name should be string and minimum 3 characters and maximum 100 characters and required 
    // email should be string and email format and required 
    // password should be string and minimum 4 characters and maximum 100 characters and required 
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@(gmail\\.com|yahoo\\.com|rocketmail\\.com|yahoo\\.net|ymail\\.com|zohocorp\\.com)$')).required(),
        // Regex Pattern: Minimum 8 characters, at least one letter and one number
        password: Joi.string()
            .min(8)
            .max(100)
            .pattern(passwordPattern)
            .required()
            .messages({
                'string.pattern.base': 'Password must be at least 8 characters and contain at least one letter and one number.',
                'any.required': 'Password is required.'
            })
    });

    //if the data is not valid then it will return an error
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
        //400 --> is consider as Bad Request
        return res.status(400).json({
            message: "Bad Request",
            error: error.details.map((detail) => detail.message)
        })
    }
    //why we use next here?
    //next() is used to pass the request to the next middleware or controller
    //example: if the data is valid then it will pass the request to the next middleware or controller
    next();
}

const loginValidation = (req, res, next) => {

    const schema = Joi.object({
        email: Joi.string().email().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@(gmail\\.com|yahoo\\.com|rocketmail\\.com|yahoo\\.net|ymail\\.com|zohocorp\\.com)$')).required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: "Bad Request",
            error: error.details.map((detail) => detail.message)
        });
    }
    next();
}

module.exports = {
    signupValidation,
    loginValidation
}
