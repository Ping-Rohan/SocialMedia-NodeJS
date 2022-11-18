const mongoose = require('mongoose');
const validator = require('validator');

// user schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name Cannot Be Empty'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email Cannot Be Empty'],
        unique: true,
        validate: [validator.isEmail, 'Email Is Not Valid'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password Cannot Be Empty'],
        validate: [
            validator.isStrongPassword,
            `Password Must Fulfill These Criteria :- 1) At Least 8 characters , 2) 1 Lowercase Letter , 3) 1 Uppercase Letter , 4) 1 Special Symbol , 5) 1 Number`,
        ],
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Your Password'],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'Password Doesnot Match',
        },
    },
    dob: {
        type: Date,
        required: [true, 'Enter Your DOB'],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'others'],
        required: [true, 'Select Your Gender'],
    },
    profilePicture: {
        type: String,
        default: 'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    following: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    ],
    followers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    ],
});

// hooks
userSchema.pre('save', function (next) {
    this.name = this.name
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1) + ` `)
        .join('');

    next();
});

// model
const User = mongoose.model('User', userSchema);

// exports
module.exports = User;
