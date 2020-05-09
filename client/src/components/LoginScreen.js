import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { Redirect } from 'react-router-dom'

// BUG CHECK -> this should in theory not be necessary. we are passing a shared axios object from index.js
// expected behavior is for axios to fnction normally  here , fetch it under this.props.axios
//import axios from 'axios'


class LoginScreen extends Component{
    constructor(props){
        super(props)


    this.LOGIN_URL = "http://localhost:3000/login"
        

        this.state = {
            email: "",
            password: "",
            statusMessage: "Welcome to the GoLogo Editing Platform!",
            redirect: false
        }
    }


// TO BE CALLED whenever user clicks on submit button for form TO LOGIN
attemptLogin(e){
        e.preventDefault(); 
       // this.props.axios.defaults.withCredentials = true
        this.props.axios.post(this.LOGIN_URL, {email: this.state.email, password: this.state.password}).then(response => {

 
            if(!response.data) {
                alert("An error occurred while loggin in. Please try again");
                console.error("Could not retrieve data response from server while attempting to log in");
                console.log(response);
            }
                
                if(response.data.loggedIn){


                    // UPDATE SHARED SESSSION VALUES
                this.props.session.setLoggedIn(true);
                this.props.session.setUserEmail(this.state.email);
                this.setState({redirect: true});
               
           
                this.setState({statusMessage: `Welcome back, ${this.state.email}`})
                return;
                }
 

                this.setState({statusMessage: response.data.message});

          
               
                
            

        }).catch(error => {
            console.log(error);
            this.setState({statusMessage: "Sorry, we werent able to log you in"});
        });
    }

render(){

    if(this.state.redirect){
        return (<Redirect to="/" />);
    }


    return(

<div className="container">

<Link  to="/" className="home_logo_link_text">HOME</Link>

<div className="row">

    <form action="/" method="POST" onSubmit={this.attemptLogin.bind(this)}>
        <div>
            <label>Email:</label>
            <input type="text" name="email" onChange={ e => {
                 this.setState({email: e.target.value});
            } }/>
        </div>
        <div>
            <label>Password:</label>
            <input type="password" name="password"  onChange={ e => {
                this.setState({password: e.target.value});
            }}/>
        </div>
        <div>
            <input type="submit" value="Log In"/>
        </div>
    </form> 

</div> 


<div className="row">
<p className="login_status">{this.state.statusMessage}</p>
</div>


    </div>
    )

}

}
export default LoginScreen;