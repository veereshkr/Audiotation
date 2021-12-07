import React from 'react';
import LoginForm from './LoginForm';

import {  Row, Col } from 'reactstrap'
class LoginPage extends React.Component {
  constructor(p){
   super(p);

   this.onClick = this.onClick.bind(this);
   var path = this.props.match.url.split("/")[2]
   if(path ==="expired" || path ==="invalid"){
     this.state={login:false}
   }else{
     this.state={login:true}
   }
 }

  onClick() {
      this.setState({login:!this.state.login})

    }
  render() {
    if(this.state.login){
    return (
      <div className="row" style={{paddingTop:"150px", height:'100% !important', minHeight:"100vh", backgroundImage: `url("/img/audiotation-poster.jpg")` , webkitBackgroundSize: "cover", margin:"0 auto"}}>
         <Row style={{ margin:'0 auto', width:"400px" ,background:'#ffffff',  borderRadius:"10px" , height:"600px", fontSize:"1.3rem" }}>
        <Col xs="12" sm="12" lg="12" >
          <div style={{width:"100%", textAlign:'center' }}>
          <img src="/img/audiotation.png" style={{width:"50%", paddingBottom:"0px"}} alt=""/>
        </div>

          <LoginForm  style={{background:'#rgb(243,243, 243)' , borderRadius:"10px"}}/>

      </Col>
        </Row>
      </div>
    );
  }else{
    return (
      <div className="row" style={{paddingTop:"100px", height:'100% !important'}}>
          <Row style={{ margin:'0 auto', width:"400px" ,background:'#ffffff', padding:'30px', borderRadius:"10px"}}>
         <Col xs="12" sm="12" lg="12" >
          <div style={{width:"100%", textAlign:"center"}}>
          <img src="/img/audiotation.png" style={{width:"60%", paddingBottom:"10px"}} alt=""/>
        </div>


          <div style={{paddingTop:"20px", textAlign:'center', fontSize:'1.5rem'}}> <a role="button" onClick={this.onClick} > Back to Login page </a> </div>
      </Col>
        </Row>

      </div>
    );
  }
  }
}

export default LoginPage;
