import { combineReducers } from 'redux';
import { reducer as formReducer} from 'redux-form';
import flashMessages from './reducers/flashMessages';
import auth from './reducers/auth';

export default combineReducers({
  flashMessages,
  auth,
  form:formReducer
});
