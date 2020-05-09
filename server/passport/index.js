const passport = require('passport')
const LocalStrategy = require('./localStrategy')
const User = require('../models/User')

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
	done(null, { _id: user._id,
	email: user.email
	})
})

// user object attaches to the request as req.user
passport.deserializeUser((user, done) => {
	console.log('DeserializeUser called');
	User.findOne(
		{ email: user.email },
		(err, user) => {
			console.log('*** Deserialize user, user:')
			console.log(user)
			console.log('--------------')
			done(null, user)
		}
	)
})

//  Use Strategies 
passport.use(LocalStrategy)

module.exports = passport