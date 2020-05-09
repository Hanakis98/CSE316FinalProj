import axios from 'axios'



 // SHARED CLASS 
 // DO NOT UPDATE SESSION VARIABLES INDIVIDUALLY  (note* they are stored in this.data)
 // CALL  setUserEmail/setLoggedIn INSTEAD (so that  localStorage gets updated)

// Members: 
/*

SESSION_KEY (string) -> key used to store data in localStorage

userEmail (string)    -> includes getter/setter functions
loggedIn (boolean)    -> inclides getter/setter functions 
axios (axios class instance for AJAX  )

saveToLocalStorage (function)
fetchFromLocalStorage (function)

isFetchingData -> means we are waiting for response from server on current sessoin status (DONT RENDER UNDLESS IS FALSE)


authenticateUser (function) *logs in user
logout (function) 



YOU MUST CALL UserSession.init() before running any operations
*/
 class Session{

    constructor(){

        this.SESSION_KEY = "gologo_session";
        this.axios = axios;
        this.axios.defaults.withCredentials = true; // enables CORS AJAX

     }





// only fetches data from server if this.data wasnt populated in constructor function 
// next -> function(error<either error if occurs during data fetch or FALSE>) to be called after axios fetch reutnrs a result
     init(next){

        if(!next)
            console.warn("No actions have been defined after Session data is loaded. Are you sure this is intended behavior?");


         ///if data already exists in local storage, fetch it and exit
        this.data = this.fetchFromLocalStorage();
        if(this.data) return next(false);



        // DATA ISNT STORED IN LOCALSTORAGE: make request to fetch it from server

        const userEmail = "GUEST" // DEFAULT EMAIL for when User is not logged in 
        const loggedIn = false ; // DEFAULT 

         

        this.data = {userEmail: "GUEST", loggedIn: false}; //default values
        this.saveToLocalStorage(); //save default values to localstorage

        const authenticationCheckURL = "http://localhost:3000/checkauth" // checks if user is logged in 


    
         this.axios.get(authenticationCheckURL).then(response => {

            if(!response.data) {console.log("An error occurred while attempting to check authentication -> index.js")}

            // check if user is logged in 
            if(response.data.loggedIn){
                this.data.userEmail = response.data.userEmail
                this.data.loggedIn = true;
                this.saveToLocalStorage();
            }

         
            next(false);

        }).catch(error => {
            console.log("Couldnt check authentication status of user -- index.js")
            console.error(error);
        
            next(error);

        });



     }


 

     setUserEmail(e){
         this.data.userEmail = e;
         this.saveToLocalStorage(); //update localStorage 
     }

     getUserEmail(){
        return this.data.userEmail;
     }


     setLoggedIn(l){
        this.data.loggedIn = l;
        this.saveToLocalStorage(); // update localStorage to reflect changes
     }


     getLoggedIn(){
        return this.data.loggedIn;
     }



//saves session to storage
     saveToLocalStorage(){
         var stringData = JSON.stringify(this.data);
         window.localStorage.setItem(this.SESSION_KEY, stringData); 
     }

     //fetches data
     fetchFromLocalStorage(){
         return JSON.parse(window.localStorage.getItem(this.SESSION_KEY)) || false;
     }






authenticateUser(email, password){

    const LOGIN_URL = "http://localhost:3000/login";

    this.axios.post(LOGIN_URL, {email: email, password: password}).then(response => {

        if(response.data){

            var data = response.data;
            //console.log(data);

            if(data.loggedIn){
                // UPDATE SHARED SESSSION VALUES
            this.setLoggedIn(true);
            this.setUserEmail(email);
            return;
            } 
            
        }

    }).catch(error => {
        console.error("COULDNT LOG IN USER -> SEE SESSION.JS (authenticateUser)")
        console.error(error);
        return;
    });
}





//RESETS SESSION TO DEFAULT VALUES
logout(){
    this.setLoggedIn(false);
    this.setUserEmail("GUEST");
}




 }



const userSession = new Session();



 


export default userSession;