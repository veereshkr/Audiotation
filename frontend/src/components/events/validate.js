const validate = values => {
  const errors = {}

  if(!values.user) {
    errors.user = 'Required'
  }
  if(!values.controls) {
    errors.controls = 'Required'
  }
  if (!values.members || !values.members.length) {
    errors.members = { _error: 'At least one user must be entered' }
  } else {
    const membersArrayErrors = []
    values.members.forEach((member, memberIndex) => {
      const memberErrors = {}
      if (!member || !member.firstName) {
        memberErrors.firstName = 'Required'
        membersArrayErrors[memberIndex] = memberErrors
      }

      if (!member || !member.lastName) {
        memberErrors.lastName = 'Required'
        membersArrayErrors[memberIndex] = memberErrors
      }
      if (!member || !member.email) {
        memberErrors.email = 'Required'
        membersArrayErrors[memberIndex] = memberErrors
      }else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(member.email)) {
        memberErrors.email = 'Invalid email address'
        membersArrayErrors[memberIndex] = memberErrors
      }

      if (member && member.hobbies && member.hobbies.length) {
        const hobbyArrayErrors = []
        member.hobbies.forEach((hobby, hobbyIndex) => {
          if (!hobby || !hobby.length) {
            hobbyArrayErrors[hobbyIndex] =  'Required'
          }
        })
        if(hobbyArrayErrors.length) {
          memberErrors.hobbies = hobbyArrayErrors
          membersArrayErrors[memberIndex] = memberErrors
        }
        if (member.hobbies.length > 5) {
          if(!memberErrors.hobbies) {
            memberErrors.hobbies = []
          }
          memberErrors.hobbies._error = 'No more than five hobbies allowed'
          membersArrayErrors[memberIndex] = memberErrors
        }
      }
    })
    if(membersArrayErrors.length) {
      errors.members = membersArrayErrors
    }
  }
  return errors
}

export default validate
