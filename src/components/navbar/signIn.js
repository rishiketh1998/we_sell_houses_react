import React, {useContext, useState} from "react";
import Modal from "react-bootstrap/Modal";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import useFormHook from "../../hooks/useFormHook";
import axios from 'axios'
import {UserContext} from "../../contexts/userContext";
import Error from "../response/error";

/**
 * @description: Component allows users to sign in to the website by asking them to enter their email id and password.
 * If a user is not registered it allows users to register by sending them to the sign up code route.
 * @param props - {show: to display modal or not,onHide: functions to close the modal,
 * setDisplaySignUpCode: function to set whether to display sign up component  or not}
 * @returns {JSX.Element}
 * @constructor
 */
const SignIn = (props) => {
    const { setUser } = useContext(UserContext)
    const [ userData, handleChange, handleReset] = useFormHook('')
    const [ displayErr, setDisplayErr ] = useState(false)
    const [ errorData, setErrorData ] = useState({})
    const [ showErrModal, setShowErrModal ] = useState(false)
    /**
     * @description: makes a request to the api to allow users to sign in, if user's entered the right details it sign's
     * in the user and stores the data retrieved to User context. If user enters invalid details it does not sign them up but
     * instead display the "Email / Password entered is invalid". Any error that occurs while making the api call is handle by
     * setting displayErr modal to true and sending the response to the errModal that needs to be displayed
     * @param e
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data }  = await axios.post('/proxy/api/v1/login', userData,{withCredentials: true})
            setUser(data.Data)
            setDisplayErr(false)
            handleReset(e)
            props.onHide()
            setErrorData({})
        }catch (err) {
            if(err.response) setDisplayErr(true)
            setShowErrModal(true)
            setErrorData(err.response)
        }
    }
    return (
        <Modal show={props.show} onHide={props.onHide} size="md">
            <Error show={showErrModal} onHide={() => setShowErrModal(false)} data={errorData}/>
            <Modal.Header closeButton>
                <Modal.Title className="text-info" style={{fontFamily: "sans-serif"}}>
                    Sign In
                </Modal.Title>
            </Modal.Header>
            <Modal.Body autoComplete="off">
                <form className="mx-4" onSubmit={handleSubmit}>
                    <TextField required label="Email" fullWidth={true} className="my-2"
                               name="email"
                               variant="outlined"
                               value={userData.email || ''}
                               onChange={handleChange}
                               error={displayErr} helperText={displayErr && "Please enter a valid Email/Password."}/>
                    <TextField required label="Password" fullWidth={true} className="my-2"
                               type="password" name="password"
                               variant="outlined"
                               value={userData.password || ''}
                               onChange={handleChange}
                               error={displayErr} helperText={displayErr && "Please enter a valid Email/Password."}/>
                    <div className="d-flex justify-content-start mt-3">
                        <Button variant="outlined" className="bg-primary text-light" onClick={handleSubmit} type="submit">
                            Sign In
                        </Button>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <p className="pt-1 text-secondary">Don't have an account?</p>
                <div className="d-flex justify-content-end">
                    <Button variant="outlined" className="bg-info text-light" onClick={() => {props.onHide();props.setDisplaySignUpCode(true)}}>
                        Sign Up
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default SignIn;