import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import { SET_CURRENT_USER } from './types';

export function setCurrentUser(user,location_info, selected_location,aspect,clicked,languages) {

  return {
    type: SET_CURRENT_USER,
    user,
    location_info,
    selected_location,
    aspect,
    clicked,
    languages

  };
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('locationInfo');
    localStorage.removeItem('selectedLocation');
    localStorage.removeItem('aspect');
    localStorage.removeItem('clicked');
    localStorage.removeItem('languages');
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  }
}

export function login(data) {
  return dispatch => {
    return axios.post('https://api.audiotation.com:8443/api/auth', data).then(res => {
      //console.log(res);
      //console.log(res)
      const token = res.data.token;
      const location_info = res.data.location_info;
      const languages = res.data.languages;
      var selected_location = res.data.selected_location;
      var aspect = null;
      var clicked = null;
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('locationInfo',JSON.stringify(location_info) );
      localStorage.setItem('selectedLocation', selected_location);
      localStorage.setItem('aspect', null);
      localStorage.setItem('clicked', null);
      localStorage.setItem('languages', JSON.stringify(languages));
      setAuthorizationToken(token);
      dispatch(setCurrentUser(jwtDecode(token),location_info, selected_location,aspect,clicked,languages));
    });
  }
}







export function uploadNewFile(data) {
    let formData = new FormData();
    formData.append("location",  data['location_name']);
     formData.append('country', data['country'] );
     formData.append('elevation', data['elevation'] );
     formData.append('district', data['district'] );
     formData.append('city', data['city'] );
     formData.append('state', data['state'] );
      formData.append('external_link', data['external_link'] );
       formData.append('gps', data['gps'] );
       formData.append('added_at', data['uploaded_at_user_time'] );
       formData.append('added_by', data['username'] );
    formData.append("file", data['attachment']);
    formData.append('file_size',data['attachment']['size'] )

    return axios.post('http://13.234.209.69:5000/api/v2/upload_file', formData,  {headers: { 'Content-Type': "multipart/form-data" }}
      ).then(res => {

      const file_data = res.data;
      return file_data;

    });

}

export function addAnnotations(data) {

    return axios.post('http://13.234.209.69:5000/api/v2/add_user_annotations', data).then(res => {

      const annotation_data = res.data;
      return annotation_data;

    });

}
export function editMetadata(data) {

    return axios.post('http://13.234.209.69:5000/api/v2/edit_metadata', data).then(res => {

      const metadata = res.data;
      return metadata

    });

}


export function getNewFile(data) {

    return axios.post('http://13.234.209.69:5000/api/v2/get_file', data).then(res => {

      const file_data = res.data;
      return file_data;

    });

}
