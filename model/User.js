const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

// User Schema
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
        default:
            'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png',
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
    refreshToken: [String],
    passwordChangedAt: Date,
});

// FullName Formatting
userSchema.pre('save', function (next) {
    this.name = this.name
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1) + ` `)
        .join('');

    next();
});

// Password Hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    next();
});

// Setting Password Changed Date To Document
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now();
    next();
});

// Method To Check Recent Password Change
userSchema.methods.hasChangedPasswordRecently = function (tokenIssuedAt) {
    if (this.passwordChangedAt) {
        const passwordChangedTime = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return passwordChangedTime > tokenIssuedAt;
    }
    return false;
};

// Password Checking
userSchema.methods.checkPassword = async (currentPassword, hashedPassword) => {
    return await bcrypt.compare(currentPassword, hashedPassword);
};

// Model
const User = mongoose.model('User', userSchema);

// Exports
module.exports = User;
