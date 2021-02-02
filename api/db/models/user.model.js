const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

//JWT Secret
const jwtsecret = "82469460864e9mfrztt37rk8fazquj4063259127"

const userSchema = new mongoose.Schema({
    _User_Name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },

    _Password: {
        type: String,
        required: true,
        minlength: 8
    },

    _Sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }],

    _Emp_Name: {
        type: String,
        required: true
    },

    _Emp_Addr: {
        type: String,
        required: true
    },

    _Emp_Phone: {
        type: String,
        required: true
    },

    _Emp_Email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },

    _Skill_Name_1: {
        type: String,
        required: true
    },

    _Skill_Name_2: {
        type: String,
        required: false
    },

    _Skill_Name_3: {
        type: String,
        required: false
    },

    _Leave_StartDate: {
        type: Date,
        required: false
    },

    _Leave_EndDate: {
        type: Date,
        required: false
    },

});

//Instance Methods

userSchema.methods.toJSON = function() {
    const user = this; 
    const userObject = user.toObject();   

    //return document except passwords and sessions.
    return _.omit(userObject, ['_Password', '_Sessions']);
}



userSchema.methods.generateAccessAuthToken =  function() {
    const user = this;
    return new Promise((resolve, reject) => {
        //Create web token and return it.
        jwt.sign({_id: user._id.toHexString() }, jwtsecret, { expiresIn: "15m" }, (err, token) => {
            if (!err) 
            {
                resolve(token);
            } 
            else 
            {
                //Error occurs, so will reject.
                reject();
            }
        });
    })
}



userSchema.methods.generateRefreshAuthToken = function() {
    //Generate 64byte hex string that is not saved in the database.
    //saveSessionToDatabase() will save refresh token in database.
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err)
            {
                let token = buf.toString('hex');
                return resolve(token);
            }
            else 
            {
                reject();
            }
        });
    })
}



userSchema.methods.createSession = function() {
    let user = this;
    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        //Session is saved to database.
        //Return the session.
        return refreshToken;
    }).catch((e)=> {
        return Promise.reject('Failed to save session to database.\n' + e);
    })
}



/* MODEL METHODS (static methods) */

userSchema.statics.getJWTSecret = () => {
    return jwtsecret;
}


//Model Methods (Static methods). Can be called on the object directly.
userSchema.statics.findByIdAndToken = function(_id, token) {
    //Find user based on id and token.
    //Used in authentication middleware (verifySession).
    const User = this;
    return User.findOne({
        _id,
        '_Sessions.token': token
    });
}

userSchema.statics.findById = function(_id) {
    //Find user based on id.
    //Used to find 1 user.
    const User = this;
    return User.findOne({
        _id
    });
}

userSchema.statics.findByCredentials = function(_User_Name, _Password) {
    let User = this;
    return User.findOne({ _User_Name }).then((user) => {
        if (!user) return Promise.reject();
        
        return new Promise((resolve, reject) => {
            bcrypt.compare(_Password, user._Password, (err, res) => {
                if (res) resolve(user);
                else
                { 
                    reject();
                }
            })
        })
    })
}



userSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000;
    if (expiresAt > secondsSinceEpoch) {
        return false; //Has not expired.
    }
    else 
    {
        return true; //Has expired.
    }
}



//Middleware

userSchema.pre('save', function(next) {
    let user = this;
    let costFactor = 10;
    if ( user.isModified('_Password'))
    {
        //If password has been changed, run this code.
        //Generate salt and generate password.
        bcrypt.genSalt(costFactor, (err, salt) => {
            bcrypt.hash(user._Password, salt, (err, hash) => {
                user._Password = hash;
                next();
            });
        })
    }
    else
    {
        next();
    }
})


//Helper Methods.

let saveSessionToDatabase = (user, refreshToken) => {
    //Save session to database.
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();
        user._Sessions.push({ 'token': refreshToken, expiresAt });
        user.save().then(() => {
            //Save the session.
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        });
    })
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24 * 60 * 60));
    return ((Date.now() / 1000) + secondsUntilExpire);
}


const User = mongoose.model('User', userSchema);

module.exports = { User }