const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    if (err.message && err.message.includes('Images only!')) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    if (err.name === 'MulterError') {
         return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
