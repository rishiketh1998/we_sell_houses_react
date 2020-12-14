import React, {useState} from "react";
import axios from "axios"
import { Modal } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import useFormHook from "../../hooks/useFormHook";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import Error from "../response/error";
const postalCodePattern = "^([A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}|GIR ?0A{2})$"

/**
 * @description: It uses Joi library to validate whether the user is entering
 * valid details (valid - in order to satisfy api condition) or not.
 *
 * @param name - data field user is entering
 * @param value - value the is entering for the data field
 * @returns {[boolean, string]|[boolean, *]} : if an error occurs it returns true along with the message for it to error
 * else it returns false and empty message
 */
const validateData = (name, value) => {
    let schema
    switch (name) {
        case 'firstName':
            schema = Joi.object().keys({[name]: Joi.string().required()})
            break
        case 'lastName':
            schema = Joi.object().keys({[name]: Joi.string().required()})
            break
        case 'email':
            schema = Joi.object().keys({[name]: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'uk']}}).required().max(256).required()})
            break
        case 'password':
            schema = Joi.object().keys({[name]: passwordComplexity().required()})
            break
        case 'phoneNo':
            schema = Joi.object().keys({ [name]: Joi.string().min(10).max(11).required()})
            break
        case 'city':
            schema = Joi.object().keys({ [name]: Joi.string().required()})
            break
        case 'doorNo':
            schema = Joi.object().keys({ [name]: Joi.string().required()})
            break
        case 'street':
            schema = Joi.object().keys({ [name]: Joi.string().required()})
            break
        case 'postalCode':
            value = value.toUpperCase()
            schema = Joi.object().keys({ [name]: Joi.string().pattern(new RegExp(postalCodePattern)).required()})
            break
        default:
            return [false, ""]
    }
    const { error } = schema.validate({ [name]: value })
    if(error) return [true, error.details[0].message]
    else return [false, ""]
}

/**
 * @description: It checks whether the users' entered required field values and if any required field values is not entered
 * it returns false else it returns true
 * @param data
 * @returns {boolean}
 */
const checkAllField = (data) => {
   const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phoneNo', 'city', 'doorNo','postalCode', 'street']
   const enteredFields = Object.keys(data)
    for(const key of requiredFields) {
        if(!enteredFields.includes(key)) return false
    }
    return true
}

/**
 * @description: it checks whether all the fields error messages are set to display or not. if any one of the
 * fields error message/display is set to true then it returns false or else it returns true
 * @param data
 * @returns {boolean}
 */
const validateDataEntry = (data) => {
    for(const key in data) {
        if(data[key].display) return false
    }
    return true
}

/**
 * @description: It filters through user values, in order to remove unnecessary data that must not be sent to the
 * server.
 * @param obj
 * @returns {{address: {}}}
 */
const filterUserObj = (obj) => {
    delete obj['confirmPassword']
    obj['postalCode'] = obj['postalCode'].toUpperCase()
    const updateObj = {
        address: {
        }
    }
    const addressChild = ['city', 'doorNo', 'postalCode', 'county', 'street']
    for(const key in obj) {
        if(addressChild.includes(key)) updateObj['address'][key] = obj[key]
        else updateObj[key] = obj[key]
    }
    return updateObj
}

/**
 * @description: Registers new users by retrieving all the required information from the user.
 * If the user is registered successfully it displays a sign up success component.
 * @param props - {show: to display modal or not,onHide: functions to close the modal,
 * setDisplaySignUpSuccess: function to set whether to display sign up success component  or not}
 * @returns {JSX.Element}
 * @constructor
 */
