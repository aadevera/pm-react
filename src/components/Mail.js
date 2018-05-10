import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
class Mail extends Component {
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
                Mail/Conversation Entries are here
            </div>
        );
    }
}

export default Mail;
