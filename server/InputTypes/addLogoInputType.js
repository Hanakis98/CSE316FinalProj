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




const textInputType = new GraphQLInputObjectType({
    name: 'textInputType',
    fields: () => ({
        
        
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
            x: {
                type: GraphQLInt
            },
            y: {
                type: GraphQLInt 
            }
        
    })
})



const imageInputType = new GraphQLInputObjectType({
    name: 'imageInputType',
    fields: () => ({
        
        
            src: {
                type: GraphQLString,
            },
            width: {type: GraphQLInt },
            height:  {type: GraphQLInt },
            x:  {type: GraphQLInt },
            y:  {type: GraphQLInt }
        })
})


const addLogoInputType = new GraphQLInputObjectType({
    name: 'addLogoInputType',
    fields: () => ({
        userEmail:{
            type: GraphQLString
        },
      texts: {
        type: new GraphQLList(textInputType),
      },
      images: {
        type: new GraphQLList(imageInputType),
      },
    }),
  });
  

module.exports = addLogoInputType;