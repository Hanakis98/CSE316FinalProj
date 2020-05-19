import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom'

const GET_LOGOS = gql`
  query logos($email: String){
    findLogosByEmail(email: $email) {
      _id
      lastUpdate
      texts{
          text
      }
    }
  }
`;

const compareDates = (ds1, ds2) => {
    let date1 = new Date(ds1);
    let date2 = new Date(ds2);

    if(date1 < date2){
        return -1;
    } else {
        return 1;
    }
};

class HomeScreen extends Component {

    constructor(props){
        super(props);
        console.log(props);
        this.LOGOUT_URL = "http://localhost:3000/logout";
    }


    logout(){

        if(this.props.session.getUserEmail() == "GUEST"){
            console.error("CANNOT LOGOUT GUEST USER.");
            return false;
        }

        this.props.axios.post(this.LOGOUT_URL, {email: this.props.session.getUserEmail()}).then(response => {
            if(!response.data){
                alert("Sorry, we were unable to logout. Please try again.");
                console.log("Did not receive confirmation of session being ended");
                return;
            }
            if(response.data.success)
            this.props.session.logout(); //update localStorage and Session Object
               window.location.reload(); //refresh page to display changes 
            
            }).catch( err => {
                alert("An error occurred while logging out. See console for more information");
                console.error(err);
            })

 
    }


    showForgotPasswordDialog(){
        let PASSWORD_FORGOT_URL = "http://localhost:3000/forgot";
        var userEmail =  prompt("Enter your email : ", "Email Address");
        this.props.axios.post(PASSWORD_FORGOT_URL, {email: userEmail}).then(response => {
            if(!response.data){
                alert("Sorry, an error occurred");
                console.error("Password recovery did not return data summary");
                return;
            }

            if(response.data.success){
                alert("Your password recovery email has been sent to " + userEmail);
                return;
            } 

//            response.data.success reutnred FALSE 
            alert(response.data.message);
            return;

        }).catch(error => {
            console.error(error);
            alert("Sorry, your password recovery email could not be sent. Please Try again.");
        })

        }
    

    render() {
        return (
            <Query pollInterval={30000} query={GET_LOGOS} variables={{email: this.props.session.getUserEmail()}}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
 
                    return (
                        <div className="container row">
                            <div className="col s4">
                    <div className="userAuthenticationStatus" style={{color: "white", background: "#930193" , padding: "10px", fontWeight: "bold", border: "1px solid #000"}}>You are logged in as: {this.props.session.getUserEmail()}</div>
                                
                                <Link  className={this.props.session.getLoggedIn() ? "d-none" : "loginLinkButton"} to={'/login'}> <div  style={{padding: "25px", fontSize: "23px", fontWeight: "100", textAlign: "center", background: "green", color: "white", border: "1px solid #10ee00"}}>Log In</div></Link>

                               <Link className={!this.props.session.getLoggedIn() ? "createAccountPageLink" : "d-none"} to={"/register"} > <div style={{padding: "25px", fontSize: "23px", fontWeight: "100", textAlign: "center", background: "#000033", color: "white", border: "1px solid #000020"}}>Create Account</div></Link>
                               

                               <div onClick={this.showForgotPasswordDialog.bind(this)} className={!this.props.session.getLoggedIn() ? "forgotPasswordButton" : "d-none"}  style={{cursor: "pointer", padding: "25px", fontSize: "23px", fontWeight: "100", textAlign: "center", background: "#001122", color: "white", border: "1px solid #000055"}}>Forgot My Password</div>

                               
                               
                                <div onClick={this.logout.bind(this)} className={this.props.session.getLoggedIn() ? "logoutPageLink" : "d-none"}  style={{cursor: "pointer", padding: "25px", fontSize: "23px", fontWeight: "100", textAlign: "center", background: "#330000", color: "white", border: "1px solid #10ee00"}}>Log Out</div>


                                <h3>Recent Work</h3>
                                {data.findLogosByEmail.sort((x, y) => -compareDates(x.lastUpdate, y.lastUpdate)).map((logo, index) => (
                                    <div key={index} className='home_logo_link'>
                                        <Link to={`/view/${logo._id}`} className="home_logo_link_text" style={{ cursor: "pointer" }}>{logo.texts.length > 0 ? logo.texts[0].text : ""}</Link>
                                    </div>
                                ))}
                            </div>
                            <div className="col s8">
                                <div id="home_banner_container">
                                    @todo<br />
                                    List Maker
                                </div>
                                <div>
                                    <Link id="add_logo_button" to="/create" className ={"btn btn-secondary btn-block"}>Add Logo</Link>
                                </div>
                            </div>
                        </div>
                    );
                }
                }
            </Query >
        );
    }
}

export default HomeScreen;
