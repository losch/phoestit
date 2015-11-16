'use strict';

import 'babel-core/polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/App';
import * as reducers from './reducers';

let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

let notesApp = combineReducers(reducers);
let store = createStore(notesApp);

let rootElement = document.getElementById('root');

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
