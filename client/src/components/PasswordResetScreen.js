import React, { Component } from 'react';
import '../App.css';
import {
    Redirect,
    Link,
    useLocation
  } from "react-router-dom";
 


 
class PasswordResetScreen extends Component{
    constructor(props){
        super(props)



    this.PASSWORD_CHANGE_URL = "http://localhost:3000/reset";
    this.MINIMUM_PASSWORD_LENGTH = 5; // 5 characters minimum
        

 this.urlParams = new URLSearchParams(props.location.search);


 
 
        this.state ={
            targetEmail:   this.urlParams.get("email") || false,
            newPassword: "",
            redirect: false // set to true to redirect to home page
        };


        if(!this.state.targetEmail){
            console.error("NO EMAIL ARGUMENT FOUND. NOW REDIRECTING TO HOME PAGE");
            alert("Error: There was no email argument provided. You are now being redirected to the home page.");
            this.state.redirect = true;
        }
      
    }
    
      

// TO BE CALLED whenever user clicks on submit button for form TO CHANGE PASSWORD
changePassword(e){
        e.preventDefault(); 

        if(this.state.newPassword.trim().length < this.MINIMUM_PASSWORD_LENGTH){
            console.log("Password length is 0.  changePassword now exiting without making changes");
            alert("Please enter a valid new password that is at least 5 characters");
                    return false;
        }


       // this.props.axios.defaults.withCredentials = true
        this.props.axios.post(this.PASSWORD_CHANGE_URL, {email: this.state.targetEmail, password: this.state.newPassword}).then(response => {

            if(response.data){

                var data = response.data;
                console.log(data);

                if(data.success){

                    alert("Your password has successfully been reset. You are now being redirected to the home page.");
                    this.setState({redirect: true});
                return;
                }
 

                 

          
               
                
            }

        }).catch(error => {
            alert('Sorry, an error occurred. Please try again.')
            console.error("Could not reset password. SEE PASSWORDRESETSCREEN.js -> changePassword()");
            console.error(error);
           return;
        });
    }

render(){

    // redirect to home page if this.state.redirect is set to true
    if(this.state.redirect){
        return (<Redirect to="/" />);
    }


    return(


<div className="container">

<Link  to="/" className="home_logo_link_text">HOME</Link>

<div className="row">

    <form action="/" method="POST" onSubmit={this.changePassword.bind(this)}>
        <div>
    <h2>You are now resetting the password for {this.state.targetEmail}</h2>
        </div>
        <div>
            <label>Password:</label>
            <input type="password" name="password"  onChange={ e => {
                this.setState({newPassword: e.target.value});
            }}/>
        </div>
        <div>
            <input type="submit" value="Log In"/>
        </div>
    </form> 

</div> 


<div className="row">
<p>Fill in the field above to reset your account password.</p>
</div>


    </div>
    )

}

}
export default PasswordResetScreen;