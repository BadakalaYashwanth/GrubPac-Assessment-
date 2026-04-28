const jwt = require('jsonwebtoken');

const ensureauthenticated = (req, res, next) => {
    const auth = req.headers.authorization;
    if(!auth){
        return res.status(403).json({ message: "Forbidden", success: false });
    }
    try{
        const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : auth;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(403).json({ message: "Forbidden", success: false });
    }
}

const ensureRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions", success: false });
        }
        next();
    }
}

module.exports = {
    ensureauthenticated,
    ensureRole
}