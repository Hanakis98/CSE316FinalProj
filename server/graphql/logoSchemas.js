var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var LogoModel = require('../models/Logo');
var UserModel = require("../models/User");


var userType = new GraphQLObjectType({
    name: "user",
    fields: function(){
        return {
    
            _id: {
                type: GraphQLString
            },
    
            email: {
                type: GraphQLString
            },
            password: {
                type: GraphQLString
            },
    
        }
    }
    });


var logoType = new GraphQLObjectType({
    name: 'logo',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            userEmail:{
                type: GraphQLString
            },
            text: {
                type: GraphQLString
            },
            color: {
                type: GraphQLString
            },
            fontSize: {
                type: GraphQLInt
            },
            backgroundColor: {
                type: GraphQLString
            },
            borderColor: {
                type: GraphQLString
            },
            borderWidth: {
                type: GraphQLInt
            },
            borderRadius: {
                type: GraphQLInt
            },
            padding: {
                type: GraphQLInt
            },
            margin: {
                type: GraphQLInt
            },
            lastUpdate: {
                type: GraphQLDate
            }
        }
    }
});




var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {

            users: {
                type: new GraphQLList(userType),
                resolve: function() {
                    const users = UserModel.find().exec() 
                    if (!users){
                        throw new Error("Couldn't find users")
                    }
                    return users
                }
            },


            user: {
                type: userType,
                args: {
                    email: { 
                        name: "email",
                        type: GraphQLString
                    }
                },
                resolve(root, params){
                    const userDetails = UserModel.findOne({email: params.email}).exec();
                    if(!userDetails){
                        throw new Error("Couldnt find user");
                    }
                    return userDetails
                }
            },

 
// USER BY ID (for logging in)
            user: {
                type: userType,
                args: {
                    id: {
                        name: 'id',
                        type: GraphQLString
                    }
                },
                resolve(root, params){
                    const userDetails = UserModel.findById(params.id).exec();
                    if(!userDetails){
                        throw new Error("Couldnt find user");
                    }
                    return userDetails;
                }
            },



            logos: {
                type: new GraphQLList(logoType),
                resolve: function () {
                    const logos = LogoModel.find().exec()
                    if (!logos) {
                        throw new Error('Error')
                    }
                    return logos
                }
            },
            logo: {
                type: logoType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const logoDetails = LogoModel.findById(params.id).exec()
                    if (!logoDetails) {
                        throw new Error('Error')
                    }
                    return logoDetails
                }
            },
            getLogoByText: {
                type: new GraphQLList(logoType),
                args: {
                    text: {
                        name: 'text',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params){
                    const logos = LogoModel.find({text: params.text}).exec();
                    if (!logos) {
                        throw new Error('Error');
                    }
                    return logos;
                }
            },



         
            logos: {
                type: new GraphQLList(logoType), 
                args: {
                    email: {
                        name: 'email',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params){

                    const RETURN_GUEST_LOGOS = false;  // SET TO TRUE IF YOU WANT TO DISPLAY GUEST LOGOS ONCE USER IS LOGGED IN
 
                    var nonInclusiveList = [params.email] // doesnt display logos made by guests
                    var inclusiveList = nonInclusiveList.concat("GUEST")  // also displays logos made by guests


                    const logos = LogoModel.find({userEmail:  {$in: RETURN_GUEST_LOGOS ? inclusiveList : nonInclusiveList   }}).exec();
                    if(!logos){
                        throw new Error(`Couldnt find logos for user ${params.email}`);
                    }
                    return logos;
                }
            },

            getLogosByTextContains: {
                type: new GraphQLList(logoType),
                args: {
                    text: {
                        name: 'text',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params){
                    const logos = LogoModel.find({text: {$regex: params.text, $options: 'i'}}).exec();
                    if (!logos) {
                        throw new Error('Error');
                    }
                    return logos;
                }
            }
        }
    }
});

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {

            addUser: {
                type: userType,
                args: {
                    // TO DO : make sure that ID is automatically added
                   email: {
                       type: new GraphQLNonNull(GraphQLString)
                   },
                   password: {
                       type: new GraphQLNonNull(GraphQLString)
                   } 
                }, 

                resolve(root, params){
                    const userModel = new UserModel(params);
                    const newUser = userModel.save();
                    if(!newUser){
                        throw new Error("Could create user");
                    }
                    return newUser
                }
            },



            addLogo: {
                type: logoType,
                args: {
                    text: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    userEmail: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    color: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    fontSize: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    backgroundColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderWidth: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    padding: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    margin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve: function (root, params) {
                    const logoModel = new LogoModel(params);
                    const newLogo = logoModel.save();
                    if (!newLogo) {
                        throw new Error('Error');
                    }
                    return newLogo
                }
            },


  


            updateUserPassword: {
                type: userType,
                args: {
                    email: {
                        name: "email",
                        type: new GraphQLNonNull(GraphQLString) 
                    },
                    password: {
                        name: "password",
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params){
                    const userUpdate =  UserModel.findOneAndUpdate({
                        email: params.email}, {email: params.email, password: params.password}, 
                        {new: true}, function(error){
                            if(err) return next(err);
                    });

 
                    return userUpdate;
                }
            },


            updateLogo: {
                type: logoType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    text: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    color: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    fontSize: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    backgroundColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderWidth: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    padding: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    margin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(root, params) {
                    return LogoModel.findByIdAndUpdate(params.id,
                        { text: params.text, color: params.color, fontSize: params.fontSize,
                            backgroundColor : params.backgroundColor, borderColor : params.borderColor,
                            borderWidth: params.borderWidth, borderRadius: params.borderRadius,
                            padding: params.padding, margin: params.margin, lastUpdate: new Date() }, function (err) {
                        if (err) return next(err);
                    });
                }
            },

            removeUser: {
                    type: userType,
                    args: {
                        email: {
                            type: new GraphQLNonNull(GraphQLString)
                        }
                    },
                    resolve(root, params) {
                        const remUser = UserModel.findOneAndRemove(params.email);
                        const remLogos = LogoModel.deleteMany({userEmail: params.email}); // delete all logos associated with user
                        if (!remUser) {
                            throw new Error('Couldnt delete user: ' + params.email)
                        }
                        

                        if(!remLogos) {
                            console.log("Couldnt delete all logos for user: " + params.email);
                        }

                        return remUser;
                    }
            },

            removeLogo: {
                type: logoType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remLogo = LogoModel.findByIdAndRemove(params.id);
                    if (!remLogo) {
                        throw new Error('Error')
                    }
                    return remLogo;
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });