import React from 'react';
import TextFieldGroup from '../common/TextFieldGroup';

import { connect } from 'react-redux';
import { login } from '../../actions/authActions';
import PropTypes from 'prop-types'
import {   Button} from 'reactstrap'

import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import {Helmet} from "react-helmet";
import ReactGA from 'react-ga';
ReactGA.initialize('UA-124346448-2');
function validateInput(data) {

  let errors = {};

  if (Validator.isEmpty(data.identifier)) {
    errors.identifier = 'This field is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'This field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    ReactGA.pageview('login');
    this.state = {
      identifier: '',
      password: '',
      errors: {},
      isLoading: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  isValid() {

    const { errors, isValid } = validateInput(this.state);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.isValid()) {


      var url = this.context.router.route.match.url.substr(6)

      if((url.length<2) ||  (url.indexOf("/login/") >= 0 )){

        url='/home'
      }
      this.setState({ errors: {}, isLoading: true });

      this.props.login(this.state).then(
        (res) => this.context.router.history.push(url),
        (err) => this.setState({ errors: err.response.data.errors, isLoading: false })
      );
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, identifier, password, isLoading } = this.state;

    return (
      <form onSubmit={this.onSubmit} style={{padding:'10px 40px 10px 40px' , marginTop:'0px', background: 'rgba(245, 245, 245, 0.7)' }}>
        <Helmet>
          <title> Audiotation | User Login </title>
        </Helmet>
        <h1>Login</h1>

        { errors.form && <div className="alert alert-danger" style={{fontSize:'1.5rem', textAlign:'center'}}>{errors.form}  <span style={{color:"#333333"}}> <br></br>Try again or call <a  href="tel:+1">
          {/* <i className="icon-phone" style={{paddingLeft:'5px', paddingRight:'5px'}}></i> */}
           <span> </span>
         </a> </span></div> }

        <TextFieldGroup
          field="identifier"
          label="Username / Email"
          value={identifier}
          error={errors.identifier}
          onChange={this.onChange}
        />

        <TextFieldGroup
          field="password"
          label="Password"
          value={password}
          error={errors.password}
          onChange={this.onChange}
          type="password"
        />

        <div className="form-group">

        <Button   disabled={isLoading}  outline style={{borderRadius:"10px", border:"1px solid rgb(52, 0, 146)", borderRadius:"20px", background:"#ffffff"}}>  <span style={{color:"rgb(52, 0, 146)"}}> Login </span> </Button>

        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

LoginForm.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, { login })(LoginForm);
