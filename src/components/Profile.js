import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
class Profile extends Component {
    constructor () {
        super();

        this.state = {
            user: localStorage.getItem('name')
        }
    }
    render() {
        if (!this.state.user) {
            return <Redirect to='/' />
        }
        return (
            <div>
                Edit Profile Here
            </div>
        );
    }
}

export default Profile;
