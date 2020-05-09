const User = require('../models/User')
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
	{
		usernameField: 'email' // not necessary, DEFAULT
	},
	function(email, password, done) {
		User.findOne({ email: email }, (err, user) => {
			if (err) {
				return done(err)
			}
			if (!user) {
				return done(null, false, { message: 'The email you provided does not belong to an account.' })
			}
			if (user.password != password) {
				return done(null, false, { message: 'The password you entered does not match our records.' })
			}
			return done(null, user)
		})
	}
)

module.exports = strategy