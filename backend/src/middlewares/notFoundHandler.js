const notFoundHandler = (req, res, next) => {
    return res.status(404).json({
        success: false,
        message: `Resource Not Found - ${req.originalUrl}`
    });
};

module.exports = { notFoundHandler };
