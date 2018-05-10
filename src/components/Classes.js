import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
class Classes extends Component {
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
                This is where you put Classes
            </div>
        );
    }
}

export default Classes;
