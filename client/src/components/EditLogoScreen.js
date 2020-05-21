import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { clamp } from "../utils/utlity";
import LogoEditor from "../EditorUI/LogoEditor"
import {Logo} from "../EditorUI/Logo"


const RETRIEVE_LOGO = gql`
query logo($logoId: String) {
    logo(id: $logoId) {
        _id
        height
        width 
        userEmail
        backgroundColor
        borderColor
        borderWidth
        borderRadius
        padding
        margin
        texts{
            text
            color
            fontSize
            x
            y
        }
        images{
            src
            height
            width
            x
            y
        }
    }
}
`;

 
class EditLogoScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            userEmail:  this.props.userEmail || "GUEST" ,  // will be stored in DB
        }
    }

    render() {
        let userEmail = this.state.userEmail;
    




        return (
            <Query query={RETRIEVE_LOGO} variables={{logoId: this.props.match.params.id}}>
                {({loading, error, data}) => {
                    if(loading) return "loading...";
                    if(error) return `Error! ${error.message}`;
                

                    console.log(data.logo);
                var userLogo = new Logo(data.logo);

                return (
                    <div className="page_container">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4><Link to="/" className={"btn btn-secondary btn-block"}>Home</Link></h4>
                            </div>
                            </div>
       <LogoEditor history={this.props.history} logo={userLogo} action={"update"} />
       </div>
                )

    }}

           </Query>
        );
    }
    

    
}

export default EditLogoScreen;