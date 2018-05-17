import React, { Component } from 'react';
import  { Redirect, withRouter } from 'react-router-dom'
class Profile extends Component {
    constructor () {
        super();

        this.state = {
            isLogged: localStorage.getItem('token')
        }
    }
    render() {
        if (!this.state.isLogged) {
            return <Redirect to='/' />
        }
        return (
            <div>
                Edit Profile Here
            </div>
        );
    }
}

export default withRouter(Profile);
