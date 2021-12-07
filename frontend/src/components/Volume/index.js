import React from 'react';
import PropTypes from 'prop-types';

import Range from '../Shared/Range';

import stylesheet from './Volume.module.css';

function Volume({ volume, setVolume }) {
  return (
    <div className={stylesheet.volume}>
      <Range max={1} value={volume} handleChange={setVolume} />
    </div>
  );
}

Volume.propTypes = {
  setVolume: PropTypes.func.isRequired,
  volume: PropTypes.PropTypes.number.isRequired,
};

export default Volume;