const SignUp = (props) => {
    const [ userData, handleUser, handleReset] = useFormHook('')
    const [ displayErr, setDisplayErr ] = useState({
        firstName: {display: false, message: ""},
        lastName: {display: false, message: ""},
        phoneNo: {display: false, message: ""},
        profileImg: {display: false, message: ""},
        email: {display: false, message: ""},
        password: {display: false, message: ""},
        confirmPassword: {display: false, message: ""},
        doorNo: {display: false, message: ""},
        street: {display: false, message: ""},
        city: {display: false, message: ""},
        county: {display: false, message: ""},
        postalCode: {display: false, message: ""}
    })
    const [ errorData, setErrorData ] = useState({})
    const [ showErrModal, setShowErrModal ] = useState(false)
    /**
     * @description: verifies whether the password matches confirm password or not
     * @returns {boolean} - matches then true else false
     */
    const checkPassword = () => userData.password === userData.confirmPassword;
    /**
     * @description: it updates user data and calls validateData function to identify whether an error exists or not.
     * @param e
     */
    const handleUserData = e => {
       handleUser(e)
       const [display, message] = (validateData(e.target.name, e.target.value))
       const obj = JSON.parse(JSON.stringify(displayErr))
       obj[e.target.name].display = display
       obj[e.target.name].message = message
       setDisplayErr(obj)
   }
    /**
     * @description: makes an api call to register users provided all the data entered is valid. If an error occurs during
     * the api call it displays error modal and the error for it to occur.
     * @param e
     * @returns {Promise<void>}
     */
    const handleSubmit = async e => {
        e.preventDefault()
        const obj = JSON.parse(JSON.stringify(userData))
        const userObj = filterUserObj(obj)
        try {
            await axios.post('/api/v1/users', userObj)
            handleReset()
            props.onHide()
            props.setDisplaySignUpSuccess(true)
            setErrorData({})
        }catch (err) {
            if(err.response.status !== 500 && err.response.data.Error.split(' ')[0] === 'Email') {
                const obj = JSON.parse(JSON.stringify(displayErr))
                obj['email'].display = true
                obj['email'].message = "Email id already exists, try signing in or enter a new email id."
                setDisplayErr(obj)
            }
            setShowErrModal(true)
            setErrorData(err.response)
        }
    }
    return (
        <Modal show={props.show} onHide={props.onHide} size="xl">
            <Error show={showErrModal} onHide={() => setShowErrModal(false)} data={errorData}/>
            <Modal.Header closeButton>
                <Modal.Title className="text-primary">
                    Sign Up
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="row mx-4">
                        <div className="col-12">
                            <p className="lead text-info font-weight-bold">User Details:</p>
                        </div>
                        <div className="col-md-6">
                            <TextField required label="First Name" fullWidth={true} className="my-1"
                                       name="firstName" onChange={handleUserData} type="text"
                                       variant="outlined"
                                       error={displayErr.firstName.display} helperText={displayErr.firstName.message}/>
                            <TextField required label="Last Name" fullWidth={true} className="my-1"
                                       name="lastName" onChange={handleUserData} type="text"  variant="outlined"
                                       error={displayErr.lastName.display} helperText={displayErr.lastName.message}/>
                            <TextField required label="Phone No" fullWidth={true} className="my-1"
                                       name="phoneNo" onChange={handleUserData} type="number"  variant="outlined"
                                       error={displayErr.phoneNo.display} helperText={displayErr.phoneNo.message}/>
                            <TextField label="Profile Picture URL" fullWidth={true} className="my-1"
                                       name="profileImg" onChange={handleUserData}  variant="outlined"
                                       error={displayErr.profileImg.display} helperText={displayErr.profileImg.message}/>
                        </div>
                        <div className="col-md-6">
                            <TextField required label="Email" fullWidth={true} className="my-1"
                                       name="email" onChange={handleUserData} type="email"  variant="outlined"
                                       error={displayErr.email.display} helperText={displayErr.email.message}/>
                            <TextField required label="Password" fullWidth={true} className="my-1"
                                       name="password" onChange={handleUserData} type="password"  variant="outlined"
                                       error={displayErr.password.display} helperText={displayErr.password.message}/>
                            <TextField required label="Confirm Password" fullWidth={true} className="my-1"
                                       name="confirmPassword" onChange={handleUserData} type="password"  variant="outlined"
                                       disabled={displayErr.password.display || !userData.password}
                                       error={userData.password !== userData.confirmPassword}
                                       helperText={userData.password !== userData.confirmPassword ? "The password entered does not match the above password" : ""}/>
                        </div>
                    </div>
                    <hr />
                    <div className="row mx-4 my-2">
                        <div className="col-12">
                            <p className="lead text-info font-weight-bold">Address:</p>
                        </div>
                        <div className="col-md-6">
                            <TextField required label="Door No" fullWidth={true} className="my-1"
                                       name="doorNo" onChange={handleUserData}  variant="outlined"
                                       error={displayErr.doorNo.display} helperText={displayErr.doorNo.message}/>
                            <TextField required label="Street" fullWidth={true} className="my-1"
                                       name="street" onChange={handleUserData}  variant="outlined"
                                       error={displayErr.street.display} helperText={displayErr.street.message}/>
                            <TextField required label="City" fullWidth={true} className="my-1"
                                       name="city" onChange={handleUserData}  variant="outlined"
                                       error={displayErr.city.display} helperText={displayErr.city.message}/>
                        </div>
                        <div className="col-md-6">
                            <TextField label="County" fullWidth={true} className="my-1" variant="outlined"
                                       name="county" onChange={handleUserData}/>
                            <TextField required label="Postal Code" fullWidth={true} className="my-1"
                                       name="postalCode" onChange={handleUserData}
                                       error={displayErr.postalCode.display}  variant="outlined"
                                       helperText={displayErr.postalCode.message ? "Please enter a valid UK postal code." : ""}/>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="contained" color="primary" className="text-light"
                                disabled={!(checkAllField(userData) && validateDataEntry(displayErr) && checkPassword())}
                                onClick={handleSubmit} type="submit">
                            Sign Up
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default SignUp;