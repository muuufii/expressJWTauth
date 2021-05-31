const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true, 'Please an enter email'],
        unique : true,
        dropDups: true,
        lowercase : true,
        validate : [ isEmail   , 'Please an enter valid email']
    },
    password : {
        type : String,
        required : [true, 'Please an enter password'],
        minLength : [6, 'Minimum password length is 6 characters']
    }
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email })
    if (user) {
       const auth = await bcrypt.compare(password, user.password)
       if (auth) {
           return user;
       }
       throw Error('incorrect password')
    }
    throw Error('incorrect email');
}

userSchema.plugin(uniqueValidator);

const User = mongoose.model('user' , userSchema);

module.exports = User;