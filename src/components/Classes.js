import React, { Component } from 'react';
import  { Redirect, withRouter } from 'react-router-dom'
import randomString from 'randomstring';
import Cookies from 'universal-cookie';
class Classes extends Component {
    constructor (props) {
        super(props);

        this.state = {
            isLogged: localStorage.getItem('token'),
            userId: '',
            userType: 0,
            userName: '',
            classes: [],
            classCode: randomString.generate(6)
        }
                
        this.renderButtons = this.renderButtons.bind(this);
        this.addClass = this.addClass.bind(this);
        this.joinClass = this.joinClass.bind(this);
        this.teacherModal = this.teacherModal.bind(this);
        this.studentModal = this.studentModal.bind(this);
        this.deleteClass = this.deleteClass.bind(this);
        this.unJoinClass = this.unJoinClass.bind(this)
    }
    async deleteClass (classid) {   
        const data = {
            classid: classid
        }
        const response = await fetch ('http://localhost:8000/class/delete', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        const result = await response.json()
        alert(result.message)

        this.forceUpdate()
    }
    async unJoinClass (classid, userid) {
        const data = {
            classid: classid,
            userid: userid
        }
        const response = await fetch ('http://localhost:8000/class/unjoin', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        const result = await response.json()
        alert(result.message)

        this.forceUpdate()

    }   
    async componentWillMount () {
        try {
            const cookies = new Cookies();
            console.log('@/Classes')
            console.log(cookies.get('auth-token'))
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
            const response_getclasses = await fetch('http://localhost:8000/class/find-all/' + this.state.userId, get_options)
            const result_getclasses = await response_getclasses.json()
            const state_getclasses = {
                classes: result_getclasses.classes
            }
            this.setState(state_getclasses)
            //await new Promise ((resolve) => { this.setState(state_getclasses, resolve)} )
            
            

        } catch (e) {
            throw new Error(e)
        }
        
    }
    async componentWillUnmount () {
    }
    async addClass (e) {
        e.preventDefault()

        const doc_classSetting = await document.getElementById('classsettings').value
        const classSetting = doc_classSetting === 'setting1' ? 1 
                :  ( doc_classSetting === 'setting2' ? 2 : 3
                );
        const data = {
            title: document.getElementById('classtitle').value,
            setting: classSetting,
            section: document.getElementById('classsection').value,
            classcode: document.getElementById('classcode').value,
            adminid: this.state.userId,
            adminname: this.state.userName,
            posts: [],
            students: []
        }
        const URL = 'http://localhost:8000/class/add/' + this.state.userId;
        const post_options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const response = await fetch(URL, post_options)
            const result = await response.json()
            if (!result.success) alert(result.message)
        } catch (e) {
            
            throw new Error (e)
        }
        
        
        this.forceUpdate()
    }
    async joinClass (e) {
        e.preventDefault()
        const data = {
            classcode: document.getElementById('joincode').value
        }
        const URL = 'http://localhost:8000/class/join/' + this.state.userId;
        const post_options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const response = await fetch(URL, post_options)
            const result = await response.json()
            if (!result.success) alert(result.message)
        } catch (e) {
            throw new Error (e)
        }
        
        this.forceUpdate()
    }
    componentDidUpdate () {
        
    }
    async componentWillUpdate () {
        if (this.state.userId) {
            const get_options = { headers: { 'Content-Type': 'application/json' }}
            const response_getclasses = await fetch('http://localhost:8000/class/find-all/' + this.state.userId, get_options)
            const result_getclasses = await response_getclasses.json()
            const state_getclasses = {
                classes: result_getclasses.classes
            }
            
            if ((result_getclasses.classes.sort().toString() !== this.state.classes.sort().toString())) {
                await new Promise ((resolve) => { this.setState(state_getclasses, resolve)} )
            }
        }
                        
    }
    componentDidMount () {
        
    }
    renderButtons () {
        if (this.state.userType){
            return(
                <button className='btn btn-primary my-2 col-sm-2 offset-sm-10' data-toggle='modal' data-target='#teachermodal'>
                    Add Class
                </button>
            )
        } 
        else {
            return (
                <button className='btn btn-primary my-2 col-sm-2 offset-sm-10' data-toggle='modal' data-target='#studentmodal'>
                    Join Class
                </button>
            )
        } 
    }
    teacherModal () {
        
        return (
            <div className="modal fade" id="teachermodal" tabIndex="-1" role="dialog" >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Class</h5>
                        </div>
                        <form onSubmit={this.addClass}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="classtitle">Class Title</label>
                                    <input type="text" className="form-control" placeholder="Class Title" id="classtitle" required/>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col">
                                        <label htmlFor="classsection">Class Section</label>
                                        <input type="text" className="form-control" placeholder="Class Section" id="classsection" required/>
                                    </div>
                                    <div className="form-group col">
                                        <label htmlFor="classcode">Class Code</label>
                                        <input className="form-control" type="text" placeholder={this.state.classCode} id="classcode" value={this.state.classCode} readOnly />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="classsettings">Class Settings</label>
                                    <select className="form-control" id="classsettings">
                                        <option value="setting1">Students can Post and Comment</option>
                                        <option value="setting2">Students can only Comment</option>
                                        <option value="setting3">Students cannot Post and Comment</option>
                                    </select>
                                </div>
                                
                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Create Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
    studentModal () {
        
        return (
            <div className="modal fade" id="studentmodal" tabIndex="-1" role="dialog" >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Join Class</h5>
                        </div>
                        <form onSubmit={this.joinClass}>
                            <div className="modal-body">
                                <input id="joincode" type="text" className="form-control" placeholder="Enter Class Code Here"/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Join Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }   
    render() {
        if (!this.state.isLogged) {
            return <Redirect to='/' />
        }

        return (
            <div> 
                {   
                    this.state.classes.map((item) => {
                        return (
                            <div className="card col-sm-4 float-left" key={item._id}>
                                <div className="card-body">
                                    { this.state.userType? 
                                        (
                                            <button type="button" className="close" onClick={() => this.deleteClass(item._id)}>
                                                <span >&times;</span>
                                            </button>
                                        ) 
                                        : 
                                        (
                                            <button type="button" className="close" onClick={() => this.unJoinClass(item._id, this.state.userId)}>
                                                <span >&times;</span>
                                            </button>
                                        )
                                    }
                                    
                                    <h5 className="card-title">{item.title + " " + item.section}</h5>
                                    
                                    { this.state.userType ? 
                                        (
                                            <div>
                                                <p className="card-text">{"Instructor: " + item.adminname}</p>
                                                <p className="card-text">{"Class Code: " + item.classcode}</p>
                                            </div>
                                        )
                                        :
                                        ( <p className="card-text">{"Instructor: " + item.adminname}</p> ) 
                                    }
                                    
                                    <a href={"/classes/dashboard/" + item._id} className="btn btn-primary">Enter Class</a>
                                </div>
                            </div>
                        )
                    }) 
                }
                { this.renderButtons() }
                { this.state.userType ? this.teacherModal() : this.studentModal() }
                
                    
            </div>
        );
    }
}

export default withRouter(Classes);
