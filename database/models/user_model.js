const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
        // bcrypt: true
    }
})

// UserSchema.plugin(require('mongoose-bcrypt'))

const UserModel = mongoose.model("user", UserSchema)

module.exports = { UserModel, UserSchema }
