
import * as ReactDOM from "react-dom";
import * as React from "react";



import {Router, Route, IndexRoute} from "react-router";
import  createBrowserHistory from 'history/lib/createBrowserHistory'

ReactDOM.render((
    <Router history={createBrowserHistory()}>



    </Router>
), document.getElementById('root'));
