import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {Button, Input } from 'reactstrap'
import {  Row, Col} from 'reactstrap'
import { connect } from 'react-redux'
import isURL from 'validator/lib/isURL';
const required = value => (value || typeof value === 'number' ? undefined : 'Required *')


const adaptFileEventToValue = delegate => e => delegate(e.target.files[0]);

const FileInput = ({
  input: { value: omitValue, onChange, onBlur, ...inputProps },
  meta: omitMeta,
  ...props
}) => {
  return (
    <input
      onChange={adaptFileEventToValue(onChange)}
      onBlur={adaptFileEventToValue(onBlur)}
      type="file"
      {...props.input}
      {...props}
    />
  );
};

export const external_link = value =>{
    if(!value){
        value= ""
    }
    if(isURL(value) ||  (value==="")){
        return null
    }else{
        return 'not a valid URL'
    }
}




const renderField = ({
  input,
  placeholder,
  type,
  meta: { touched, error, warning }
}) => (
  <div>

    <div>
        {touched &&
          ((error && <div style={{color:"rgb(205,92,92)"}}>{error}</div>) ||
            (warning && <div style={{color:"rgb(205,92,92)"}}>{warning}</div>))}
      <input {...input} placeholder={placeholder} autoFocus={true} type={type} style={{width: '85%', height: '40px', border: '1px solid #cccccc', padding:"1px 5px", marginBottom:"10px"}} />

    </div>
  </div>
)

let CommentBoxCustomerForm = props => {
  const { handleSubmit, pristine, reset,  submitting  } = props

  this.state = {}

  return (
    <form onSubmit={handleSubmit} style={{margin: "5px 0px",fontSize: "1.3rem", fontWeight: "600", border: "2px solid #eeeeee",borderRadius: "12px",padding: "15px",background: "#fffbfb"
     }}>

        <div style={{textAlign:"center", fontSize:"1.8rem", fontWeight:"500", width:"100%", paddingTop:"10px"}}> Upload File  & Add Metadata</div>
        <Row style={{width:"100%"}}>

        <Col xs="12" sm="12" lg="12"  style={{padding:"30px 0 0 20px"}}>
         <label style={{paddingRight:"20px", color:"rgb(52, 0, 146)"}}>Upload File </label>
        <Field name="attachment" component={FileInput}  validate={[required]} type="file" accept=".wav"/>

        </Col>
        <Col xs="6" sm="6" lg="6" style={{paddingLeft:"20px"}}>

        <label style={{paddingTop:'15px', fontWeight:"400", color:"#999999", width:"100%"}}>
                External Link
        </label>
                    <Field
                    name="external_link"
                    component={renderField}
                    type="text"
                    placeholder='External Link'

                    validate={[  external_link ]}
                    style={{width: '85%', height: '50px', border: '1px solid #cccccc', padding:"1px 5px"}}
                  />
        </Col>
        <Col xs="6" sm="6" lg="6" style={{paddingRight:"20px"}}>
                 <label style={{paddingTop:'15px', fontWeight:"400", color:"#999999", width:"100%"}}>
                        Location Name
                 </label>

                   <Field
                    name="location_name"
                    component="input"
                    type="text"

                    placeholder='Location Name'
                    style={{width: '85%', height: '40px', border: '1px solid #cccccc', padding:"1px 5px"}}
                  />
        </Col>
        <Col xs="6" sm="6" lg="6"  style={{paddingLeft:"20px"}}>

        <label style={{paddingTop:'15px', fontWeight:"400", color:"#999999", width:"100%"}}>
                City
        </label>
                <Field
                 name="city"
                 component="input"
                 type="text"

                 placeholder='City'
                 style={{width: '85%', height: '40px', border: '1px solid #cccccc', padding:"1px 5px"}}
               />
        </Col>
        <Col xs="6" sm="6" lg="6" style={{paddingRight:"20px"}}>
                 <label style={{paddingTop:'15px', fontWeight:"400", color:"#999999", width:"100%"}}>
                        District
                 </label>

                   <Field
                    name="district"
                    component="input"
                    type="text"

                    placeholder='District'
                    style={{width: '85%', height: '40px', border: '1px solid #cccccc', padding:"1px 5px"}}
                  />
        </Col>
        <Col xs="6" sm="6" lg="6"  style={{paddingLeft:"20px"}}>

        <label style={{paddingTop:'15px', fontWeight:"400", color:"#999999", width:"100%"}}>
                State
        </label>
                <Field
                 name="state"
                 component="input"
                 type="text"

                 placeholder='State'
                 style={{width: '85%', height: '40px', border: '1px solid #cccccc', padding:"1px 5px"}}
               />
        </Col>
        <Col xs="6" sm="6" lg="6"  style={{paddingRight:"20px"}}>
                 <label style={{paddingTop:'15px', fontWeight:"400", color:"#999999", width:"100%"}}>
                        Country
                 </label>

                   <Field
                    name="country"
                    component="input"
                    type="text"

                    placeholder='Country'
                    style={{width: '85%', height: '40px', border: '1px solid #cccccc', padding:"1px 5px"}}
                  />
        </Col>
        <Col xs="6" sm="6" lg="6"  style={{paddingLeft:"20px"}}>

        <label style={{paddingTop:'15px', fontWeight:"400", color:"#999999", width:"100%"}}>
                Elevation
        </label>
                <Field
                 name="elevation"
                 component="input"
                 type="text"

                 placeholder='Elevation'
                 style={{width: '85%', height: '40px', border: '1px solid #cccccc', padding:"1px 5px"}}
               />
        </Col>
        <Col xs="6" sm="6" lg="6" style={{paddingRight:"20px"}}>
                 <label style={{paddingTop:'15px', fontWeight:"400", color:"#999999", width:"100%"}}>
                        GPS
                 </label>

                   <Field
                    name="gps"
                    component="input"
                    type="text"

                    placeholder='GPS'
                    style={{width: '85%', height: '40px', border: '1px solid #cccccc', padding:"1px 5px"}}
                  />
        </Col>


          </Row>




      <Row style={{padding:"50px 0 20px 5px"}}  >
            <Col xs="12" sm="12" lg="12" >
                <Button  size="lg"  className='btn' style={{fontSize:"4.0rem",  borderRadius:"25px", border:"1px solid rgb(52, 0, 146)", fontWeight:"700" , background:"#fff", padding:"10px"}} type="submit" disabled={submitting}>
                          <span style={{padding:"0 10px", color:" rgb(52, 0, 146)"}}>Submit </span>
                      </Button>
            </Col>

      </Row>

    </form>
  )
}

CommentBoxCustomerForm = reduxForm({
   form: 'reactWidgets'
 })(CommentBoxCustomerForm)
  CommentBoxCustomerForm= connect(
   state => ({

     initialValues: this.state  // pull initial values from account reducer
 })
 )(CommentBoxCustomerForm)
 export default CommentBoxCustomerForm
