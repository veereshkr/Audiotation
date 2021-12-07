import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Badge, Nav, NavItem, NavLink as RsNavLink} from 'reactstrap';
import isExternal from 'is-url-external';
import classNames from 'classnames';
import nav from './_nav';
import nav_team from './_nav_team';
//import SidebarHeader from './../SidebarHeader';
import SidebarMinimizer from './../SidebarMinimizer';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import {setCurrentUser} from '../../actions/authActions'

const l_text = { orders:{en:"Orders" , th:"คำสั่งซื้อทั้งหมด"  }, manage_menu:{en:"Manage Menu", th:"จัดการกับเมนู"}, menu:{en:"Menu", th:"เมนู"}, call:{en:"Call Bringbell", th:"โทรหา Bringbell"}, email:{en:"Email Bringbell", th:"ส่งอีเมลถึง Bringbell"},restaurants:{en:'Restaurants', th:"ร้านอาหาร"} }
class Sidebar extends Component {

  constructor(props){
   super(props);
   if(this.props.auth.auth.user.profile.user_language){
      var u_l =  this.props.auth.auth.user.profile.user_language
  }else{
       u_l = 'en'
  }

   this.state= {text: 'Starting...', u_l:u_l};
   if(!this.props.auth.auth.isAuthenticated){

     this.props.history.push('/');

   }
   if(!this.props.auth.auth.isAuthenticated){
     this.props.history.push('/login')

   }
  }


  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');

  }

  mobileSidebarToggle(e) {
    e.preventDefault();

    document.body.classList.toggle('sidebar-mobile-show');
  }

  toggleHidden (value) {


     this.props.auth.auth.selected = value.toString(10);

     localStorage.setItem('selectedLocation', value.toString(10));

     setCurrentUser(jwtDecode(localStorage.jwtToken), JSON.parse(localStorage.locationInfo),value.toString(10),null );
     this.setState({text: 'page should reload...'});

     var path_split = this.props.match.url.split("/");
     var url_path = '/'+this.props.auth.auth.locations[value].name.replace(/[^a-zA-Z0-9]/g, '')+'/'+path_split[2];
     if(path_split[3] && path_split[4]){
         url_path = '/'+this.props.auth.auth.locations[value].name.replace(/[^a-zA-Z0-9]/g, '')+'/'+path_split[2]+'/'+path_split[3]+'/'+path_split[4];
     }


     this.props.history.push(url_path);
  }


  activeRoute(routeName, props) {
    // return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
    return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';

  }

  // todo Sidebar nav secondLevel
  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }


  render() {

    const props = this.props;
    const activeRoute = this.activeRoute;
    const handleClick = this.handleClick;
    const mobileSidebarToggle = this.mobileSidebarToggle;

    // badge addon to NavItem
    const badge = (badge) => {
      if (badge) {
        const classes = classNames( badge.class );
        return (<Badge className={ classes } color={ badge.variant }>{ badge.text }</Badge>)
      }
    };

    // simple wrapper for nav-title item
    const wrapper = item => { return (item.wrapper && item.wrapper.element ? (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)): item.name ) };

    // nav list section title
    const title =  (title, key) => {
      const classes = classNames( "nav-title", title.class);
      return (<li key={key} className={ classes } >{wrapper(title)} </li>);
    };

    // nav list divider
    const divider = (divider, key) => (<li key={key} className="divider"></li>);

    // nav item with nav link
    const navItem = (item, key) => {

      const classes = classNames( item.class );
      const variant = classNames( "nav-link", item.variant ? `nav-link-${item.variant}` : "");

      if(item.location_list){

        return (
          //<div>

          <NavItem key={key} className={classes} >
            { item.selected ?
                <RsNavLink   className={variant} active style={{color:'rgb(142, 191, 222)'}}>
                  <i className={item.icon}></i>{item.name}{badge(item.badge)}
                </RsNavLink>
              :
                <RsNavLink   onClick={this.toggleHidden.bind(this,key)} className={variant} activeclassname="active" >
                  <i className={item.icon}></i>{item.name}{badge(item.badge)}
                </RsNavLink>
            }
          </NavItem>
        //</div>
        )
      }else{

        var url_param = '/'+this.props.auth.auth.locations[this.props.auth.auth.selected].name.replace(/[^a-zA-Z0-9]/g, '')+item.url;

        return (
          <NavItem key={key} className={classes} onClick ={this.mobileSidebarToggle.bind(this)}>
            { isExternal(item.url) ?
                <RsNavLink href={url_param} className={variant} active >
                  <i className={item.icon}></i>{item.name}{badge(item.badge)}
                </RsNavLink>
              :
                <Link to={url_param} className={variant} activeclassname="active">
                  <i className={item.icon}></i>{item.name}{badge(item.badge)}
                </Link>
            }
            {/* { isExternal(item.url) ?
                <RsNavLink href={item.url} className={variant} active>
                  <i className={item.icon}></i>{item.name}{badge(item.badge)}
                </RsNavLink>
              :
                <Link to={item.url} className={variant} activeclassname="active">
                  <i className={item.icon}></i>{item.name}{badge(item.badge)}
                </Link>
            } */}
          </NavItem>
        )
      }
    };

    // nav dropdown
    const navDropdown = (item, key) => {
      return (
        <li key={key} className={activeRoute(item.url, props)} >
          <a className="nav-link nav-dropdown-toggle" role="button" tabIndex="0" onClick={handleClick.bind(this)}><i className={item.icon}></i>{item.name}</a>
          <ul className="nav-dropdown-items" onClick={mobileSidebarToggle.bind(this)}>
            {navList(item.children)}
          </ul>
        </li>)
    };

    // nav link
    const navLink = (item, idx) =>
      item.title ? title(item, idx) :
      item.divider ? divider(item, idx) :
      item.children ? navDropdown(item, idx)
                    : navItem(item, idx) ;


    const navList = (items) => {
      return items.map( (item, index) => navLink(item, index)  );

    };

    
  }
}
function mapStateToProps(state) {
  return {
    auth: state
  };
}

export default connect(mapStateToProps) (Sidebar);
