const bcrypt = require('bcrypt')
const UserModel = require('../Models/user')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists", success: false });
        }

        const newUser = new UserModel({ name, email, password });
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();

        return res.status(201).json({ message: "User created successfully", success: true });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errMsg = "Invalid email or password";
        if (!user) {
            return res.status(403).json({ message: errMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: errMsg, success: false });
        }




         //{email: user.email, _id: user._id} is the data that will be stored in the token
        //process.env.JWT_SECRET is the secret key for the token
        //{ expiresIn: '24h' } is the expiration time for the token
        //{} --> take the payload data and sign the token with the secret key and return the token
        //{ email: user.email, _id: user._id } is the payload data
        //process.env.JWT_SECRET is the secret key for the token
        //{ expiresIn: '24h' } is the expiration time for the token
        //{ email: user.email, _id: user._id } is the payload data
        //process.env.JWT_SECRET is the secret key for the token
        //{ expiresIn: '24h' } is the expiration time for the token
        //{ email: user.email, _id: user._id } is the payload data
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },

            //secret key for the token and the secret key is stored in the .env file
            process.env.JWT_SECRET,
            //expiration time for the token and the expiration time is stored in the .env file
            { expiresIn: '24h' }
        )

        return res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports = { signup, login }