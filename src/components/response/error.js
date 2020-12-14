import React from "react";
import {Modal, Button} from "react-bootstrap";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

/**
 * @description: It sets the error message depending on the status code for the error.
 */
const errorMessage = (status) => {
    let message
    switch (status) {
        case 401:
            message = "Please Sign In to access route."
            break
        case 403:
            message = "Please enter a valid email and password"
            break
        case 400:
            message = "Please verify the data entered and try again."
            break
        default:
            message = "Please try again in sometime."
    }
    return message
}

/**
 * @description: component to display error message and status code depending on the status code.
 * @param show - boolean - to display error component or not
 * @param onHide - function - to hide the error modal
 * @param data - object - error object returned from catch block when request fails
 * @returns {JSX.Element}
 * @constructor
 */
const Error = ({show, onHide, data}) => {
    let message = errorMessage(data.status)
    /**
     * @description: it hides the error modal and if the status code is 401 (Unauthorized) then it refreshes the page
     * in order to not allow users to  view any other details
     */
    const handleHide = () => {
        onHide()
        if(data.status === 401) window.location.reload()
    }
    return (
        <Modal show={show} onHide={handleHide} size="md"
               backdrop="static"
               keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title className="text-danger" style={{fontFamily: "sans-serif"}}>
                    {data.statusText}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert severity="error" className="m-2">
                    <AlertTitle>Error ({data.status})</AlertTitle>
                    {data.statusText}. {message}
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleHide} variant="outline-danger" className="px-4">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Error