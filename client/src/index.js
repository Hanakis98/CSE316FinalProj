import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';

// THESE ARE OUR REACT SCREENS, WHICH WE WILL ROUTE HERE
import HomeScreen from './components/HomeScreen';
import EditLogoScreen from './components/EditLogoScreen';
import CreateLogoScreen from './components/CreateLogoScreen';
import CreateAccountScreen from './components/CreateAccountScreen';
import ViewLogoScreen from './components/ViewLogoScreen';
import LoginScreen from './components/LoginScreen';
import PasswordResetScreen from "./components/PasswordResetScreen";
import axios from 'axios'
import Session from "./Session/Session";


const client = new ApolloClient({ uri: 'http://localhost:3000/graphql' });


//for AJAX requests that we decide to do out of the scope of our Session 
// dont delete this unless you fully understand the consequences 
axios.defaults.withCredentials = true;
 
 

Session.init(err => {
ReactDOM.render(
    <ApolloProvider client={client}>
        <Router>
            <div>
                <Route path='/login'  render={(props) => <LoginScreen axios={axios} session={Session}/> }  />
                <Route exact path='/' render={(props) => <HomeScreen axios={axios} session={Session} match={props.match}/>  } />
                <Route path='/edit/:id'render={(props) => <EditLogoScreen axios={axios} session={Session} history={props.history} match={props.match}/> }  />
                <Route path='/create' render={(props) => <CreateLogoScreen axios={axios} session={Session} history={props.history} match={props.match}/> } />
                <Route path='/view/:id'render={(props) => <ViewLogoScreen axios={axios} session={Session}  history={props.history} match={props.match}/> }  />
                <Route path='/register'render={(props) => <CreateAccountScreen axios={axios} session={Session}  history={props.history}/> }  />
                <Route path="/changepassword" render={(props) => <PasswordResetScreen  location={props.location} axios={axios} session={Session}/>} />
            </div>
        </Router>
    </ApolloProvider>, 
    document.getElementById('root')
);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://create-react-app.dev/docs/making-a-progressive-web-app/
serviceWorker.unregister();

