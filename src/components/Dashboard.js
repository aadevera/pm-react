import React, { Component } from 'react';
import  { Redirect, withRouter } from 'react-router-dom';

class Dashboard extends Component {
    constructor (props) {
        super(props);

        this.state = {
            isLogged: localStorage.getItem('token'),
            classId: '',
            userData: {},
            classData: {},
            posts: []
        }
        this.renderAddPostButton = this.renderAddPostButton.bind(this);
        this.renderAddPostModal = this.renderAddPostModal.bind(this);
        this.createPost = this.createPost.bind(this)
        this.addComment = this.addComment.bind(this)
        this.changeSettings = this.changeSettings.bind(this)
        this.deleteComment = this.deleteComment.bind(this)
        this.deletePost = this.deletePost.bind(this)
    }
    async deletePost (postid) {
        const data = {
            classid: this.state.classData._id,
            postid: postid
        }
        const response = await fetch ('http://localhost:8000/post/delete', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        const result = await response.json()
        alert(result.message)

        const get_options = { headers: { 'Content-Type': 'application/json' }}
        const response_findpost = 
            await fetch ('http://localhost:8000/post/find-all/' + this.state.classData._id, get_options)
        const result_findpost = await response_findpost.json()
        console.log('postsdata done')
        var getComments = result_findpost.data.map (async post => {
            var response = await fetch ('http://localhost:8000/comment/find-all/' + post._id)
            var result = await response.json()
            post.comments = result.data
            return post
        })
        
        var postWithComments = await Promise.all(getComments)
        
        this.setState({ posts: postWithComments })
    }
    async deleteComment (commentid, postid) {
        const data = {
            commentid: commentid,
            postid: postid
        }
        const response = await fetch ('http://localhost:8000/comment/delete', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        const result = await response.json()
        alert(result.message)

        const get_options = { headers: { 'Content-Type': 'application/json' }}
        const response_findpost = 
            await fetch ('http://localhost:8000/post/find-all/' + this.state.classData._id, get_options)
        const result_findpost = await response_findpost.json()
        console.log('postsdata done')
        var getComments = result_findpost.data.map (async post => {
            var response = await fetch ('http://localhost:8000/comment/find-all/' + post._id)
            var result = await response.json()
            post.comments = result.data
            return post
        })
        
        var postWithComments = await Promise.all(getComments)
        
        this.setState({ posts: postWithComments })
    }
    async changeSettings (e) {
        e.preventDefault()
        const data = {
            classid: this.state.classData._id,
            title: document.getElementById('changetitle').value,
            section: document.getElementById('changesection').value,
            setting: document.getElementById('changesettings').value === 'setting1' ? 1 :
                        document.getElementById('changesettings').value === 'setting2'? 2 : 3
        }
        const response = await fetch('http://localhost:8000/class/edit', 
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        const result = await response.json()
        
        if (result.success) alert(result.message)
        const get_options = { headers: { 'Content-Type': 'application/json' }}
        const response_findclass = 
                await fetch('http://localhost:8000/class/find-by-id/' + this.props.match.params.classid, get_options)
            const result_findclass = await response_findclass.json()
            this.setState({ classData: result_findclass.data })
        
        const response_findpost = 
            await fetch ('http://localhost:8000/post/find-all/' + this.state.classData._id, get_options)
        const result_findpost = await response_findpost.json()
        console.log('postsdata done')
        var getComments = result_findpost.data.map (async post => {
            var response = await fetch ('http://localhost:8000/comment/find-all/' + post._id)
            var result = await response.json()
            post.comments = result.data
            return post
        })
        
        var postWithComments = await Promise.all(getComments)
        
        this.setState({ posts: postWithComments })
    }
    async addComment (postid) {
        
        const data = {
            author: this.state.userData._id,
            authorname: this.state.userData.name,
            content: document.getElementById(postid).value,
            like_count: []
        }
        const response = await fetch('http://localhost:8000/comment/add/' + postid, 
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        const result = await response.json()
        
        if (!result.success) this.props.history.push('/classes/dashboard/' + this.state.classData._id)

        const get_options = { headers: { 'Content-Type': 'application/json' }}
        const response_findpost = 
            await fetch ('http://localhost:8000/post/find-all/' + this.state.classData._id, get_options)
        const result_findpost = await response_findpost.json()
        console.log('postsdata done')
        var getComments = result_findpost.data.map (async post => {
            var response = await fetch ('http://localhost:8000/comment/find-all/' + post._id)
            var result = await response.json()
            post.comments = result.data
            return post
        })
        
        var postWithComments = await Promise.all(getComments)
        
        this.setState({ posts: postWithComments })
    }
    async createPost () {
        const data = {
            author: this.state.userData._id,
            authorname: this.state.userData.name,
            content: document.getElementById('writepost').value,
            comments: []
        }
        const response = await fetch('http://localhost:8000/post/add/' + this.state.classData._id, 
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        const result = await response.json()
        if (!result.success) this.props.history.push('/classes/dashboard/' + this.state.classData._id)
        
        
        this.forceUpdate()
    }
    async componentWillMount () {
        try {
            const tok_options = { headers: { 'Content-Type': 'application/json' }, credentials: 'include' }
            const get_options = { headers: { 'Content-Type': 'application/json' }}

            const response_getdata = await fetch('http://localhost:8000/getdata', tok_options)
            const result_getdata = await response_getdata.json()
            this.setState({ userData: result_getdata.data })
            
            const response_findclass = 
                await fetch('http://localhost:8000/class/find-by-id/' + this.props.match.params.classid, get_options)
            const result_findclass = await response_findclass.json()
            this.setState({ classData: result_findclass.data })
            
            const response_findpost = 
                await fetch ('http://localhost:8000/post/find-all/' + this.state.classData._id, get_options)
            const result_findpost = await response_findpost.json()
            var getComments = result_findpost.data.map (async post => {
                var response = await fetch ('http://localhost:8000/comment/find-all/' + post._id)
                var result = await response.json()
                post.comments = result.data
                return post
            })
            
            var postWithComments = await Promise.all(getComments)
            
            this.setState({ posts: postWithComments })

        } catch (e) {
            
            console.log('Error @/dashboard componentWillMount()')
            console.log(new Error(e))
            this.props.history.push('/')
        }
    }
    async componentWillUpdate() {

    }
    renderAddPostButton() {
        if (this.state.userData.usertype === 1 || this.state.classData.setting === 1) {
            return (
                <button className='btn btn-primary my-2 col-sm-2 offset-sm-10' data-toggle='modal' data-target='#addpostmodal'>
                    New Post
                </button>
            )
        }
    }
    renderAddPostModal() {
        return (
            <div className="modal fade" id="addpostmodal" tabIndex="-1" role="dialog" >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create Post</h5>
                        </div>
                        <form onSubmit={this.createPost}>
                            <div className="modal-body">
                                <textarea id="writepost" className="form-control" required placeholder="Write Post"/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Create Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
        
    }

    renderClassSettingsModal() {
        return (
            <div className="modal fade" id="settingsmodal" tabIndex="-1" role="dialog" >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Class Settings</h5>
                        </div>
                        <form onSubmit={this.changeSettings}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="changetitle">Class Title</label>
                                    <input type="text" className="form-control" placeholder={this.state.classData.title} id="changetitle" required/>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-sm-3">
                                        <label htmlFor="changesection">Class Section</label>
                                        <input type="text" className="form-control" placeholder={this.state.classData.section} id="changesection" required/>
                                    </div>
                                    <div className="form-group col-sm-9">
                                        <label htmlFor="changesettings">Class Settings</label>
                                        <select className="form-control" id="changesettings">
                                            <option value="setting1">Students can Post and Comment</option>
                                            <option value="setting2">Students can only Comment</option>
                                            <option value="setting3">Students cannot Post and Comment</option>
                                        </select>
                                    </div>
                                </div>
                                
                                
                                
                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Save Settings</button>
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
            <div className="row pt-3">
                <div className="col-sm-3 col-md-2 border-right">
                    <form className="bd-search align-items-center mb-2" action="">
                        <input className="form-control ds-input " type="search" placeholder="Search a Post" />
                    </form>
                    <nav className="sidebar">
                        <ul className="nav nav-pills flex-column">
                            <li className="nav-item">
                                <a className="nav-link active" href={'/classes/dashboard/' + this.state.classData._id }>Dashboard</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href={'/classes/students/' + this.state.classData._id}>{this.state.userData.usertype ? 'Students' : 'Classmates'}</a>
                            </li>                        
                        </ul>
                    </nav>
                </div>
                <main className="col-sm-7 col-md-8">
                    
                    <div className="row ml-2">
                        <h2 className="">{this.state.classData.title + " " + this.state.classData.section}</h2>
                        {
                            this.state.userData.usertype === 1 ? 
                            (
                                <button className='btn btn-sm ml-auto' data-toggle='modal' data-target='#settingsmodal'>
                                Edit Class
                                </button>
                            ) 
                            : 
                            (<div></div>)
                        }
                    </div>
                    
                    <hr />
                    {
                        this.state.posts.map((post) => {
                            return (
                                <div className="row ml-2 mb-5 bg-light p-3 border border-dark rounded" key={post._id} >
                                    <div className="media w-100">
                                        <div className="media-body">
                                            {
                                                this.state.userData._id === post.author || this.state.userData.usertype === 1? 
                                                    (
                                                        <button onClick={()=>this.deletePost(post._id)} type="button" className="close">
                                                            <span >&times;</span>
                                                        </button>) 
                                                    : 
                                                    (
                                                        <div></div>
                                                    )
                                            }
                                            
                                            <h5 className="mt-0">{post.authorname}  </h5><p className= "small"> { "At " + post.timestamp + " Posted: "}</p> 
                                            <p>{post.content}</p>
                                            <hr/>
                                            <small className="mt-0">Comments ({post.comments.length})</small>
                                            {   
                                                
                                                post.comments.map ((comment => {
                                                    return (
                                                        <div key={comment._id} className="media mt-2 pl-5">
                                                            <div className="media-body">
                                                                {
                                                                    this.state.userData._id === post.author || this.state.userData.usertype === 1? 
                                                                        (
                                                                            <button type="button" className="close" onClick={() => this.deleteComment(comment._id, post._id)}>
                                                                                <span >&times;</span>
                                                                            </button>) 
                                                                        : 
                                                                        (
                                                                            <div></div>
                                                                        )
                                                                }
                                                                
                                                                <h6 className="mt-0">{comment.authorname}</h6>
                                                                <small className="mt-0">{"At " + comment.timestamp + " Commented: "}</small>
                                                                <p>{comment.content}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                }))
                                                    
                                                

                                            }
                                            <hr/>
                                        </div>
                                        
                                    </div>
                                    { this.state.userData.usertype === 1 || this.state.classData.setting === (1||2) ?
                                        (  
                                            
                                            <div className="media w-100 mt-2" >
                                                <div className="col-md-10 col-sm-8 mx-auto">
                                                    <input type="text" id={post._id} className="form-control form-control-sm" placeholder="Comment ..." required />
                                                </div>
                                                <div className="col-md-2 col-sm-2 mx-auto"> 
                                                    <button  onClick={() => this.addComment(post._id)} className="btn btn-sm btn-outline-secondary" type="button">Comment</button>
                                                </div>
                                                
                                                
                                            </div> 
                                        ) 
                                        : 
                                        (<div className=" w-100">Comments Have been Disabled</div>) 
                                    }
                                    
                                </div>
                            )
                        })
                    }
                    {this.renderAddPostButton()}
                    {this.state.userData.usertype === 1 || this.state.classData.setting === 1 ? this.renderAddPostModal() : <div></div>}
                    {this.state.userData.usertype === 1 ? this.renderClassSettingsModal(): <div></div>}
                </main>
            </div>
        );
    }
}


export default withRouter(Dashboard);