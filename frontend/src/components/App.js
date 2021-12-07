import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import HeaderLogin from './HeaderLogin/HeaderLogin';



class App extends React.Component {
  render() {
    if (this.props.auth.isAuthenticated){
      return (

      <div style={{minHeight:'100%'}}>
          {this.props.children}
        </div>


      );
    }else{
      return (
        <div style={{minHeight:'100vh' , height:'100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'noRepeat',
    backgroundSize: 'cover'}}>
        <div style={{minHeight:'100vh'}}>
            {/* <HeaderLogin /> */}

          {this.props.children}
        </div>
      </div>

      );
    }

  }
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
}
function newStateToProps(state) {
  return {
    auth: state.auth
  };
}
export default connect(newStateToProps) (App);
