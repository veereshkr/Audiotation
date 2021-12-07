
const validate = values => {
  const errors = {};
  if (!values.item_id) {
   errors.item_id = "Required";
 }
 if (!values.price) {
   errors.price = "Required";
 }
 if (!values.name) {
   errors.name = "Required";
 }

 
  return errors;
};

export default validate;
