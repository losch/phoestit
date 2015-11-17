'use strict';

import 'babel-core/polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route } from 'react-router'
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import App from './containers/App';
import * as reducers from './reducers';

let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

let notesApp = combineReducers(reducers);
let store = createStore(notesApp);

let rootElement = document.getElementById('root');

ReactDom.render(
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      <Route path="/" component={App} />
      <Route path="/:view" component={App} />
    </Router>
  </Provider>,
  rootElement
);
