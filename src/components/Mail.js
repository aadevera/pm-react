import React, { Component } from 'react';
import  { Redirect, withRouter } from 'react-router-dom'
class Mail extends Component {
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
                Mail/Conversation Entries are here
            </div>
        );
    }
}

export default withRouter(Mail);
