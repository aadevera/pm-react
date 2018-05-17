import  React, { Component } from 'react'
import  { Link, withRouter} from 'react-router-dom';
import Cookies from 'universal-cookie';

class Home extends Component {
    constructor () {
        super ();
        this.state = {
            isLogged: localStorage.getItem('token'),
            userData: {},
            email: '',
            password: '',
            activeTab: ''
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.emailOnChange = this.emailOnChange.bind(this);
        this.passwordOnChange = this.passwordOnChange.bind(this);
    }
    emailOnChange (event) {
        this.setState({
            email: event.target.value
        })
    }
    passwordOnChange (event) {
        this.setState({
            password: event.target.value
        })
    }
    async login(e) {   
        e.preventDefault()
        const data = {
            email: this.state.email,
            password: this.state.password
        }
        const response = await fetch('http://localhost:8000/login',
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json()
        if (result.success) {
            localStorage.setItem('token', result.token)
            const cookies = new Cookies();
            
            cookies.remove('auth-token')
            cookies.set ('auth-token', result.token, { path: '/',  maxAge: 60*120 } )
            console.log('@/login')
            console.log(cookies.get('auth-token'))
            
            
            this.setState({
                isLogged: result.token,
                userData: result.userData
            })

            this.props.history.push('/classes')
        } else {
            alert(result.message)
            this.props.history.push('/classes')
        }
    }
    logout () {
        this.setState({ isLogged: null, userData: {}, email: '', password: '' })
        localStorage.removeItem('token')
        const cookies = new Cookies()
        cookies.remove('auth-token')
        this.props.history.push('/')
    }
    componentWillUnmount() {
        localStorage.removeItem('token')
        const cookies = new Cookies()
        cookies.remove('auth-token')
    }
    setActiveTab (val, e) {
        this.setState ({
            activeTab: val
        })
        
    }
    render() {
        
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <a className="navbar-brand" href="/">pMoodle</a>
                        { 
                            this.state.isLogged ? 
                            (   
                                
                                <div className="navbar-nav" style={{width: "100%"}}>
                                        <Link 
                                            onClick={this.setActiveTab.bind(this, 'classtab')} 
                                            className={"nav-item nav-link " + (this.state.activeTab === "classtab"? "active" : "")}
                                            to="/classes">Classes 
                                        </Link>
                                        <Link 
                                            onClick={this.setActiveTab.bind(this, 'profiletab')} 
                                            className={"nav-item nav-link " + (this.state.activeTab === "profiletab"? "active" : "")}
                                            to="/profile">Profile
                                        </Link>
                                        <Link 
                                            onClick={this.setActiveTab.bind(this, 'mailtab')} 
                                            className={"nav-item nav-link " + (this.state.activeTab === "mailtab"? "active" : "")} 
                                            to="/mail">Mail</Link>
                                        <button onClick={ this.logout } className="btn btn-danger btn-md ml-auto" type="button">Log Out</button>
                                </div>                          
                            ) 
                            : 
                            (   
                                
                                <form onSubmit={this.login } className="navbar-nav ml-auto">
                                    <input onChange={this.emailOnChange} id='login-email' type="email" className="form-control mr-2" placeholder="Email" required />
                                    <input onChange={this.passwordOnChange}  id='login-pass' type="password" className="form-control mr-2" placeholder="Password" required />
                                    <button className="btn btn-success btn-md" type="submit">Sign in</button>
                                </form>
                                    
                            ) 
                        }
                </nav>
                <div className='container-fluid mt-2'>
                    { this.props.children }
                </div>
            </div>
        )
    }
}

export default withRouter(Home);