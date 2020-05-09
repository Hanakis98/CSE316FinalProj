var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  id:  String,
  email:  {
    index: true,
    unique: true,  // copies of emails in db should never be allowed
    type:String 
  },
  password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);