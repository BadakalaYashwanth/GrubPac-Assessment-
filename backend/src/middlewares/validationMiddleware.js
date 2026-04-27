const Joi = require('joi');
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: error.details.map((detail) => detail.message)
            });
        }
        next();
    };
};

const schemas = {
    signupSchema: Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(8)
            .max(100)
            .pattern(passwordPattern)
            .required()
            .messages({
                'string.pattern.base': 'Password must be at least 8 characters and contain at least one letter and one number.',
                'any.required': 'Password is required.'
            }),
        role: Joi.string().valid('teacher', 'principal').optional()
    }),
    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    uploadContentSchema: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        subject: Joi.string().required(),
        startTime: Joi.date().iso().required(),
        endTime: Joi.date().iso().greater(Joi.ref('startTime')).required().messages({
            'date.greater': 'End time must be greater than start time.'
        }),
        durationMinutes: Joi.number().positive().required()
    }),
    approveRejectSchema: Joi.object({
        status: Joi.string().valid('approved', 'rejected').required(),
        rejectionReason: Joi.alternatives().conditional('status', {
            is: 'rejected',
            then: Joi.string().required().messages({
                'any.required': 'Rejection reason is mandatory when status is rejected'
            }),
            otherwise: Joi.string().optional().allow(null, "")
        })
    })
};

module.exports = { validateRequest, schemas };
