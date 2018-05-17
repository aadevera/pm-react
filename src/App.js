import React, { Component } from 'react';
import { 
    BrowserRouter as Router, 
    Route
}   from 'react-router-dom';
import Classes  from './components/Classes';
import Profile  from './components/Profile';
import Mail     from './components/Mail';
import SignUp   from './components/SignUp';
import Home     from './components/Home'
import Dashboard from './components/Dashboard';
import Students from './components/Students';

class App extends Component {
    render() {
        return (
            <Router history={Router.browserHistory}>
                <Home>
                    <Route exact path='/' component={ SignUp } />
                    <Route exact path='/classes' component={Classes} />
                    <Route exact path='/classes/dashboard/:classid' component={Dashboard} />
                    <Route exact path='/classes/students/:classid' component={Students} />
                    <Route path='/profile' exact component={ Profile } />
                    <Route path='/mail' exact component={ Mail } /> 
                </Home>
            </Router>
        )        
    }
}
export default App;
