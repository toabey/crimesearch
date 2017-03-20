
import * as ReactDOM from "react-dom";
import * as React from "react";

import {CrimeCallSearch} from "./app/crimecallsearch";

import {Router, Route, IndexRoute} from "react-router";
import  createBrowserHistory from 'history/lib/createBrowserHistory'
import {NewsSearch} from "./app/newssearch";

ReactDOM.render((
    <Router history={createBrowserHistory()}>

        <Route component={CrimeCallSearch} path="/dial100Search"/>
        <Route component={NewsSearch} path="/newsSearch"/>

    </Router>
), document.getElementById('root'));
