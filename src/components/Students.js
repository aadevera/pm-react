import React, { Component } from 'react';
import  { Redirect, withRouter, Link } from 'react-router-dom'
class Student extends Component {
    constructor (props) {
        super(props);

        this.state = {
            isLogged: localStorage.getItem('token'),
            classId: '',
            userData: {},
            classData: {},
            posts: []
        }
    }
    async componentWillMount () {
        console.log(this.props.match.params.classid)
        try {
            const tok_options = { headers: { 'Content-Type': 'application/json' }, credentials: 'include' }
            const get_options = { headers: { 'Content-Type': 'application/json' }}
            const response_getdata = await fetch('http://localhost:8000/getdata', tok_options)
            const result_getdata = await response_getdata.json()
            const data = {
                userData: result_getdata.data
            }
            this.setState(data)
            const response_findclass = 
                await fetch('http://localhost:8000/class/find-by-id/' + this.props.match.params.classid, 
                            get_options)

            const result_findclass = await response_findclass.json()
            if (!result_findclass.success) {
                alert('Class does not Exists')
                this.props.history.push('/')
            }
            
            this.setState({ classData: result_findclass.data })
        } catch (e) {
            throw new Error(e)
        }
    }
    render() {
        if (!this.state.isLogged) {
            return <Redirect to='/' />
        }
        return (
            <div className="row pt-3">
                <div className="col-sm-3 col-md-2 border-right">
                    <form className="bd-search align-items-center mb-2" action="">
                        <input className="form-control ds-input " type="search" placeholder={"Search a " + (this.state.userData.usertype ? 'Student' : 'Classmate')} />
                    </form>
                    <nav className="sidebar">
                        <ul className="nav nav-pills flex-column">
                            <li className="nav-item">
                                <Link className="nav-link" to={'/classes/dashboard/' + this.state.classData._id }>Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to={'/classes/students/' + this.state.classData._id}>{this.state.userData.usertype ? 'Students' : 'Classmates'}</Link>
                            </li>                        
                        </ul>
                    </nav>
                </div>
                <main className="col-sm-7 col-md-8">
                    <h2>{this.state.classData.title + (this.state.userData.usertype ? ' Students' : ' Classmates')}</h2><hr />
                    <div className="container-fluid">
                        Students
                    </div>
                </main>
            </div>
        );
    }
}

export default withRouter(Student);
