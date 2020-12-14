import React, {useState} from "react";
import { Modal } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import useFormHook from "../hooks/useFormHook";
import Alert from '@material-ui/lab/Alert';
import Joi from "joi";
import axios from "axios";
import Error from "./response/error";

/**
 * @description: validates whether user has entered the right email id that is being sent to the agent
 * @param name
 * @param value
 * @returns {[boolean, string]|[boolean, *]}
 */
const validateData = (name,value) => {
    let schema
    switch (name) {
        case 'email':
            schema = Joi.object().keys({[name]: Joi.string().email({minDomainSegments: 2,
                    tlds: {allow: ['com', 'net', 'uk']}}).required().max(256).required()})
            break
        case 'message':
            schema = Joi.object().keys({ [name]: Joi.string().required()})
            break
        default:
            return [false, ""]
    }
    const { error } = schema.validate({ [name]: value })
    if(error) return [true, error.details[0].message]
    else return [false, ""]
}

/**
 * @description: Component that allows users who are interested in a property to send a message to the property agent.
 * @param props [show: boolean to display modal or not;onHide; to close the modal; id:property id the user is interested in)
 * @returns {JSX.Element}
 * @constructor
 */
const Message = (props) => {
    const [ formValues, handleChange, handleReset ] = useFormHook({
        "email": "",
        "message": ""
    })
    const [ successMessage, setSuccessMessage ] = useState("")
    const url = `https://breadbox-app-api.herokuapp.com/api/v1/properties/${props.id}/messages`
    const [ errorData, setErrorData ] = useState({})
    const [ showErrModal, setShowErrModal ] = useState(false)
    /**
     * @description: makes an api call to add the message sent by user to the agent. If the message is successfully sent
     * then it displays an alert success else it displays the error for not being able to send it.
     * @param e
     * @returns {Promise<void>}
     */
    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const { data } = await axios.post(url, formValues)
            setSuccessMessage(data.Message)
            handleReset()
            setErrorData("")
        } catch (err) {
            setSuccessMessage("")
            setShowErrModal(true)
            setErrorData(err.response)
        }
    }
    return (
        <Modal {...props} size="md">
            <Error show={showErrModal} onHide={() => setShowErrModal(false)} data={errorData}/>
            <Modal.Header closeButton>
                <Modal.Title className="text-info">
                    Message Agent
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    successMessage && <Alert severity="success">{successMessage}</Alert>
                }
                <form className="m-3">
                    <TextField required label="Email ID" fullWidth={true} className="my-2"
                               name="email" onChange={handleChange} type="email"
                               variant="outlined"
                               value={formValues["email"]}
                               error={formValues["email"] ? validateData("email",formValues["email"])[0] : false}
                               helperText={formValues["email"] && validateData("email",formValues["email"])[1]}/>
                    <TextField label="Message" fullWidth={true} className="my-2"
                               name="message" onChange={handleChange} type="text"
                               variant="outlined" multiline rows={5}
                               value={formValues["message"]}
                               error={formValues["message"] ? validateData("message",formValues["message"])[0] : false}
                               helperText={formValues["message"] && validateData("message",formValues["message"])[1]}/>
                    <div className="d-flex justify-content-end my-2">
                        <Button variant="outlined" color="primary"
                                onClick={handleSubmit}
                                className="px-4"
                                disabled={!formValues["email"] || validateData("email",formValues["email"])[0] ||
                                !formValues["message"] || validateData("message",formValues["message"])[0]}>
                            Send
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )
}

export default Message;