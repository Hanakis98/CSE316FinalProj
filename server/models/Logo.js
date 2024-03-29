var mongoose = require('mongoose');

var LogoSchema = new mongoose.Schema({
  id: String,
  userEmail: {type: String, default: "GUEST"},
  backgroundColor: String,
  borderColor: String,
  height: {type: Number, min: 50, max: 2000},
  width: {type: Number, min: 50, max: 2000},
  borderWidth: { type: Number, min: 0, max: 100 },
  borderRadius: { type: Number, min: 0, max: 100 },
  padding: { type: Number, min: 0, max: 100 },
  margin: { type: Number, min: 0, max: 100 }, 
  texts: [{
    text: String,
    color: String,
    fontSize: { type: Number, min: 2, max: 144 },
    x: {type: Number},
    y: {type: Number}
  }],
  images: [{
    src: {type: String},
    width: {type: Number},
    height: {type: Number},
    x: {type: Number},
    y: {type: Number}
  }],

  lastUpdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Logo', LogoSchema);