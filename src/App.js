import React, { Component } from 'react';
import { BrowserRouter as Router, Route }  from 'react-router-dom';
import Cookies from 'universal-cookie';
import Classes from './components/Classes';
import Profile from './components/Profile';
import Mail from './components/Mail';
import SignUp from './components/SignUp';
import  { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'

class App extends Component {
    constructor(props){ 
        super(props); 
        this.state = {
            user: localStorage.getItem('name')
        }
        this.login = this.login.bind(this);    
        this.logout = this.logout.bind(this);
    }
    login () {
        
        const data = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-pass').value
        }
        fetch('http://localhost:8000/login',
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then (response => response.json())
            .then (result => {
                //alert(result.message) 
                if (result.success) {
                    this.setState({user: result.userData.name})
                    localStorage.setItem('name', result.userData.name)
                    const cookies = new Cookies();
                    cookies.set (
                        'auth-token',
                        result.token,
                        {
                            path: 'localhost:8000/',
                            maxAge: 60*120
                        }

                    )

                } else {
                    alert(result.message)
                }
            })
    }
    logout (){
        this.setState({ user: '' })
        localStorage.removeItem('name')
        const cookies = new Cookies()
        cookies.remove('auth-token')
    }
    render() {
        return (
            <div>
                {/* navbar */}
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <a className="navbar-brand" href="/">pMoodle</a>
                   
                        { 
                            this.state.user || !this.state.user == null? 
                            (   
                                <div className="navbar-nav">
                                        <a className="nav-item nav-link active" href="/classes">Classes <span className="sr-only">(current)</span></a>
                                        <a className="nav-item nav-link" href="/profile">Profile</a>
                                        <a className="nav-item nav-link" href="/mail">Mail</a>
                                        <Router>
                                            <Link to='/' onClick={ this.logout } >
                                                <button className="btn btn-danger btn-md" type="button">Log Out</button>
                                            </Link>
                                        </Router>
                                </div>                                
                            ) 
                            : 
                            (   
                                <div className="navbar-nav">
                                    <input id='login-email' type="email" className="form-control mr-2" placeholder="Email" required />
                                    <input id='login-pass' type="password" className="form-control mr-2" placeholder="Password" required />
                                    <button onClick={ this.login } className="btn btn-success btn-md" type="button">Sign in</button>
                                </div>
                            ) 
                        }
                        
                    
                </nav>
                
                <Router>
                    <div className="container-fluid">
                        {
                            this.state.user ? 
                            (
                                <div>
                                    <Route path='/classes' exact component={Classes} />
                                    <Route path='/profile' exact component={Profile} />
                                    <Route path='/mail' exact component={Mail} />
                                </div>
                            )
                            :
                            (
                                <Route path='/' exact component={SignUp} />
                            )
                        }
                    </div>
                </Router>
            </div>
            //
        );
    }
}

export default App;
