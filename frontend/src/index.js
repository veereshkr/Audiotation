import React from 'react';
import RouterDom from 'react-dom';
import {  BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';
import jwtDecode from 'jwt-decode';
import setAuthorizationToken from './utils/setAuthorizationToken';
import { setCurrentUser } from './actions/authActions';
import Routes from './routes';
import './scss/style.scss'
// Temp fix for reactstrap
import './scss/core/_dropdown-menu-right.scss'
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
import registerServiceWorker from "./registerServiceWorker";
import * as worker from './worker';
import { persistStore } from 'redux-persist'


/*jslint node: true */

const publicVapidKey = "BNaNS34wTu2yDITyrDYB5FXSXilId2PyULKT_iJ4kdn3QNXdNtE8o2AxLmKYakQceWHSqe02pgjmMEbuUIZEch4";

const store = createStore(
  rootReducer,
  undefined,
  compose(
    applyMiddleware(thunk),

    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

persistStore(
   store,
   null,
   () => {
     store.getState() // if you want to get restoredState
   }
 )

worker.register();

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  //console.log(localStorage)
  if(localStorage.languages==='undefined'){
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken), JSON.parse(localStorage.locationInfo),localStorage.selectedLocation ,null,null, []));

  }else{
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken), JSON.parse(localStorage.locationInfo),localStorage.selectedLocation ,null,null, JSON.parse(localStorage.languages)));

  }
  //console.log(localStorage)
}



RouterDom.render(
  <BrowserRouter>
  <Provider store={store}>
    <Routes />
  </Provider>
</BrowserRouter>, document.getElementById('app'));

//registerServiceWorker();
