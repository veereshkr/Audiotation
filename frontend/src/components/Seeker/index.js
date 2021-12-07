import React from 'react';
import PropTypes from 'prop-types';

import convertTime from '../../functions/convertTime';
import Range from '../Shared/Range';

import stylesheet from './Seeker.module.css';

function Seeker({ currentTime, duration, handleTrackClick }) {
  return (
    <div className={stylesheet.seeker}>

      <Range
        max={duration}
        value={currentTime}
        handleChange={handleTrackClick}
      />

      <div style={{width:"100%"}}>
       <span className={stylesheet.time} style={{fontSize:"1.2rem"}}>{convertTime(currentTime)}</span>
        <span style={{float:"right", fontSize:"1.2rem", marginTop:"5px"}} className={stylesheet.time}>{convertTime(duration)}</span>
       </div>


    </div>
  );
}

Seeker.propTypes = {
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  handleTrackClick: PropTypes.func.isRequired,
};

export default Seeker;
