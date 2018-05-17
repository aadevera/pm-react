import React, { Component } from 'react';
import  { Redirect, withRouter } from 'react-router-dom'

class SignUp extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isLogged: localStorage.getItem('token'),
            email: '',
            name: '',
            password: '',
            usertype: ''
        }
        this.sign_up = this.sign_up.bind(this);
    }
    // TODO: SET-UP ONCHANGE HANDLERS FOR ALL INPUT FIELDS
    sign_up (e) {
        e.preventDefault()
        
        const data = {
            email: document.getElementById('signupemail').value,
            name: document.getElementById('signupname').value,
            password: document.getElementById('signuppass').value,
            usertype: document.getElementById('signuprole').value === 'Teacher' ? 1 : 0,
            classes: [],
            messages: []
        }
        fetch('http://localhost:8000/signup',
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }                
            })
            .then(response => response.json())
            .then (result => {
                if (result.success) {
                    alert(result.message)
                }
            })
    }
    render() {
        if(this.state.isLogged) {
            return <Redirect to='/classes' />
        }
        return (
            <div>
                <div className="row"> 
                    <div className="col-md-4 offset-md-4 col-sm-6 offset-sm-3">
                        <h1 className="pt-2">Sign Up</h1>
                        <hr/>
                        <form onSubmit={this.sign_up} >
                            <div className="form-group">
                                <label htmlFor="signupname">Full Name</label>
                                <input type="text" className="form-control" placeholder="Enter Full Name" id="signupname"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="signupemail">Email address</label>
                                <input type="email" className="form-control" placeholder="Enter email" id="signupemail"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="signuppass">Password</label>
                                <input type="password" className="form-control" placeholder="Enter password" id="signuppass"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="signuprole">Role</label>
                                <select className="form-control" id="signuprole">
                                    <option>Student</option>
                                    <option>Teacher</option>
                                </select>
                            </div>
                            <button type='submit' className='btn btn-primary'> Sign Up </button>
                        </form >
                    </div>
                </div>
                
            </div>
        );
    }
}

export default withRouter(SignUp);
