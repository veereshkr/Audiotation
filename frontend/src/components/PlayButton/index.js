import React from 'react';
import PropTypes from 'prop-types';
import {  Button} from 'reactstrap'

function PlayButton({ isPlaying, setIsPlaying }) {
  return (
      <div style={{width:"100%" , textAlign:"center" , margin:"-40px 0 0 55px " }}>

    <Button  outline color="#ffffff" style={{border:"1px solid rgb(52, 0, 146)" , borderRadius:"15px"}} onClick={() => setIsPlaying(!isPlaying)}>
      {isPlaying ? <span style={{fontSize:"1.2rem" , color:"rgb(52, 0, 146)", padding:"0px 10px"}} >  <i className="fa fa-pause " style={{padding:"0 5px"}}/> Pause  </span> : <span style={{fontSize:"1.2rem" , color:"rgb(52, 0, 146)",  padding:"0px 10px"}} >  <i className="fa fa-play" style={{padding:"0px 5px"}}/> Play </span>}
    </Button>
    </div>
  );
}

PlayButton.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  setIsPlaying: PropTypes.func.isRequired,
};

export default PlayButton;
