
import * as ReactDOM from "react-dom";
import * as React from "react";

import {OpeneGovPractices} from "./app/crimesearch";

import {Router, Route, IndexRoute} from "react-router";
import  createBrowserHistory from 'history/lib/createBrowserHistory'

ReactDOM.render((
    <Router history={createBrowserHistory()}>

        <Route component={OpeneGovPractices} path="/"/>

    </Router>
), document.getElementById('root'));
