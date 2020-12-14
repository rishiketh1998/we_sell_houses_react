import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import useFormHook from "../../hooks/useFormHook";

/**
 * @author Rishi
 * @description: Component used to verify whether the a user can register or not depending on the sign up code entered.
 * @param props - {show: to display modal or not,onHide: functions to close the modal,
 * setDisplaySignUp: function to set whether to display sign up modal or not}
 * @returns {JSX.Element}
 * @constructor
 */
const SignUpCode = (props) => {
    const [ codeEntered, handleChange, handleReset ] = useFormHook('')
    const [ displayErr, setErr ] = useState(false)
    /**
     * @description: verifies whether the entered code is valid or not.. If the entered code is valid, it allows users
     * to sign up else it displays an invalid code is entered.
     * @param e
     */
    const handleSubmit = e => {
        e.preventDefault()
        if(codeEntered.code === 'we_sell_houses_agent') {
            handleReset()
            props.onHide()
            props.setDisplaySignUp(true)
            setErr(false)
        }
        else setErr(true)
    }
    return (
        <Modal show={props.show} onHide={props.onHide} size="md">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Enter Your Sign Up Code
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="mx-4" onSubmit={handleSubmit}>
                    <TextField required label="Sign Up Code" fullWidth={true} className="my-2" name="code"
                               value={codeEntered.code || ''}
                               onChange={handleChange}
                               variant="outlined"
                               error={displayErr} helperText={displayErr && "The entered code is invalid. Please enter a valid code."}/>
                   <div className="d-flex justify-content-end my-3">
                       <Button variant="contained" color="primary" className="text-light" type="submit" onClick={handleSubmit}>
                           Submit
                       </Button>
                   </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default SignUpCode;
