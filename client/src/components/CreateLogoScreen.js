import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from 'react-router-dom';
import { clamp } from '../utils/utlity';
import LogoEditor from "../EditorUI/LogoEditor"
import {Logo} from "../EditorUI/Logo"
 
class CreateLogoScreen extends Component { 

    constructor(props){
        super(props)
        
        this.state = {
            userEmail:  props.session.getUserEmail(),
            renderText: "",
            renderColor: "",
            renderBackgroundColor: "",
            renderBorderColor: "",
            renderBorderWidth: "",
            renderBorderRadius: "",
            renderFontSize: "",
            renderPadding: "",
            renderMargin: ""
        }
    }

    render() {
        let text, color, fontSize, backgroundColor, borderColor, borderWidth, borderRadius, padding, margin;
        let userEmail = this.state.userEmail;
        var logo = new Logo();
        return (
            <div className="page_container">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4><Link to="/" className={"btn btn-secondary btn-block"}>Home</Link></h4>
                                </div>
                                </div>
           <LogoEditor history={this.props.history} logo={logo}  action={"add"}/>
           </div>
        );
    }
}

export default CreateLogoScreen;