const express = require('express');
const app = express();
const bodyparser = require('body-parser'); //body-parse is used to parse the body of the request, means it is used to get the data from the request
const cors = require('cors')
require('dotenv').config();  //Load env variables from the config file
const PORT = process.env.PORT || 8080;
require('./Models/db');
const AuthRouter = require('./Router/AuthRouter');
const ProductRouter = require('./Router/ProductRouter');
const ContentRouter = require('./Router/ContentRouter');

app.get("/ping", (req, res) => {
    res.send("pong");
})

//Using the middleware and we are using the JSON Format 
app.use(bodyparser.json())
//CORS --> Cross Origin Resource Sharing, it is used to allow the frontend to access the backend
app.use(cors());
app.use('/uploads', express.static('uploads'));

//ROUTER
app.use('/api/auth', AuthRouter);
app.use('/api/products', ProductRouter);
app.use('/api/content', ContentRouter);
app.listen(PORT, () => {
    console.log(`Server Online on port ${PORT}`);
})