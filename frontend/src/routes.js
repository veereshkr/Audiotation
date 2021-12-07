import React from 'react';
import { Route } from 'react-router';
import Loadable from 'react-loadable';
import App from './components/App';
//import Welcome from './components/Welcome';

import LoginPage from './components/login/LoginPage';
//import Home from './components/events/Home';


//import NewPage from './components/events/NewPage';
//import Reviews from './components/events/Reviews';
import requireAuth from './utils/requireAuth';




const Home = Loadable({
  loader: () => import('./components/events/Home'),
  loading() {
    return <div>Loading...</div>
  }
});
const MyFiles = Loadable({
  loader: () => import('./components/events/MyFiles'),
  loading() {
    return <div>Loading...</div>
  }
});
const MyWork = Loadable({
  loader: () => import('./components/events/MyWork'),
  loading() {
    return <div>Loading...</div>
  }
});


const Routes = () =>
 (
  <div style={{minHeight:'100%'}}>
    <App>
      <Route exact={true} path="/" component={LoginPage} />
      
      <Route style={{height:'100% !important'}} path="/login/:location_name?/:service?/" component={LoginPage} />

      <Route path="/home/" component={requireAuth(Home)} />
        <Route path="/myfiles/:file_id?/" component={requireAuth(MyFiles)} />
        <Route path="/mywork/:file_id?/" component={requireAuth(MyWork)} />

       <Route path="/service-worker.js" component={requireAuth(Home)} />









      {/* <Route path="/work-sheets/" component={requireAuth(WorkSheets)} /> */}
      {/* <Route path="/work-sheets-all/" component={requireAuth(WorkSheetsAll)} /> */}

    </App>
  </div>
);
export default Routes;
