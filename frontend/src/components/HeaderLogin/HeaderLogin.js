import React, {Component} from 'react';
import {NavbarBrand, NavbarToggler, NavItem, Nav,NavLink} from 'reactstrap';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import PropTypes from 'prop-types';

const navColorWeight = {color:'#fff', fontWeight:'600',}

class HeaderLogin extends Component {
  logout(e) {
    e.preventDefault();
    this.props.logout();
  }

  constructor(props) {
    super(props);


    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }


  render() {
    return (
      <header className="app-header navbar" style={{position:"relative"}} >
        <NavbarToggler style={navColorWeight} className="d-lg-none" onClick={this.mobileSidebarToggle}>
          {/* <i className="fa fa-reorder fa-lg "></i> */}
        </NavbarToggler>
        <NavbarBrand href="#"></NavbarBrand>
        <NavbarToggler style={navColorWeight} className="d-md-down-none" onClick={this.sidebarToggle}>
          {/* <i className="fa fa-reorder fa-lg "></i> */}
        </NavbarToggler>
        <Nav className="d-md-down-none" navbar>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink href="/login" style={navColorWeight}><span className="d-md-down-none" style={navColorWeight}>Login</span></NavLink>
          </NavItem>


        </Nav>

      </header>
    );
  }
}

HeaderLogin.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}
export default connect(mapStateToProps, { logout })(HeaderLogin);
