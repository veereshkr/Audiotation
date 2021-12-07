import { SET_CURRENT_USER } from '../actions/types';
import isEmpty from 'lodash/isEmpty';

const initialState = {
  isAuthenticated: false,
  user: {},
  locations:[],
  selected:null,
  aspect:null,
  clicked:null,
  languages:[]
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_CURRENT_USER:
      return {
        isAuthenticated: !isEmpty(action.user),
        user: action.user,
        locations:action.location_info,
        selected:action.selected_location,
        aspect:action.aspect,
        clicked:action.clicked,
        languages:action.languages
      };
    default: return state;
  }
}
