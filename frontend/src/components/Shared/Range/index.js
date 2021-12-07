import React, { useState , useEffect} from 'react';
import PropTypes from 'prop-types';

import stylesheet from './Range.module.css';

// var prev = 0
// var nv = 0
function Range({ min, max, handleChange, value }) {

  const [isHovered, setIsHovered] = useState(false);
  let  percentage = ((value - min) / (max - min)) * 100;
  // const [count, setCount] = useState(0);
  // let  timesRun = 0;
  // const [seconds, setSeconds] = useState(0);

//   useEffect(a => {
//
//
//
//       if((value > prev ) && (value <seconds ) &&  (timesRun <1)){
//
//
//       const interval = setInterval(() => {
//
//         timesRun +=1
//         setSeconds(seconds => ((prev)));
//         nv = prev+(((value-prev)/1) * timesRun )
//         prev =nv
//
//
//         // console.log( value, prev, timesRun, nv,  value-prev,  '====')
//
//
//
//
//          if(timesRun === 1){
//              clearInterval(interval);
//              //setSeconds(seconds => ((value)));
//              //prev = value
//          }
//
//     }, 1);
//
//
//
//
// }else{
//      setSeconds(seconds => value);
// }
// }, [value])



  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  const handleInputChange = (e) => {
    handleChange(parseFloat(e.target.value));
  };

  //percentage = ((seconds- min) / (max - min)) * 100;
  const inlineStyle = {
      width:"100%",
      padding:"0px",

    backgroundImage: `-webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(${percentage}%, ${isHovered ? 'green' : '#777'}),
      color-stop(${percentage}%, #333)
    )`,
  };
  //console.log(value, seconds, '---------------------')
  return (
    <input
      className={stylesheet.range}
      max={max}
      min={min}
      onChange={handleInputChange}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      step="0.001"
      style={inlineStyle}
      type="range"
      value={value}

    />
  );
}

Range.defaultProps = {
  min: 0,
};

Range.propTypes = {
  max: PropTypes.number.isRequired,
  min: PropTypes.number,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

export default Range;
