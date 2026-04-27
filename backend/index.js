const express = require('express');
const app = express();
const bodyparser = require('body-parser'); //body-parse is used to parse the body of the request, means it is used to get the data from the request
const cors = require('cors')
require('dotenv').config();  //Load env variables from the config file
const PORT = process.env.PORT || 8080;
require('./Models/db');
const AuthRouter = require('./Router/AuthRouter') // Importing the router
const ProductRouter = require('./Router/ProductRouter')

app.get("/ping", (req, res) => {
    res.send("pong");
})

//Using the middleware and we are using the JSON Format 
app.use(bodyparser.json())
//CORS --> Cross Origin Resource Sharing, it is used to allow the frontend to access the backend
app.use(cors())
//ROUTER
app.use('/auth', AuthRouter) // Using the router
//Product Router --> 
app.use('/products', ProductRouter)
app.listen(PORT, () => {
    console.log(`Server Online on port ${PORT}`);
})