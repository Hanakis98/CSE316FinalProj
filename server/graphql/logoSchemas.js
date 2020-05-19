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

var GraphQLInputObjectType = require('graphql').GraphQLInputObjectType;

var addLogoInputType = require("../InputTypes/addLogoInputType")



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






    var imageType = new GraphQLObjectType({
        name:"image" ,
        fields: function() {
            return {
                src: {
                    type: GraphQLString,
                },
                width: {type: GraphQLInt },
                height:  {type: GraphQLInt },
                x:  {type: GraphQLInt },
                y:  {type: GraphQLInt }
            }
        }
    
    })


var textType = new GraphQLObjectType({
    name: 'text',
    fields: function () {
        return {
            text: {
                type: GraphQLString
            },
            color: {
                type: GraphQLString
            },
            fontSize: {
                type: GraphQLInt
            },
            x: {
                type: GraphQLInt
            },
            y: {
                type: GraphQLInt 
            }
        }
    }
});



var logoType = new GraphQLObjectType({
    name: "logo",
    fields: function() {
        return {
            _id: {
                type: GraphQLString
            },
            height: {
                type: GraphQLInt
            },
            width: {
                type: GraphQLInt
            },
            userEmail: {
                type: GraphQLString
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
            texts: {type: GraphQLList(textType)},
            images: {type: GraphQLList(imageType)},
            lastUpdate: {
                type: GraphQLDate
            }
        }
    }
})

 




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
  

            findLogoByText: {
                type: logoType, 
                args: {
                    text: {
                        name: "text",
                        type: GraphQLString
                    }
                },
                resolve: function(root, params) {
                    console.log(params);
                    const logoDetails = LogoModel.findOne({texts:  { $elemMatch: { text: params.text}}}).exec();
                    if (!logoDetails) throw new Error("Couldnt fund logo");
                    return logoDetails;
                }
            },

         
            findLogosByEmail: {
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
                    input:{
                        type: addLogoInputType
                    }
                },
                resolve: function (root, params) {
                    console.log(params);
                    const logoModel = new LogoModel(params.input);
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
                  input: {
                    type: addLogoInputType
                  }
                    
                },
                resolve(root, params) {
                    return LogoModel.findByIdAndUpdate(params.id,
                        { texts: params.input.texts, images: params.input.images, lastUpdate: new Date() }, function (err) {
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