const mongoose = require("mongoose");  // for database connection
const Schema = mongoose.Schema; // for creating schema, schema means --> structure of the data


// creating schema
//It defines exactly what fields a "User" should have (name, email, password).
//It defines what type of data each field is (e.g., String, Number, Boolean).


//Why are we declaring true?
//required: true: This means this field is mandatory. If you try to create a user without a password, 
//the database will reject it and throw an error. It's like a "Required" field on a sign-up form.


//unique: true: This ensures no duplicates. For example, since email is set to unique: true, 
//if a second person tries to sign up with an email that is already in the database, 
//MongoDB will block them.


const UserSchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

})

// creating model, model means --> collection (table) in database
const UserModel = mongoose.model('users', UserSchema)

// exporting model
module.exports = UserModel