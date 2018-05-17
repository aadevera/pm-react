import React, { Component } from 'react';
import  { Redirect, withRouter } from 'react-router-dom'
class Profile extends Component {
    constructor () {
        super();

        this.state = {
            isLogged: localStorage.getItem('token'),
            userId:'',
            userType: '',
            userName: '',
            userData: {}
        }
    } 
    async componentWillMount () {
        
        try {
            const tok_options = { headers: { 'Content-Type': 'application/json' }, credentials: 'include' }
            const get_options = { headers: { 'Content-Type': 'application/json' }}
            const response_getdata = await fetch('http://localhost:8000/getdata', tok_options)
            const result_getdata = await response_getdata.json()
            
            if (!result_getdata.success) {
                alert (result_getdata.message)
                localStorage.removeItem('token')
                this.props.history.push('/')
            }
            const state_getdata = {
                userId: result_getdata.data._id,
                userType: result_getdata.data.usertype,
                userName: result_getdata.data.name
            }
            this.setState(state_getdata)
            //await new Promise ((resolve) => { this.setState(state_getdata, resolve) })
            const response = await fetch('http://localhost:8000/user/find-by-id/' + this.state.userId, get_options)
            const result = await response.json()
            this.setState({userData: result.data})
            //await new Promise ((resolve) => { this.setState(state_getclasses, resolve)} )
            
            

        } catch (e) {
            throw new Error(e)
        }
        
    }
    render() {
        if (!this.state.isLogged) {
            return <Redirect to='/' />
        }
        return (
            <div>
                
                <form className="w-50 align-middle mx-auto">
                    <h4>Edit Profile</h4>
                    <hr /> 
                    <div className="row">
                        <div className="form-group col">
                            <label htmlFor="editemail">Email</label>
                            <input type="email" className="form-control" id="editemail" placeholder={this.state.userData.email} required/>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="editpass">Password</label>
                            <input type="password" className="form-control" id="editpass" placeholder="Password" required/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="editname">Email</label>
                        <input type="text"  className="form-control" id="editname" placeholder={this.state.userData.name} required/>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary float-right">Save Profile</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(Profile);
